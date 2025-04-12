import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { Prompt } from "@/types";
import { ModelIcon } from "@/components/ModelIcon";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { AdUnit } from '@/components/AdUnit';

const modelTypes = ['ChatGPT', 'Claude', 'Gemini'];

export function EditPrompt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const queryOptions: UseQueryOptions<Prompt, Error> = {
    queryKey: ["prompt", id],
    queryFn: async () => {
      if (!id) throw new Error("No prompt ID provided");
      const docRef = doc(db, "prompts", id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("Prompt not found");
      }
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Prompt;
    },
    enabled: !!id,
    retry: false
  };

  const { data: prompt, isLoading, error } = useQuery(queryOptions);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
      navigate("/");
      return;
    }

    if (prompt) {
      setTitle(prompt.title);
      setDescription(prompt.description);
      setContent(prompt.content);
      setCategory(prompt.category);
      setSelectedModels(prompt.modelType || []);
      setTags(prompt.tags);
    }
  }, [prompt, navigate]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id || !prompt) return;

    // Check permissions before submitting
    if (prompt.authorId !== user.uid && !user.isAdmin) {
      toast.error("You don't have permission to edit this prompt");
      setIsEditing(false);
      return;
    }

    try {
      const promptRef = doc(db, "prompts", id);
      await updateDoc(promptRef, {
        title,
        description,
        content,
        category,
        modelType: selectedModels,
        tags,
        updatedAt: new Date(),
      });

      toast.success("Prompt updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating prompt:", error);
      toast.error("Failed to update prompt");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!prompt) {
    return null;
  }

  const canEdit = user && (prompt.authorId === user.uid || user.isAdmin);

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="mb-8 text-3xl font-bold">Edit Prompt</h1>

      {/* Ad Banner */}
      <div className="mb-8">
        <AdUnit type="banner" />
      </div>

      <div className="mx-auto max-w-2xl py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <BookOpenIcon className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <span className="text-foreground">{isEditing ? "Edit Prompt" : "Prompt Details"}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{isEditing ? "Edit Prompt" : "Prompt Details"}</h1>
              <p className="text-muted-foreground">
                {isEditing ? "Update your AI prompt" : "View prompt details"}
              </p>
            </div>
            {canEdit && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel Edit" : "Edit Prompt"}
              </Button>
            )}
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Prompt Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="min-h-[200px]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Writing">Writing</SelectItem>
                    <SelectItem value="Coding">Coding</SelectItem>
                    <SelectItem value="Analysis">Analysis</SelectItem>
                    <SelectItem value="Creative">Creative</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelTypes">Model Types</Label>
                <Select
                  value={selectedModels.join(',')}
                  onValueChange={(value: string) => setSelectedModels(value.split(','))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model types" />
                  </SelectTrigger>
                  <SelectContent>
                    {modelTypes.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <Input
                id="tags"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type a tag and press Enter"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update Prompt</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">{prompt.title}</h2>
              <p className="text-muted-foreground">{prompt.description}</p>
            </div>

            <div className="space-y-2">
              <Label>Prompt Content</Label>
              <div className="rounded-md border bg-muted p-4 font-mono">
                {prompt.content}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <div className="rounded-md border bg-muted p-2">{prompt.category}</div>
              </div>

              <div className="space-y-2">
                <Label>Model Types</Label>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(prompt.modelType) ? prompt.modelType : [prompt.modelType].filter(Boolean)).map((model) => (
                    <div key={model} className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm">
                      <ModelIcon model={model} className="h-4 w-4" />
                      {model}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(prompt.tags) ? prompt.tags : [prompt.tags].filter(Boolean)).map((tag) => (
                  <div
                    key={tag}
                    className="rounded-full bg-secondary px-3 py-1 text-sm"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 