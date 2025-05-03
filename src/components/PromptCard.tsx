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
import { ImagePreview } from './ImagePreview';
import { VoteButtons } from './VoteButtons';
import { isFeatureEnabled } from '@/lib/posthog';
import { LoginDialog } from '@/components/LoginDialog';

interface PromptCardProps {
  prompt: Prompt;
  onFavorite: (promptId: string, isCurrentlyFavorite: boolean) => void;
  isFavorite: boolean;
}

export function PromptCard({ prompt, onFavorite, isFavorite }: PromptCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [pendingFavorite, setPendingFavorite] = useState<null | { promptId: string; isCurrentlyFavorite: boolean }>(null);

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

  // Handle favorite click
  const handleFavoriteClick = () => {
    if (!user) {
      setPendingFavorite({ promptId: prompt.id, isCurrentlyFavorite: isFavorite });
      setIsLoginDialogOpen(true);
      return;
    }
    onFavorite(prompt.id, isFavorite);
  };

  // After login, if there was a pending favorite, perform it
  const handleLoginDialogChange = (open: boolean) => {
    setIsLoginDialogOpen(open);
    if (!open && user && pendingFavorite) {
      onFavorite(pendingFavorite.promptId, pendingFavorite.isCurrentlyFavorite);
      setPendingFavorite(null);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        {/* Mobile layout: voting row, then title row, then description row */}
        <div className="block sm:hidden w-full">
          {/* Row 1: Voting */}
          {isFeatureEnabled('enable-voting') && (
            <div className="flex justify-start mb-2">
              <VoteButtons
                promptId={prompt.id}
                initialVote={prompt.userVote}
                initialScore={prompt.score || 0}
                layout="horizontal"
                size="sm"
              />
            </div>
          )}
          {/* Row 2: Title (always wraps, no truncation) */}
          <div className="w-full mb-2">
            <CardTitle className="text-lg font-semibold break-words whitespace-normal leading-snug">{prompt.title}</CardTitle>
          </div>
        </div>
        {/* Desktop/tablet layout: original flex row */}
        <div className="hidden sm:flex gap-4 items-start">
          {isFeatureEnabled('enable-voting') && (
            <div className="flex-shrink-0">
              <VoteButtons
                promptId={prompt.id}
                initialVote={prompt.userVote}
                initialScore={prompt.score || 0}
                layout="horizontal"
                size="sm"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <CardTitle className="line-clamp-1 leading-tight min-h-[1.5rem]">{prompt.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="mb-4 text-muted-foreground line-clamp-2">
          {prompt.description}
        </p>
        
        {prompt.images && prompt.images.length > 0 && (
          <div className="flex overflow-x-auto gap-2 pb-2 mb-4">
            {prompt.images.map((image) => (
              <ImagePreview key={image.url} image={image} size="sm" />
            ))}
          </div>
        )}

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
        <div className="flex gap-2 items-center">
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
        <div className="flex gap-2 items-center">
          <SharePrompt 
            promptId={prompt.id} 
            title={prompt.title}
          />
          {/* Always show the heart icon, and handle login if needed */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFavoriteClick}
                  className={isFavorite ? "text-red-500 hover:text-red-600" : ""}
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
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
          <LoginDialog open={isLoginDialogOpen} onOpenChange={handleLoginDialogChange} />
        </div>
      </CardFooter>
    </Card>
  );
} 