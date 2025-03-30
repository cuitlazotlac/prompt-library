import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { Search, Plus } from 'lucide-react';
import { db } from '@/lib/firebase';
import { Prompt } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PromptCard } from '@/components/PromptCard';

const categories = ['All', 'Writing', 'Coding', 'Analysis', 'Creative', 'Business'];
const modelTypes = ['ChatGPT', 'Claude', 'Gemini', 'All'];

export function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedModel, setSelectedModel] = useState('All');
  const { user } = useAuth();
  const navigate = useNavigate();

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

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
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
            onFavorite={() => {}}
            isFavorite={false}
          />
        ))}
      </div>
    </div>
  );
} 