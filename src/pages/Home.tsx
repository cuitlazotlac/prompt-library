import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, orderBy, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Plus } from 'lucide-react';
import { db } from '@/lib/firebase';
import { Prompt } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { PromptCard } from '@/components/PromptCard';
import toast from 'react-hot-toast';

const categories = ['All', 'Writing', 'Coding', 'Analysis', 'Creative', 'Business'];
const modelTypes = ['ChatGPT', 'Claude', 'Gemini', 'All'];

interface HomeProps {
  searchQuery: string;
}

export function Home({ searchQuery }: HomeProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedModel, setSelectedModel] = useState('All');
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: prompts, isLoading } = useQuery({
    queryKey: ['prompts'],
    queryFn: async () => {
      const q = query(collection(db, 'prompts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Prompt[];
    }
  });

  const { data: favorites } = useQuery({
    queryKey: ['favorites', user?.uid],
    queryFn: async () => {
      if (!user) return new Set<string>();
      const favoritesRef = collection(db, 'favorites', user.uid, 'prompts');
      const querySnapshot = await getDocs(favoritesRef);
      return new Set(querySnapshot.docs.map(doc => doc.id));
    },
    enabled: !!user
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ promptId, isFavorite }: { promptId: string; isFavorite: boolean }) => {
      if (!user) throw new Error('User not authenticated');
      
      const favoriteRef = doc(db, 'favorites', user.uid, 'prompts', promptId);
      
      if (isFavorite) {
        await deleteDoc(favoriteRef);
      } else {
        await setDoc(favoriteRef, { timestamp: new Date() });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.uid] });
      toast.success('Favorites updated successfully');
    },
    onError: (error) => {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  });

  const handleFavorite = (promptId: string) => {
    if (!user) {
      toast.error('Please log in to add favorites');
      return;
    }
    const isFavorite = favorites?.has(promptId) ?? false;
    toggleFavoriteMutation.mutate({ promptId, isFavorite });
  };

  const filteredPrompts = prompts?.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || prompt.category === selectedCategory;
    const matchesModel = selectedModel === 'All' || prompt.modelType.includes(selectedModel);
    return matchesSearch && matchesCategory && matchesModel;
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">AI Prompt Library</h1>
        <p className="text-lg text-muted-foreground">
          Discover and share effective prompts for various AI models
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {modelTypes.map((model) => (
          <Button
            key={model}
            variant={selectedModel === model ? 'default' : 'outline'}
            onClick={() => setSelectedModel(model)}
            className="rounded-full"
          >
            {model}
          </Button>
        ))}
      </div>

      {user && (
        <Button
          onClick={() => navigate('/create')}
          className="mb-8 gap-2"
        >
          <Plus className="h-4 w-4" />
          Create New Prompt
        </Button>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPrompts?.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onFavorite={handleFavorite}
            isFavorite={favorites?.has(prompt.id) ?? false}
          />
        ))}
      </div>
    </div>
  );
} 