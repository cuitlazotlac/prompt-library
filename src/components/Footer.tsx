import { Link } from 'react-router-dom';
import { TwitterIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/sarcina-favicon.svg" alt="Prompt Lab Logo" className="h-6 w-6" />
          <span className="text-sm font-medium">Prompt Lab</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <a
            href="https://twitter.com/sarcinaapp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <TwitterIcon className="h-4 w-4" />
          </a>
          <a
            href="mailto:sarcitaapp@gmail.com"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  );
} 