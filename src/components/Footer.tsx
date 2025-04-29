import { Link } from 'react-router-dom';
import { TwitterIcon, MailIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container flex justify-between items-center h-14">
        <div className="flex gap-2 items-center">
          <img src="/sarcina-favicon.svg" alt="Prompt Lab Logo" className="w-6 h-6" />
          <span className="text-sm font-medium">Prompt Lab</span>
        </div>
        <div className="flex gap-4 items-center">
          <ThemeToggle />
          <a
            href="https://x.com/PromptLab00"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors text-muted-foreground hover:text-foreground"
          >
            <TwitterIcon className="w-4 h-4" />
          </a>
          <a
            href="mailto:promptlabapp@gmail.com"
            className="transition-colors text-muted-foreground hover:text-foreground"
          >
            <MailIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
} 