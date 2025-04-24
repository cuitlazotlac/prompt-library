import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { ArrowUpIcon as ArrowUpSolidIcon, ArrowDownIcon as ArrowDownSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { LoginDialog } from '@/components/LoginDialog';
import { doc, getDoc, setDoc, deleteDoc, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface VoteButtonsProps {
  promptId: string;
  initialVote?: 'up' | 'down' | null;
  initialScore?: number;
  layout?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md';
}

export function VoteButtons({ 
  promptId, 
  initialVote = null, 
  initialScore = 0,
  layout = 'vertical',
  size = 'md'
}: VoteButtonsProps) {
  const { user } = useAuth();
  const [vote, setVote] = useState<'up' | 'down' | null>(initialVote);
  const [score, setScore] = useState(initialScore);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: async ({ newVote }: { newVote: 'up' | 'down' | null }) => {
      if (!user) throw new Error('User not authenticated');

      try {
        await runTransaction(db, async (transaction) => {
          const promptRef = doc(db, 'prompts', promptId);
          const voteRef = doc(db, 'votes', user.uid, 'prompts', promptId);
          const promptDoc = await transaction.get(promptRef);
          const voteDoc = await transaction.get(voteRef);

          if (!promptDoc.exists()) {
            throw new Error('Prompt not found');
          }

          const promptData = promptDoc.data();
          const currentScore = promptData.score || 0;
          const oldVote = voteDoc.exists() ? voteDoc.data().vote : null;

          // Calculate score change
          let scoreChange = 0;
          if (newVote === 'up') scoreChange = oldVote === 'down' ? 2 : (oldVote === 'up' ? 0 : 1);
          else if (newVote === 'down') scoreChange = oldVote === 'up' ? -2 : (oldVote === 'down' ? 0 : -1);
          else scoreChange = oldVote === 'up' ? -1 : (oldVote === 'down' ? 1 : 0);

          // Update or delete vote document
          if (newVote === null) {
            transaction.delete(voteRef);
          } else {
            transaction.set(voteRef, {
              vote: newVote,
              timestamp: new Date(),
            });
          }

          // Update prompt score
          transaction.update(promptRef, {
            score: currentScore + scoreChange,
            updatedAt: new Date()
          });

          return { scoreChange };
        });
      } catch (error) {
        console.error('Transaction failed:', error);
        throw error;
      }
    },
    onSuccess: (_, { newVote }) => {
      // Update local state
      setVote(newVote);
      
      // Calculate new score
      const scoreChange = (() => {
        if (newVote === 'up') return vote === 'down' ? 2 : (vote === 'up' ? 0 : 1);
        if (newVote === 'down') return vote === 'up' ? -2 : (vote === 'down' ? 0 : -1);
        return vote === 'up' ? -1 : (vote === 'down' ? 1 : 0);
      })();
      
      setScore(prev => prev + scoreChange);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['prompt', promptId] });
    },
    onError: (error) => {
      console.error('Error voting:', error);
      toast.error('Failed to update vote. Please try again.');
    }
  });

  const handleVote = (newVote: 'up' | 'down') => {
    if (!user) {
      setIsLoginDialogOpen(true);
      return;
    }

    // If clicking the same vote again, remove the vote
    if (vote === newVote) {
      voteMutation.mutate({ newVote: null });
    } else {
      voteMutation.mutate({ newVote });
    }
  };

  const buttonSize = size === 'sm' ? 'sm' : 'icon';
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const scoreSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <>
      <div className={cn(
        "flex items-center",
        layout === 'vertical' ? "flex-col" : "flex-row",
        "border rounded-lg overflow-hidden"
      )}>
        <Button
          variant="ghost"
          size={buttonSize}
          className={cn(
            "hover:bg-green-100 hover:text-green-600",
            vote === 'up' && "text-green-600 bg-green-50",
            size === 'sm' && "h-8 w-8",
            layout === 'horizontal' && "border-r",
            "rounded-none"
          )}
          onClick={() => handleVote('up')}
        >
          {vote === 'up' ? (
            <ArrowUpSolidIcon className={iconSize} />
          ) : (
            <ArrowUpIcon className={iconSize} />
          )}
        </Button>
        <span className={cn(
          "font-medium tabular-nums px-3",
          scoreSize,
          layout === 'horizontal' ? "border-r" : "border-y",
          "bg-background"
        )}>
          {score}
        </span>
        <Button
          variant="ghost"
          size={buttonSize}
          className={cn(
            "hover:bg-red-100 hover:text-red-600",
            vote === 'down' && "text-red-600 bg-red-50",
            size === 'sm' && "h-8 w-8",
            "rounded-none"
          )}
          onClick={() => handleVote('down')}
        >
          {vote === 'down' ? (
            <ArrowDownSolidIcon className={iconSize} />
          ) : (
            <ArrowDownIcon className={iconSize} />
          )}
        </Button>
      </div>
      <LoginDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen} />
    </>
  );
} 