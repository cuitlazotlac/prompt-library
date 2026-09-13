import { useTheme } from '@/contexts/ThemeContext';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex items-center rounded-full bg-secondary p-1" aria-label="Color theme">
      <button
        onClick={() => setTheme('light')}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors',
          theme === 'light' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <SunIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Light</span><span className="sm:hidden sr-only">Light</span>
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors',
          theme === 'dark' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <MoonIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Dark</span><span className="sm:hidden sr-only">Dark</span>
      </button>
      <button
        onClick={() => setTheme('system')}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors',
          theme === 'system' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <ComputerDesktopIcon className="w-4 h-4" />
        <span className="hidden sm:inline">System</span><span className="sm:hidden sr-only">System</span>
      </button>
    </div>
  );
}
