import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Prompt } from "@/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Copy, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

interface PromptCardProps {
  prompt: Prompt
  onFavorite: (promptId: string) => void
  isFavorite: boolean
}

export function PromptCard({ prompt, onFavorite, isFavorite }: PromptCardProps) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content)
      toast.success("Prompt copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy prompt")
    }
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-2">{prompt.title}</CardTitle>
        <CardDescription className="line-clamp-2">{prompt.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-2">
          {prompt.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8",
                    isFavorite && "text-red-500 hover:text-red-600"
                  )}
                  onClick={() => user && onFavorite(prompt.id)}
                >
                  <Heart
                    className={cn(
                      "h-4 w-4",
                      isFavorite && "fill-current"
                    )}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isFavorite ? "Remove from favorites" : "Add to favorites"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy prompt</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/prompt/${prompt.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
} 