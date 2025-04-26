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
import { ModelIcon } from '@/components/ModelIcon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import '@/styles/model-colors.css';
import { AdUnit } from '@/components/AdUnit';
import { ImageUpload } from '@/components/ImageUpload';
import { isFeatureEnabled } from '@/lib/posthog';

const categories = ['Writing', 'Coding', 'Analysis', 'Creative', 'Business'];
const modelTypes = [
  'All AI Models',
  'ChatGPT',
  'Claude',
  'Gemini',
  'Mistral',
  'Grok',
  'LLaMA',
  'Midjourney'
];

interface CreatePromptFormData {
  title: string;
  description: string;
  content: string;
  category: string;
  modelType: string[];
  tags: string;
  images: { url: string; name: string }[];
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
    images: [],
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
        images: formData.images,
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
    <div className="container py-8 max-w-2xl">
      <h1 className="mb-8 text-3xl font-bold">Create New Prompt</h1>

      {/* Ad Banner */}
      {/* <div className="mb-8">
        <AdUnit type="banner" />
      </div> */}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <Label htmlFor="title">Title</Label>
            <span className="text-sm text-muted-foreground">(Required)</span>
          </div>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <Label htmlFor="description">Description</Label>
            <span className="text-sm text-muted-foreground">(Required)</span>
          </div>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <Label htmlFor="content">Prompt Content</Label>
            <span className="text-sm text-muted-foreground">(Required)</span>
          </div>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
            className="min-h-[200px] font-mono"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <Label htmlFor="category">Category</Label>
            <span className="text-sm text-muted-foreground">(Required)</span>
          </div>
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
          <div className="flex justify-between items-baseline">
            <Label>Preferred AI Models</Label>
            <span className="text-sm text-muted-foreground">(Optional)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {modelTypes.map((model) => {
              const modelKey = model.toLowerCase().replace(/\s+/g, '-');
              return (
                <Button
                  key={model}
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const newModelType = formData.modelType.includes(model)
                      ? formData.modelType.filter((m) => m !== model)
                      : [...formData.modelType, model];
                    setFormData({ ...formData, modelType: newModelType });
                  }}
                  className={`gap-2 ${
                    model === 'All AI Models' ? 'model-button-all-ai-models' : `model-button model-button-${modelKey}`
                  }`}
                  data-state={formData.modelType.includes(model) ? 'active' : undefined}
                >
                  <ModelIcon model={model} className={model === 'All AI Models' ? 'icon' : ''} />
                  <span>{model}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <span className="text-sm text-muted-foreground">(Optional)</span>
          </div>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="e.g. writing, story, creative"
          />
        </div>

        {isFeatureEnabled('enable-image-upload') && (
          <div className="space-y-2">
            <Label>Images (Optional)</Label>
            <ImageUpload
              images={formData.images}
              onChange={(images) => setFormData({ ...formData, images })}
            />
          </div>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Prompt'}
        </Button>
      </form>
    </div>
  );
} 