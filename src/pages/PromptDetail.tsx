import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { ClipboardDocumentIcon, HeartIcon, PencilSquareIcon, TrashIcon, FlagIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Prompt } from '@/types';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function PromptDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ promptId, isFavorite }: { promptId: string; isFavorite: boolean }) => {
      if (!user) throw new Error('User not authenticated');
      
      const favoriteRef = doc(db, 'favorites', user.uid, 'prompts', promptId);
      
      if (isFavorite) {
        await deleteDoc(favoriteRef);
      } else {
        await setDoc(favoriteRef, {
          promptId,
          timestamp: new Date(),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.uid] });
      setIsFavorite(!isFavorite);
    },
    onError: (error) => {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  });

  useEffect(() => {
    const fetchPrompt = async () => {
      if (!id) {
        toast.error('Invalid prompt ID');
        navigate('/');
        return;
      }
      
      setIsLoading(true);
      try {
        const docRef = doc(db, 'prompts', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          const promptData = {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            modelType: Array.isArray(data.modelType) ? data.modelType : [data.modelType].filter(Boolean),
            tags: data.tags || [],
          } as Prompt;
          
          setPrompt(promptData);
          
          // Check if user has favorited
          if (user) {
            try {
              const favoriteRef = doc(db, 'favorites', user.uid, 'prompts', id);
              const favoriteSnap = await getDoc(favoriteRef);
              setIsFavorite(favoriteSnap.exists());
            } catch (error) {
              console.error('Error checking favorite status:', error);
              setIsFavorite(false);
            }
          }
        } else {
          toast.error('Prompt not found');
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching prompt:', error);
        toast.error('Failed to load prompt');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompt();
  }, [id, user, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-lg text-muted-foreground">Prompt not found</p>
      </div>
    );
  }

  const handleCopy = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt.content);
      toast.success('Prompt copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy prompt');
    }
  };

  const handleFavorite = () => {
    if (!user || !prompt) {
      toast.error('You must be logged in to favorite prompts');
      return;
    }
    toggleFavoriteMutation.mutate({ promptId: prompt.id, isFavorite });
  };

  const handleDelete = async () => {
    if (!prompt || !user) return;

    const promptUserId = prompt.authorId;
    if (!promptUserId || (promptUserId !== user.uid && !user.isAdmin)) {
      toast.error("You don't have permission to delete this prompt");
      return;
    }

    try {
      await deleteDoc(doc(db, 'prompts', prompt.id));
      toast.success('Prompt deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting prompt:', error);
      toast.error('Failed to delete prompt');
    }
  };

  const handleEdit = () => {
    if (!prompt || !user) return;

    const promptUserId = prompt.authorId;
    if (!promptUserId || (promptUserId !== user.uid && !user.isAdmin)) {
      toast.error("You don't have permission to edit this prompt");
      return;
    }

    navigate(`/edit/${prompt.id}`);
  };

  const isAuthor = user?.uid === prompt.authorId;
  const isAdmin = user?.isAdmin;

  return (
    <div className="container max-w-4xl py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{prompt.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl">{prompt.title}</CardTitle>
              <CardDescription className="mt-2">
                Created by {prompt.authorName || 'Anonymous'}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {user && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleFavorite}
                        className={isFavorite ? "text-red-500 hover:text-red-600" : ""}
                      >
                        {isFavorite ? (
                          <HeartSolidIcon className="h-5 w-5" />
                        ) : (
                          <HeartIcon className="h-5 w-5" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isFavorite ? "Remove from favorites" : "Add to favorites"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {user && (isAuthor || isAdmin) && (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={handleEdit}>
                          <PencilSquareIcon className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit prompt</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteDialogOpen(true)}
                          className="text-destructive"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete prompt</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}
              {isAdmin && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <FlagIcon className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Flag content</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-2 font-semibold">Description</h3>
            <p className="text-muted-foreground">{prompt.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              {prompt.category}
            </div>
            {prompt.modelType.map((model) => (
              <div
                key={model}
                className="rounded-full bg-secondary/10 px-3 py-1 text-sm text-secondary-foreground"
              >
                {model}
              </div>
            ))}
            {prompt.tags.map((tag) => (
              <div
                key={tag}
                className="rounded-full border px-3 py-1 text-sm text-muted-foreground"
              >
                {tag}
              </div>
            ))}
          </div>

          {prompt.images && prompt.images.length > 0 && (
            <div>
              <h3 className="mb-2 font-semibold">Images</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {prompt.images.map((image, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-2 font-semibold">Prompt Content</h3>
            <div className="relative rounded-lg bg-muted p-4">
              <pre className="whitespace-pre-wrap text-sm">{prompt.content}</pre>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={handleCopy}
              >
                <ClipboardDocumentIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {prompt.usageTips && (
            <div>
              <h3 className="mb-2 font-semibold">Usage Tips</h3>
              <p className="text-muted-foreground">{prompt.usageTips}</p>
            </div>
          )}

          {prompt.recommendedModels && prompt.recommendedModels.length > 0 && (
            <div>
              <h3 className="mb-2 font-semibold">Recommended Models</h3>
              <div className="flex flex-wrap gap-2">
                {prompt.recommendedModels.map((model) => (
                  <div
                    key={model}
                    className="rounded-full border px-3 py-1 text-sm text-muted-foreground"
                  >
                    {model}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Prompt</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this prompt? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 