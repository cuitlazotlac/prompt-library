import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
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
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

const categories = ['Writing', 'Coding', 'Analysis', 'Creative', 'Business'];
const modelTypes = ['ChatGPT', 'Claude', 'Gemini'];

interface CreatePromptFormData extends Omit<Prompt, 'id' | 'authorId' | 'authorName' | 'createdAt' | 'updatedAt' | 'favorites' | 'favoriteUsers' | 'upvotes' | 'usageTips' | 'recommendedModels'> {
  images: { url: string; name: string; }[];
}

export function CreatePrompt() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreatePromptFormData>({
    title: '',
    description: '',
    content: '',
    category: '',
    model: '',
    modelType: [],
    tags: [],
    images: [],
    userId: '',
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  if (!user) {
    navigate('/');
    return null;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + selectedImages.length > 3) {
        toast.error('You can only upload up to 3 images');
        return;
      }
      setSelectedImages([...selectedImages, ...files]);
      
      // Create preview URLs
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...selectedImages];
    const newPreviews = [...imagePreviews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const promptRef = doc(collection(db, 'prompts'));
      const promptId = promptRef.id;

      // Upload images if any
      const uploadedImages: { url: string; name: string; }[] = [];
      for (const image of selectedImages) {
        const storageRef = ref(storage, `prompts/${promptId}/${image.name}`);
        await uploadBytes(storageRef, image);
        const downloadURL = await getDownloadURL(storageRef);
        uploadedImages.push({
          url: downloadURL,
          name: image.name,
        });
      }

      const { images: _, ...formDataWithoutImages } = formData;
      const promptData = {
        ...formDataWithoutImages,
        userId: user.uid,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        createdAt: new Date(),
        updatedAt: new Date(),
        favorites: 0,
        favoriteUsers: [] as string[],
        upvotes: 0,
        usageTips: [] as string[],
        recommendedModels: [] as string[],
        images: uploadedImages,
      } satisfies Omit<Prompt, 'id'>;

      await setDoc(promptRef, promptData);
      toast.success('Prompt created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error creating prompt:', error);
      toast.error('Failed to create prompt');
    } finally {
      setIsLoading(false);
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
            className="min-h-[200px]"
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
            value={formData.tags.join(', ')}
            onChange={(e) =>
              setFormData({
                ...formData,
                tags: e.target.value.split(',').map((tag) => tag.trim()),
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>Images (up to 3)</Label>
          <div className="flex flex-wrap gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="h-32 w-32 rounded-lg object-cover"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => removeImage(index)}
                >
                  <XMarkIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {imagePreviews.length < 3 && (
              <div className="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed">
                <Label htmlFor="images" className="cursor-pointer">
                  <PhotoIcon className="h-8 w-8 text-muted-foreground" />
                </Label>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            )}
          </div>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Prompt'}
        </Button>
      </form>
    </div>
  );
} 