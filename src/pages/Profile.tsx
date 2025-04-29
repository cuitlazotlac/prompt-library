import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { collection, query, where, getDocs, doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Prompt } from '@/types';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdUnit } from '@/components/AdUnit';
import { PromptCard } from '@/components/PromptCard';

export function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

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

  const handleFavorite = async (promptId: string, isCurrentlyFavorite: boolean) => {
    if (!user) {
      toast.error("You must be logged in to favorite prompts");
      return;
    }

    try {
      const favoriteRef = doc(db, 'favorites', user.uid, 'prompts', promptId);
      if (isCurrentlyFavorite) {
        await deleteDoc(favoriteRef);
        queryClient.setQueryData(
          ["userFavorites", user.uid],
          (oldData: Prompt[] | undefined) => 
            oldData ? oldData.filter(prompt => prompt.id !== promptId) : []
        );
        toast.success('Removed from favorites');
      } else {
        const promptRef = doc(db, "prompts", promptId);
        const promptSnap = await getDoc(promptRef);
        if (!promptSnap.exists()) {
          toast.error('Prompt not found');
          return;
        }
        
        await setDoc(favoriteRef, {
          promptId,
          timestamp: new Date(),
        });

        const promptData = promptSnap.data();
        const newPrompt = {
          id: promptSnap.id,
          ...promptData,
          modelType: Array.isArray(promptData.modelType) 
            ? promptData.modelType 
            : [promptData.modelType].filter(Boolean),
          tags: promptData.tags || [],
        } as Prompt;

        queryClient.setQueryData(
          ["userFavorites", user.uid],
          (oldData: Prompt[] | undefined) => 
            oldData ? [...oldData, newPrompt] : [newPrompt]
        );
        
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
      toast.error('Failed to update favorites');
      queryClient.invalidateQueries({ queryKey: ["userFavorites", user.uid] });
    }
  };

  return (
    <div className="container py-8">
      <div className="flex gap-4 items-center mb-8">
        <Avatar className="w-16 h-16">
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
      {/* <div className="mb-8">
        <AdUnit type="banner" />
      </div> */}

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
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  isFavorite={false}
                  onFavorite={handleFavorite}
                />
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
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  isFavorite={true}
                  onFavorite={handleFavorite}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 