import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Prompt } from '@/types';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categories = ['Writing', 'Coding', 'Analysis', 'Creative', 'Business'];
const modelTypes = ['ChatGPT', 'Claude', 'Gemini'];

interface CreatePromptFormData {
  title: string;
  description: string;
  content: string;
  category: string;
  modelType: string[];
  tags: string;
}

export function CreatePrompt() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreatePromptFormData>({
    title: '',
    description: '',
    content: '',
    category: '',
    modelType: [],
    tags: '',
  });

  if (!user) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSubmitting(true);

      const promptData = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        modelType: formData.modelType,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        createdAt: new Date(),
        updatedAt: new Date(),
        upvotes: 0,
      };

      const docRef = await addDoc(collection(db, 'prompts'), promptData);
      toast.success('Prompt created successfully!');
      navigate(`/prompt/${docRef.id}`);
    } catch (error) {
      console.error('Error creating prompt:', error);
      toast.error('Failed to create prompt');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="mb-8 text-3xl font-bold">Create New Prompt</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Prompt Content</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
            className="min-h-[200px] font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Model Types</Label>
          <div className="flex flex-wrap gap-2">
            {modelTypes.map((model) => (
              <Button
                key={model}
                type="button"
                variant={formData.modelType.includes(model) ? 'default' : 'outline'}
                onClick={() => {
                  const newModelType = formData.modelType.includes(model)
                    ? formData.modelType.filter((m) => m !== model)
                    : [...formData.modelType, model];
                  setFormData({ ...formData, modelType: newModelType });
                }}
              >
                {model}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Prompt'}
        </Button>
      </form>
    </div>
  );
} 