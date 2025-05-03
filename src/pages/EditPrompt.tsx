import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
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
import { BookOpenIcon, TrashIcon } from "@heroicons/react/24/outline";
import { AdUnit } from '@/components/AdUnit';
import { useQueryClient } from "@tanstack/react-query";
import { AI_MODELS } from '@/lib/constants';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ImageUpload } from '@/components/ImageUpload';
import { isFeatureEnabled } from '@/lib/posthog';

export function EditPrompt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [images, setImages] = useState<{ url: string; name: string }[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);

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
    // Check if user is logged in
    if (!user) {
      toast.error("Please log in to edit prompts");
      navigate("/");
      return;
    }

    if (error) {
      toast.error(error.message);
      navigate("/");
      return;
    }

    // Check if user has permission to edit this prompt
    if (prompt && user.role !== 'admin' && prompt.authorId !== user.uid) {
      toast.error("You don't have permission to edit this prompt");
      navigate(`/prompt/${id}`);
      return;
    }

    if (prompt) {
      setTitle(prompt.title);
      setDescription(prompt.description);
      setContent(prompt.content);
      setCategory(prompt.category);
      setSelectedModels(prompt.modelType || []);
      setTags(prompt.tags);
      setImages(prompt.images || []);
      setIsAnonymous(prompt.authorName === 'Anonymous');
    }
  }, [prompt, user, navigate, id]);

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
    if (prompt.authorId !== user.uid && user.role !== 'admin') {
      toast.error("You don't have permission to edit this prompt");
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
        images,
        authorName: isAnonymous ? 'Anonymous' : (user.displayName || 'Anonymous'),
        updatedAt: new Date(),
      });

      // Invalidate both the specific prompt query and the prompts list
      queryClient.invalidateQueries({ queryKey: ["prompt", id] });
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      
      toast.success("Prompt updated successfully!");
      navigate(`/prompt/${id}`);
    } catch (error) {
      console.error("Error updating prompt:", error);
      toast.error("Failed to update prompt");
    }
  };

  const handleDelete = async () => {
    if (!user || !id || !prompt) return;

    // Check permissions
    if (!user.isAdmin && prompt.authorId !== user.uid) {
      toast.error("You don't have permission to delete this prompt");
      return;
    }

    try {
      await deleteDoc(doc(db, "prompts", id));
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["prompt", id] });
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
      
      toast.success("Prompt deleted successfully");
      navigate("/"); // Navigate back to home after deletion
    } catch (error) {
      console.error("Error deleting prompt:", error);
      toast.error("Failed to delete prompt");
    }
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!prompt || (user.role !== 'admin' && prompt.authorId !== user.uid)) {
    return null;
  }

  const canEdit = user && (prompt.authorId === user.uid || user.role === 'admin');

  return (
    <div className="container py-8 max-w-2xl">
      <div className="mb-8">
        <div className="flex gap-2 items-center mb-4 text-sm text-muted-foreground">
          <Link to="/" className="flex gap-1 items-center transition-colors hover:text-foreground">
            <BookOpenIcon className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="text-foreground">Edit Prompt</span>
        </div>
        <h1 className="text-3xl font-bold">Edit Prompt</h1>
        <p className="text-muted-foreground">Update your AI prompt</p>
      </div>

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
                <SelectItem value="Analysis">Image Generation</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Analysis">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="modelTypes">Preferred AI Models</Label>
            <Select
              value={selectedModels.join(',')}
              onValueChange={(value: string) => setSelectedModels(value.split(','))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select AI models" />
              </SelectTrigger>
              <SelectContent>
                {AI_MODELS.map((model) => (
                  <SelectItem key={model} value={model}>
                    <div className="flex gap-2 items-center">
                      <ModelIcon model={model} className="w-4 h-4" />
                      {model}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex gap-1 items-center px-2 py-1 text-sm rounded-md bg-secondary text-secondary-foreground"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-secondary-foreground/50 hover:text-secondary-foreground"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Add a tag and press Enter"
          />
        </div>

        {isFeatureEnabled('enable-image-upload') && (
          <div className="space-y-2">
            <Label>Images</Label>
            <ImageUpload
              images={images}
              onChange={setImages}
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="anonymous"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="anonymous">Post anonymously</Label>
        </div>

        <div className="flex justify-between items-center">
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                className="flex gap-2 items-center"
              >
                <TrashIcon className="w-4 h-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the prompt
                  "{prompt?.title}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/prompt/${id}`)}
            >
              Cancel
            </Button>
            <Button type="submit">Update Prompt</Button>
          </div>
        </div>
      </form>
    </div>
  );
} 