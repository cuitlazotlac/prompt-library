import { useTheme } from '@/contexts/ThemeContext';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex justify-center items-center p-1 h-8 rounded-full bg-secondary">
      <button
        onClick={() => setTheme('light')}
        className={cn(
          'inline-flex items-center justify-center rounded-full px-2.5 py-1.5 transition-colors',
          theme === 'light' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <SunIcon className="w-4 h-4" />
        <span className="sr-only">Light</span>
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={cn(
          'inline-flex items-center justify-center rounded-full px-2.5 py-1.5 transition-colors',
          theme === 'dark' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <MoonIcon className="w-4 h-4" />
        <span className="sr-only">Dark</span>
      </button>
      <button
        onClick={() => setTheme('system')}
        className={cn(
          'inline-flex items-center justify-center rounded-full px-2.5 py-1.5 transition-colors',
          theme === 'system' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <ComputerDesktopIcon className="w-4 h-4" />
        <span className="sr-only">System</span>
      </button>
    </div>
  );
} 