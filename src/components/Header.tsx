import { Link } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchDialog } from '@/components/SearchDialog';
import { useState } from 'react';
import { MobileNav } from '@/components/MobileNav';
import { cn } from '@/lib/utils';

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <img src="/sarcina-favicon.svg" alt="Prompt Lab Logo" className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">Prompt Lab</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/" className="transition-colors hover:text-foreground/80 text-foreground">
              Home
            </Link>
            <Link to="/prompts" className="transition-colors hover:text-foreground/80 text-foreground">
              Prompts
            </Link>
            <Link to="/create" className="transition-colors hover:text-foreground/80 text-foreground">
              Create
            </Link>
          </nav>
        </div>
        <Button
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          variant="ghost"
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <Link to="/" className="mr-2 flex items-center space-x-2 md:hidden">
          <img src="/sarcina-favicon.svg" alt="Prompt Lab Logo" className="h-6 w-6" />
          <span className="font-bold">Prompt Lab</span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="hidden md:block w-full flex-1 md:w-auto md:flex-none">
            <Button
              variant="outline"
              className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="absolute left-2.5 h-4 w-4" />
              <span className="hidden lg:inline-flex">Search prompts...</span>
              <span className="inline-flex lg:hidden">Search...</span>
            </Button>
          </div>
          <nav className="flex items-center">
            <Button
              variant="ghost"
              className="relative h-9 w-9 p-0 md:hidden"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </nav>
        </div>
      </div>
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
      <MobileNav open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen} />
    </header>
  );
} 