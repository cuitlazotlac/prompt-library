import { useTheme } from '@/contexts/ThemeContext';
import { themes } from '@/lib/themes';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

const themeIcons = {
  light: SunIcon,
  dark: MoonIcon,
  system: ComputerDesktopIcon,
};

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const Icon = themeIcons[theme];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-9 px-0">
          <Icon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((t) => {
          const Icon = themeIcons[t];
          return (
            <DropdownMenuItem
              key={t}
              onClick={() => setTheme(t)}
              className={theme === t ? 'bg-accent' : ''}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span className="capitalize">{t}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 