import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { FcGoogle } from "react-icons/fc";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navigation() {
  const { user, logout, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

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
      <nav className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur">
        <div className="container flex h-16 items-center px-4">
          {/* Left section with logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/logo-nav.svg" alt="Prompt Lab" className="h-9 w-9 rounded-xl" />
              <span className="hidden text-base font-semibold sm:inline">Prompt Lab</span>
            </Link>
            <Link to="/library" className="ml-5 text-sm font-medium text-muted-foreground transition hover:text-foreground">Browse recipes</Link>
          </div>

          {/* Center section with navigation */}
          <div className="flex flex-1 justify-center px-3">
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
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
              <Button onClick={handleLogin} variant="default" className="flex gap-2 rounded-full">
                Sign in with <FcGoogle className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </nav>

    </>
  );
}
