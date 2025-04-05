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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative w-8 h-8 rounded-full"
                  aria-label="User menu"
                >
                  <Avatar>
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User avatar"} />
                    <AvatarFallback>
                      {user.displayName?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 w-4 h-4" />
                  Profile
                </DropdownMenuItem>
                {user.isAdmin && (
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    <Menu className="mr-2 w-4 h-4" />
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 w-4 h-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link to="/login">
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
} 