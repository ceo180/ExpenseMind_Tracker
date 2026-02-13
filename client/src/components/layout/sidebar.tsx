import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  PieChart, 
  Receipt, 
  PlusCircle, 
  Target, 
  Tags, 
  BarChart3,
  Wallet,
  Menu,
  LogOut,
  Settings
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: PieChart, gradient: "from-blue-500 to-indigo-500" },
  { name: "Expenses", href: "/expenses", icon: Receipt, gradient: "from-red-500 to-rose-500" },
  { name: "Income", href: "/income", icon: PlusCircle, gradient: "from-emerald-500 to-green-500" },
  { name: "Budgets", href: "/budgets", icon: Target, gradient: "from-purple-500 to-violet-500" },
  { name: "Categories", href: "/categories", icon: Tags, gradient: "from-amber-500 to-orange-500" },
  { name: "Reports", href: "/reports", icon: BarChart3, gradient: "from-cyan-500 to-blue-500" },
];

interface SidebarProps {
  className?: string;
}

function SidebarContent({ className }: SidebarProps) {
  const [location] = useLocation();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.href = "/landing";
  };

  return (
    <div className={cn("flex h-full w-72 flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950", className)}>
      {/* Logo */}
      <div className="flex h-20 items-center px-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md group-hover:bg-primary/30 transition-colors" />
            <div className="relative bg-gradient-to-br from-primary to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-primary/25">
              <Wallet className="h-5 w-5 text-white" />
            </div>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
            ExpenseMind
          </span>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="mb-2 px-3">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Main Menu</span>
        </div>
        <nav className="space-y-1.5">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-12 rounded-xl font-medium transition-all duration-200",
                    isActive 
                      ? "bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary hover:text-white" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  )}
                  data-testid={`nav-link-${item.name.toLowerCase()}`}
                >
                  <div className={cn(
                    "p-1.5 rounded-lg transition-colors",
                    isActive 
                      ? "bg-white/20" 
                      : "bg-slate-100 dark:bg-slate-800"
                  )}>
                    <item.icon className={cn(
                      "h-4 w-4",
                      isActive ? "text-white" : "text-slate-500 dark:text-slate-400"
                    )} />
                  </div>
                  {item.name}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="glass-card rounded-xl p-4 mb-4">
          <div className="text-sm font-medium text-slate-900 dark:text-white mb-1">Pro Tip</div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Set up budgets for better spending control.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-10 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-10 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-40 lg:hidden h-12 w-12 rounded-xl bg-white dark:bg-slate-900 shadow-lg hover:shadow-xl transition-all duration-300"
            data-testid="button-mobile-sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 border-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 lg:block" data-testid="desktop-sidebar">
      <SidebarContent className="border-r border-slate-100 dark:border-slate-800" />
    </aside>
  );
}
