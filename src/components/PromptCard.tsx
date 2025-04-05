import { Link } from 'react-router-dom';
import { Prompt } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ClipboardDocumentIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface PromptCardProps {
  prompt: Prompt;
  onFavorite: (promptId: string, isCurrentlyFavorite: boolean) => void;
  isFavorite: boolean;
}

export function PromptCard({ prompt, onFavorite, isFavorite }: PromptCardProps) {
  const { user } = useAuth();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      toast.success('Prompt copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy prompt');
    }
  };

  return (
    <Card className="group relative overflow-hidden">
      <CardHeader>
        <CardTitle className="line-clamp-1">{prompt.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {prompt.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <div className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
            {prompt.category}
          </div>
          {(Array.isArray(prompt.modelType) ? prompt.modelType : [prompt.modelType].filter(Boolean)).map((model) => (
            <div
              key={model}
              className="rounded-full bg-secondary/10 px-3 py-1 text-sm text-secondary-foreground"
            >
              {model}
            </div>
          ))}
          {(Array.isArray(prompt.tags) ? prompt.tags : [prompt.tags].filter(Boolean)).map((tag) => (
            <div
              key={tag}
              className="rounded-full border px-3 py-1 text-sm text-muted-foreground"
            >
              {tag}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" asChild>
          <Link to={`/prompt/${prompt.id}`}>View Details</Link>
        </Button>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                >
                  <ClipboardDocumentIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy prompt</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
        </div>
      </CardFooter>
    </Card>
  );
} 