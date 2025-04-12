import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Menu, Plus, User } from "lucide-react"
import { Button } from "./ui/button"
import { SearchBar } from "./SearchBar"
import { Input } from '@/components/ui/input'
import { ThemeToggle } from './ThemeToggle'

interface NavigationProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Navigation({ searchQuery, onSearchChange }: NavigationProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/")
    } catch (error) {
      console.error("Failed to log out:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex gap-4 items-center h-14">
        <div className="flex flex-1 justify-between items-center md:justify-start">
          <Link to="/" className="flex items-center mr-6 space-x-2">
            <span className="hidden font-bold sm:inline-block">
              AI Prompt Library
            </span>
          </Link>
        </div>

        <SearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} />

        <div className="flex justify-end items-center space-x-4">
          {user && (
            <Button asChild variant="default" size="sm" className="gap-1 font-medium">
              <Link to="/create">
                <Plus className="w-4 h-4" />
                Create a Prompt
              </Link>
            </Button>
          )}
          <ThemeToggle />
          {user ? (
            <div className="flex gap-4 items-center">
              <Link
                to="/profile"
                className="text-sm font-medium text-foreground hover:text-foreground/80"
              >
                {user.displayName || user.email}
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-sm"
              >
                Logout
              </Button>
            </div>
          ) : (
            // <Button
            //   variant="outline"
            //   size="sm"
            //   onClick={handleLogin}
            //   className="text-sm"
            // >
            //   Login
            // </Button>
            null
          )}
        </div>
      </div>
    </header>
  )
} 