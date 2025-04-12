import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { Copy, Edit, Trash2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Prompt } from '@/types';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdUnit } from '@/components/AdUnit';

interface PromptCardProps {
  prompt: Prompt;
  showActions?: boolean;
}

function PromptCard({ prompt, showActions = true }: PromptCardProps) {
  const navigate = useNavigate();

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      toast.success('Prompt copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy prompt');
    }
  };

  const handleDeletePrompt = async () => {
    try {
      await deleteDoc(doc(db, 'prompts', prompt.id));
      toast.success('Prompt deleted successfully');
    } catch (error) {
      console.error('Error deleting prompt:', error);
      toast.error('Failed to delete prompt');
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-lg font-semibold">{prompt.title}</h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyToClipboard}
              className="h-8 w-8"
            >
              <Copy className="h-4 w-4" />
            </Button>
            {showActions && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/edit/${prompt.id}`)}
                  className="h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDeletePrompt}
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">{prompt.description}</p>
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
            {prompt.category}
          </span>
          {prompt.modelType.map((model) => (
            <span
              key={model}
              className="rounded-full bg-secondary/10 px-2 py-1 text-xs text-secondary-foreground"
            >
              {model}
            </span>
          ))}
          {prompt.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border px-2 py-1 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {showActions ? (
              `${prompt.upvotes} upvotes`
            ) : (
              <>By {prompt.authorName} • {prompt.upvotes} upvotes</>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    navigate('/');
    return null;
  }

  const { data: userPrompts, isLoading: promptsLoading } = useQuery({
    queryKey: ['userPrompts', user.uid],
    queryFn: async () => {
      const q = query(collection(db, 'prompts'), where('authorId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        modelType: Array.isArray(doc.data().modelType) ? doc.data().modelType : [doc.data().modelType].filter(Boolean),
        tags: doc.data().tags || [],
      })) as Prompt[];
    }
  });

  const { data: favorites, isLoading: favoritesLoading } = useQuery({
    queryKey: ["userFavorites", user.uid],
    queryFn: async () => {
      const favoritesRef = collection(db, 'favorites', user.uid, 'prompts');
      const querySnapshot = await getDocs(favoritesRef);
      
      const favoritePrompts = await Promise.all(
        querySnapshot.docs.map(async (favoriteDoc) => {
          const promptRef = doc(db, "prompts", favoriteDoc.id);
          const promptSnap = await getDoc(promptRef);
          if (!promptSnap.exists()) return null;
          const data = promptSnap.data();
          return {
            id: promptSnap.id,
            ...data,
            modelType: Array.isArray(data.modelType) ? data.modelType : [data.modelType].filter(Boolean),
            tags: data.tags || [],
          } as Prompt;
        })
      );
      return favoritePrompts.filter((prompt): prompt is Prompt => prompt !== null);
    },
  });

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ''} />
          <AvatarFallback>
            {user.displayName?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user.displayName}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* Ad Banner */}
      <div className="mb-8">
        <AdUnit type="banner" />
      </div>

      <Tabs defaultValue="prompts">
        <TabsList>
          <TabsTrigger value="prompts">My Prompts</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        <TabsContent value="prompts">
          {promptsLoading ? (
            <div className="flex h-[200px] items-center justify-center">
              <p className="text-lg text-muted-foreground">Loading...</p>
            </div>
          ) : userPrompts?.length === 0 ? (
            <div className="flex h-[200px] flex-col items-center justify-center gap-4">
              <p className="text-lg font-semibold">
                You haven't created any prompts yet
              </p>
              <Button onClick={() => navigate('/create')}>
                Create Your First Prompt
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {userPrompts?.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="favorites">
          {favoritesLoading ? (
            <div className="flex h-[200px] items-center justify-center">
              <p className="text-lg text-muted-foreground">Loading...</p>
            </div>
          ) : favorites?.length === 0 ? (
            <div className="flex h-[200px] flex-col items-center justify-center gap-4">
              <p className="text-lg font-semibold">
                You haven't favorited any prompts yet
              </p>
              <Button onClick={() => navigate('/')}>Browse Prompts</Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favorites?.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} showActions={false} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 