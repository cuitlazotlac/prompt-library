import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Prompt } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ClipboardDocumentIcon, ClipboardDocumentCheckIcon, HeartIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/contexts/AuthContext';
import { ModelIcon } from '@/components/ModelIcon';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { SharePrompt } from '@/components/SharePrompt';

interface PromptCardProps {
  prompt: Prompt;
  onFavorite: (promptId: string, isCurrentlyFavorite: boolean) => void;
  isFavorite: boolean;
}

export function PromptCard({ prompt, onFavorite, isFavorite }: PromptCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);

  const isAuthor = user?.uid === prompt.authorId;
  const isAdmin = user?.isAdmin;
  const canEdit = user && (isAuthor || isAdmin);

  const handleCopy = async () => {
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

  const handleEdit = () => {
    navigate(`/edit/${prompt.id}`);
  };

  return (
    <Card className="overflow-hidden relative group">
      <div className="absolute right-4 top-4 flex flex-wrap gap-1.5">
        {(Array.isArray(prompt.modelType) ? prompt.modelType : [prompt.modelType].filter(Boolean)).map((model) => (
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
      <CardHeader>
        <CardTitle className="line-clamp-1 leading-tight min-h-[1.5rem]">{prompt.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {prompt.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative p-4 mb-4 rounded-lg bg-muted">
          <pre className="text-sm whitespace-pre-wrap line-clamp-6">{prompt.content}</pre>
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
        <div className="flex flex-wrap gap-2">
          <div className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">
            {prompt.category}
          </div>
          {(Array.isArray(prompt.tags) ? prompt.tags : [prompt.tags].filter(Boolean)).map((tag) => (
            <div
              key={tag}
              className="px-3 py-1 text-sm rounded-full border text-muted-foreground"
            >
              {tag}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to={`/prompt/${prompt.id}`}>View Details</Link>
          </Button>
          {canEdit && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleEdit}
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit prompt</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
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
                    onClick={() => onFavorite(prompt.id, isFavorite)}
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
      </CardFooter>
    </Card>
  );
} 