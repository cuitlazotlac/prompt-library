import { Link } from 'react-router-dom';
import { MailIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container flex justify-between items-center h-14">
        <div className="flex gap-4 items-center">
          <div className="flex gap-2 items-center">
            <img src="/sarcina-favicon.svg" alt="Prompt Lab Logo" className="w-6 h-6" />
            <span className="text-sm font-medium">Prompt Lab</span>
          </div>
          <div className="flex gap-4 items-center">
            <a
              href="https://x.com/PromptLab00"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors text-muted-foreground hover:text-foreground"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/>
              </svg>
            </a>
            <a
              href="mailto:promptlabapp@gmail.com"
              className="transition-colors text-muted-foreground hover:text-foreground"
            >
              <MailIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </footer>
  );
} 