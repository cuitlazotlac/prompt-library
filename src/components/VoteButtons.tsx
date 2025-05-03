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
        console.log('Starting vote transaction:', { promptId, userId: user.uid, newVote });
        
        const result = await runTransaction(db, async (transaction) => {
          const promptRef = doc(db, 'prompts', promptId);
          const voteRef = doc(db, 'votes', user.uid, 'prompts', promptId);
          
          console.log('Getting documents:', { promptId, userId: user.uid });
          const promptDoc = await transaction.get(promptRef);
          const voteDoc = await transaction.get(voteRef);

          if (!promptDoc.exists()) {
            throw new Error('Prompt not found');
          }

          const promptData = promptDoc.data();
          const currentScore = promptData.score || 0;
          const currentVoteCount = promptData.voteCount || 0;
          const oldVote = voteDoc.exists() ? voteDoc.data().vote : null;

          console.log('Current state:', { 
            currentScore, 
            currentVoteCount, 
            oldVote, 
            newVote 
          });

          // Calculate score change and vote count change
          let scoreChange = 0;
          let voteCountChange = 0;

          if (newVote === 'up') {
            if (oldVote === 'down') {
              scoreChange = 2;
              voteCountChange = 0;
            } else if (oldVote === 'up') {
              scoreChange = -1;
              voteCountChange = -1;
            } else {
              scoreChange = 1;
              voteCountChange = 1;
            }
          } else if (newVote === 'down') {
            if (oldVote === 'up') {
              scoreChange = -2;
              voteCountChange = 0;
            } else if (oldVote === 'down') {
              scoreChange = 1;
              voteCountChange = -1;
            } else {
              scoreChange = -1;
              voteCountChange = 1;
            }
          } else {
            // Removing vote
            scoreChange = oldVote === 'up' ? -1 : (oldVote === 'down' ? 1 : 0);
            voteCountChange = oldVote ? -1 : 0;
          }

          console.log('Calculated changes:', { scoreChange, voteCountChange });

          // Update or delete vote document
          if (newVote === null) {
            console.log('Deleting vote document');
            transaction.delete(voteRef);
          } else {
            console.log('Setting vote document:', { vote: newVote });
            transaction.set(voteRef, {
              vote: newVote,
              timestamp: new Date(),
            });
          }

          // Update prompt score and vote count
          const newScore = currentScore + scoreChange;
          const newVoteCount = currentVoteCount + voteCountChange;
          
          console.log('Updating prompt:', { 
            newScore, 
            newVoteCount 
          });
          
          transaction.update(promptRef, {
            score: newScore,
            voteCount: newVoteCount,
            updatedAt: new Date()
          });

          return { scoreChange, voteCountChange };
        });

        console.log('Transaction completed successfully:', result);
        return result;
      } catch (error) {
        console.error('Transaction failed:', error);
        throw error;
      }
    },
    onSuccess: (_, { newVote }) => {
      console.log('Vote mutation succeeded:', { newVote });
      
      // Update local state
      setVote(newVote);
      
      // Calculate new score
      const scoreChange = (() => {
        if (newVote === 'up') {
          if (vote === 'down') return 2;
          if (vote === 'up') return -1;
          return 1;
        }
        if (newVote === 'down') {
          if (vote === 'up') return -2;
          if (vote === 'down') return 1;
          return -1;
        }
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

    console.log('Handling vote:', { currentVote: vote, newVote });

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