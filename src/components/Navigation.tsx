import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PlusIcon } from "@heroicons/react/24/outline";
import { SearchIcon } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
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
        <div className="container flex items-center h-14">
          {/* Left section with logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center mr-6 space-x-2">
              <img src="/logo-nav.svg" alt="Logo" className="w-8 h-8" />
            </Link>
          </div>

          {/* Center section with search */}
          <div className="flex flex-1 justify-center mx-auto max-w-xl">
            <div className="relative w-full">
              <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={() => setIsSearchOpen(true)}
                className="pl-8 w-full h-9 cursor-pointer"
                readOnly // Make it clear this is a button to open the modal
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-2">
            {user && (
              <Button
                onClick={() => navigate("/create")}
                className="flex gap-2 items-center"
              >
                <PlusIcon className="w-4 h-4" />
                Create Prompt
              </Button>
            )}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative w-8 h-8 rounded-full"
                  >
                    <div className="relative">
                      {user.email === "cuitlazotlac@gmail.com" && (
                        <span className="absolute -top-3 left-1/2 text-sm transform -translate-x-1/2">
                          👑
                        </span>
                      )}
                      <Avatar className="w-8 h-8">
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
                  <div className="flex gap-2 justify-start items-center p-2">
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
                  {user.role === 'admin' && (
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
              <Button onClick={handleLogin} variant="default" className="flex items-center gap-2">
                Login/Register with <FcGoogle className="w-5 h-5" />
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
