import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Prompt } from '@/types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ModelIcon } from '@/components/ModelIcon';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: prompts } = useQuery({
    queryKey: ['prompts'],
    queryFn: async () => {
      const q = query(collection(db, 'prompts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Prompt[];
    }
  });

  const filteredPrompts = prompts?.filter(prompt => {
    if (!searchQuery) return false;
    return (
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }).slice(0, 10); // Limit to 10 results

  const handleSelect = (promptId: string) => {
    navigate(`/prompt/${promptId}`);
    onClose();
    setSearchQuery('');
  };

  // Reset search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      const input = document.getElementById('search-input');
      if (input) {
        input.focus();
      }
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <div className="flex items-center border-b p-4">
          <MagnifyingGlassIcon className="w-5 h-5 text-muted-foreground mr-2" />
          <Input
            id="search-input"
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
          />
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {filteredPrompts?.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              {searchQuery ? 'No prompts found' : 'Start typing to search...'}
            </div>
          ) : (
            <div className="py-2">
              {filteredPrompts?.map((prompt) => (
                <button
                  key={prompt.id}
                  className="w-full px-4 py-3 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground outline-none"
                  onClick={() => handleSelect(prompt.id)}
                >
                  <div className="flex flex-col gap-1">
                    {/* First row: Model icon and title */}
                    <div className="flex items-center gap-2">
                      <ModelIcon model={prompt.modelType[0]} className="w-4 h-4" />
                      <div className="font-medium truncate">{prompt.title}</div>
                    </div>
                    {/* Second row: Description */}
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {prompt.description}
                    </div>
                    {/* Third row: Category and tags */}
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="secondary" className="rounded-full">
                        {prompt.category}
                      </Badge>
                      {prompt.tags?.slice(0, 3).map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="rounded-full text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {prompt.tags?.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{prompt.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 