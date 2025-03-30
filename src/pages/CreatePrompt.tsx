import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

const categories = ['Writing', 'Coding', 'Analysis', 'Creative', 'Business'];
const modelTypes = ['ChatGPT', 'Claude', 'Gemini'];

export function CreatePrompt() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [usageTips, setUsageTips] = useState('');
  const [recommendedModels, setRecommendedModels] = useState('');

  if (!user) {
    navigate('/');
    return null;
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const promptData = {
        title,
        description,
        content,
        category,
        modelType: selectedModels,
        tags,
        authorId: user.uid,
        authorName: user.displayName,
        createdAt: new Date(),
        updatedAt: new Date(),
        upvotes: 0,
        isFeatured: false,
        isFlagged: false,
        ...(usageTips.trim() && { usageTips: usageTips.trim() }),
        ...(recommendedModels.trim() && {
          recommendedModels: recommendedModels
            .split(',')
            .map((m) => m.trim())
            .filter((m) => m.length > 0),
        }),
      };

      await addDoc(collection(db, 'prompts'), promptData);
      toast.success('Prompt created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error creating prompt:', error);
      toast.error('Failed to create prompt. Please try again.');
    }
  };

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-4xl font-bold">Create New Prompt</h1>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                required
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                required
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Prompt Content</Label>
              <Textarea
                id="content"
                required
                value={content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={setCategory}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelTypes">Model Types</Label>
              <Select
                value={selectedModels.join(',')}
                onValueChange={(value: string) => setSelectedModels(value.split(','))}
              >
                <SelectTrigger id="modelTypes">
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

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={newTag}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTag(e.target.value)}
                onKeyPress={handleAddTag}
                placeholder="Press Enter to add a tag"
              />
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-primary/60 hover:text-primary"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="usageTips">Usage Tips (Optional)</Label>
              <Textarea
                id="usageTips"
                value={usageTips}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUsageTips(e.target.value)}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recommendedModels">
                Recommended Models (Optional, comma-separated)
              </Label>
              <Input
                id="recommendedModels"
                value={recommendedModels}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecommendedModels(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full">
              Create Prompt
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 