import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { ClipboardDocumentIcon, ClipboardDocumentCheckIcon, HeartIcon, PencilSquareIcon, TrashIcon, FlagIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Prompt } from '@/types';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { ModelIcon } from '@/components/ModelIcon';
import { cn } from '@/lib/utils';
import { SharePrompt } from '@/components/SharePrompt';

export default function PromptDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();
  const [isCopied, setIsCopied] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState<Partial<Prompt> | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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
      setIsCopied(true);
      toast.success('Prompt copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
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

  const handleEdit = async () => {
    if (!prompt || !user || !editedPrompt) return;

    try {
      const promptRef = doc(db, 'prompts', prompt.id);
      await setDoc(promptRef, {
        ...prompt,
        ...editedPrompt,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      setPrompt({ ...prompt, ...editedPrompt });
      setIsEditDialogOpen(false);
      toast.success('Prompt updated successfully');
    } catch (error) {
      console.error('Error updating prompt:', error);
      toast.error('Failed to update prompt');
    }
  };

  const isAuthor = user?.uid === prompt?.authorId;
  const isAdmin = user?.isAdmin;
  const canEdit = user && prompt && (isAuthor || isAdmin);

  return (
    <div className="container py-8 max-w-4xl">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{prompt?.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl">{prompt?.title}</CardTitle>
              <CardDescription className="mt-2">
                Created by {prompt?.authorName || 'Anonymous'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-wrap gap-1.5">
                {prompt?.modelType && (Array.isArray(prompt.modelType) ? prompt.modelType : [prompt.modelType].filter(Boolean)).map((model) => (
                  <TooltipProvider key={model}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={cn(
                          "inline-flex justify-center items-center w-7 h-7 rounded-full bg-secondary/10",
                          "ring-1 ring-inset ring-secondary/20"
                        )}>
                          <ModelIcon model={model} className="w-4 h-4 text-secondary-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{model}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <SharePrompt 
                  promptId={prompt.id} 
                  title={prompt.title}
                />
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
                            <HeartSolidIcon className="w-5 h-5" />
                          ) : (
                            <HeartIcon className="w-5 h-5" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isFavorite ? "Remove from favorites" : "Add to favorites"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-2 font-semibold">Description</h3>
            <p className="text-muted-foreground">{prompt.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">
              {prompt.category}
            </div>
            {prompt.modelType.map((model) => (
              <div
                key={model}
                className="px-3 py-1 text-sm rounded-full bg-secondary/10 text-secondary-foreground"
              >
                {model}
              </div>
            ))}
            {prompt.tags.map((tag) => (
              <div
                key={tag}
                className="px-3 py-1 text-sm rounded-full border text-muted-foreground"
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
                  <div key={index} className="overflow-hidden relative rounded-lg aspect-square">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="mb-2 font-semibold">Prompt Content</h3>
            <div className="relative p-4 rounded-lg bg-muted">
              <pre className="text-sm whitespace-pre-wrap">{prompt.content}</pre>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={handleCopy}
                      className="absolute top-2 right-2 transition-all duration-200"
                    >
                      {isCopied ? (
                        <ClipboardDocumentCheckIcon className="w-4 h-4 text-green-500" />
                      ) : (
                        <ClipboardDocumentIcon className="w-4 h-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isCopied ? 'Copied!' : 'Copy prompt'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
                    className="px-3 py-1 text-sm rounded-full border text-muted-foreground"
                  >
                    {model}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 