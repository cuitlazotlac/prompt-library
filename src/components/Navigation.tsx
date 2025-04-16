import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { SearchModal } from '@/components/SearchModal';

export default function Navigation() {
  const { logout } = useAuth();
  const { setTheme } = useTheme();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center h-16">
          <div className="flex mr-4">
            <Link to="/" className="flex items-center mr-6 space-x-2">
              <img 
                src="/logo-nav.svg" 
                alt="Sarcina - AI Prompt Library" 
                className="w-auto h-8 sm:h-9 md:h-10"
              />
            </Link>
          </div>
          <div className="flex flex-1 justify-between items-center space-x-2 md:justify-end">
            <Button
              variant="outline"
              className="w-full md:w-[200px] lg:w-[300px] justify-start text-muted-foreground"
              onClick={() => setIsSearchOpen(true)}
            >
              <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
              Search prompts...
            </Button>
            <nav className="flex items-center space-x-2">
              <ThemeToggle />
              {/* Auth buttons temporarily hidden */}
            </nav>
          </div>
        </div>
      </nav>

      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
} 