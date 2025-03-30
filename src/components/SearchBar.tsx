import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useQuery } from '@tanstack/react-query';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Prompt } from '@/types';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
    return prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           prompt.description.toLowerCase().includes(searchQuery.toLowerCase());
  }).slice(0, 5); // Limit to 5 results

  useEffect(() => {
    if (searchQuery.length > 0) {
      setOpen(true);
    }
  }, [searchQuery]);

  const handleInputFocus = () => {
    if (searchQuery.length > 0) {
      setOpen(true);
    }
  };

  const handleSelect = (promptId: string) => {
    navigate(`/prompt/${promptId}`);
    setOpen(false);
    onSearchChange(''); // Clear the search query
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={handleInputFocus}
            className="pl-8 h-9"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[--radix-popover-trigger-width] p-0" 
        align="start"
        sideOffset={4}
      >
        <div className="max-h-[300px] overflow-y-auto">
          {filteredPrompts?.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              No prompts found
            </div>
          ) : (
            <div className="py-1">
              {filteredPrompts?.map((prompt) => (
                <button
                  key={prompt.id}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  onClick={() => handleSelect(prompt.id)}
                >
                  <div className="font-medium">{prompt.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {prompt.description}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
} 