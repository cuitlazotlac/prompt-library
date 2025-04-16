import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PlusIcon } from "@heroicons/react/24/outline";
import { SearchIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { SearchModal } from "@/components/SearchModal";

export default function Navigation() {
  const { user, logout, signInWithGoogle } = useAuth();
  const { setTheme } = useTheme();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Failed to log in:", error);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          {/* Left section with logo */}
          <div className="flex items-center">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <img src="/logo-nav.svg" alt="Logo" className="h-8 w-8" />
              <span className="font-bold">Prompt Library</span>
            </Link>
          </div>

          {/* Center section with search */}
          <div className="flex-1 flex justify-center max-w-xl mx-auto">
            <div className="relative w-full">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={() => setIsSearchOpen(true)}
                className="pl-8 h-9 w-full cursor-pointer"
                readOnly // Make it clear this is a button to open the modal
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-2">
            {user && (
              <Button
                onClick={() => navigate("/create")}
                className="flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Create Prompt
              </Button>
            )}
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <div className="relative">
                      {user.email === "cuitlazotlac@gmail.com" && (
                        <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-sm">
                          👑
                        </span>
                      )}
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.photoURL || undefined}
                          alt={user.displayName || ""}
                        />
                        <AvatarFallback>
                          {user.displayName?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user.displayName && (
                        <p className="font-medium">{user.displayName}</p>
                      )}
                      {user.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  {user.isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleLogin} variant="default">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
