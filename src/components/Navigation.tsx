import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/contexts/ThemeContext';

interface NavigationProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Navigation({ searchQuery, onSearchChange }: NavigationProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center h-16">
        <div className="flex mr-4">
          <Link to="/" className="flex items-center mr-6 space-x-2">
            <img 
              src="/logo-nav.svg" 
              alt="AI Prompt Library" 
              className="w-auto h-10 sm:h-12 md:h-14"
            />
          </Link>
        </div>
        <div className="flex flex-1 justify-between items-center space-x-2 md:justify-end">
          <div className="flex-1 w-full md:w-auto md:flex-none">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search prompts..."
                className="pl-8 md:w-[200px] lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            {user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/create">Create Prompt</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/profile">Profile</Link>
                </Button>
                {user.isAdmin && (
                  <Button variant="ghost" asChild>
                    <Link to="/admin">Admin</Link>
                  </Button>
                )}
                <Button variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </nav>
  );
} 