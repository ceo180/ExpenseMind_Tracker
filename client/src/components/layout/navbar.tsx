import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Wallet, User, Settings, LogOut, Menu, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Navbar() {
  const { user, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getUserInitials = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const getUserDisplayName = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.email) {
      return user.email;
    }
    return "User";
  };

  return (
    <nav className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100/50 dark:border-slate-800/50 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/">
              <div className="flex items-center space-x-2 group cursor-pointer">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md group-hover:bg-primary/30 transition-colors" />
                  <div className="relative bg-gradient-to-br from-primary to-indigo-600 p-2 rounded-lg shadow-lg shadow-primary/20">
                    <Wallet className="h-5 w-5 text-white" />
                  </div>
                </div>
                <span className="text-xl font-bold shimmer-text" data-testid="text-app-name">
                  ExpenseTracker
                </span>
              </div>
            </Link>
            {user ? (
              <div className="hidden md:flex items-center space-x-1">
                {[
                  { href: "/", label: "Dashboard" },
                  { href: "/expenses", label: "Expenses" },
                  { href: "/income", label: "Income" },
                  { href: "/categories", label: "Categories" },
                  { href: "/budgets", label: "Budgets" },
                ].map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Desktop user menu */}
          <div className="hidden lg:block">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
              </div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-10 rounded-full pl-2 pr-3 flex items-center gap-2 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-colors" 
                    data-testid="button-user-menu"
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                      <AvatarImage src={(user as any)?.profileImageUrl || ""} alt={getUserDisplayName(user)} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-indigo-600 text-white text-sm font-medium">
                        {getUserInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-xl border-0 shadow-xl bg-white dark:bg-slate-900 p-1" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg mx-1 mb-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white" data-testid="text-user-name">
                      {getUserDisplayName(user)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400" data-testid="text-user-email">
                      {(user as any)?.email}
                    </p>
                  </div>
                  <DropdownMenuItem className="rounded-lg cursor-pointer" data-testid="menu-item-profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg cursor-pointer" data-testid="menu-item-settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1" />
                  <DropdownMenuItem 
                    onClick={() => window.location.href = '/api/logout'}
                    className="rounded-lg cursor-pointer text-red-500 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30"
                    data-testid="menu-item-logout"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>

        {/* Mobile user menu */}
        {isMobileMenuOpen && user ? (
          <div className="lg:hidden border-t border-slate-100/50 dark:border-slate-800/50 py-4" data-testid="mobile-user-menu">
            <div className="flex items-center space-x-3 px-4 py-2">
              <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                <AvatarImage src={(user as any)?.profileImageUrl || ""} alt={getUserDisplayName(user)} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-indigo-600 text-white font-medium">
                  {getUserInitials(user)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{getUserDisplayName(user)}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{(user as any)?.email}</p>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Button variant="ghost" className="w-full justify-start" data-testid="mobile-menu-profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button variant="ghost" className="w-full justify-start" data-testid="mobile-menu-settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={() => window.location.href = '/api/logout'}
                data-testid="mobile-menu-logout"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
