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
  Menu
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: PieChart },
  { name: "Expenses", href: "/expenses", icon: Receipt },
  { name: "Income", href: "/income", icon: PlusCircle },
  { name: "Budgets", href: "/budgets", icon: Target },
  { name: "Categories", href: "/categories", icon: Tags },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

interface SidebarProps {
  className?: string;
}

function SidebarContent({ className }: SidebarProps) {
  const [location] = useLocation();

  return (
    <div className={cn("flex h-full w-64 flex-col bg-card", className)}>
      <div className="flex h-16 items-center border-b px-6">
        <Wallet className="h-6 w-6 text-primary" />
        <span className="ml-2 text-lg font-semibold text-primary">ExpenseTracker</span>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                  data-testid={`nav-link-${item.name.toLowerCase()}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
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
            size="sm"
            className="fixed top-4 left-4 z-40 lg:hidden"
            data-testid="button-mobile-sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block" data-testid="desktop-sidebar">
      <SidebarContent className="border-r" />
    </aside>
  );
}
