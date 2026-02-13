import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wallet, PieChart, Target, TrendingUp, Shield, Sparkles, ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Landing() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, lastName }),
        credentials: "include",
      });

      if (response.ok) {
        window.location.href = "/";
      } else {
        const data = await response.json();
        toast({
          title: "Login failed",
          description: data.message || "Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: PieChart,
      title: "Smart Tracking",
      description: "AI-powered expense categorization that learns your spending patterns automatically.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Target,
      title: "Budget Goals",
      description: "Set personalized budgets and receive intelligent alerts before you overspend.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      title: "Rich Analytics",
      description: "Beautiful visualizations that turn your financial data into actionable insights.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "Your data is encrypted end-to-end. We never share your information.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance for instant updates and real-time syncing.",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: Sparkles,
      title: "Beautiful Design",
      description: "A delightful interface that makes managing money feel effortless.",
      gradient: "from-indigo-500 to-purple-500"
    }
  ];

  const stats = [
    { value: "50K+", label: "Active Users" },
    { value: "$2M+", label: "Tracked Monthly" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.9★", label: "User Rating" }
  ];

  return (
    <div className="min-h-screen gradient-hero overflow-hidden aurora-bg">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Morphing blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-indigo-500/20 blob animate-float" />
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/15 to-pink-500/15 blob animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute -bottom-40 right-1/4 w-80 h-80 bg-gradient-to-br from-cyan-500/15 to-blue-500/15 blob animate-float" style={{ animationDelay: '-4s' }} />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 blob animate-float" style={{ animationDelay: '-6s' }} />
        
        {/* Floating particles */}
        <div className="absolute top-20 left-1/4 w-3 h-3 bg-primary/40 rounded-full animate-float" style={{ animationDelay: '-1s' }} />
        <div className="absolute top-40 right-1/3 w-2 h-2 bg-purple-500/40 rounded-full animate-float" style={{ animationDelay: '-2.5s' }} />
        <div className="absolute bottom-40 left-1/3 w-4 h-4 bg-cyan-500/30 rounded-full animate-float" style={{ animationDelay: '-3.5s' }} />
        <div className="absolute top-1/3 right-20 w-2 h-2 bg-pink-500/40 rounded-full animate-float" style={{ animationDelay: '-4.5s' }} />
      </div>

      {/* Header */}
      <header className="relative container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-xl blur-xl group-hover:bg-primary/40 transition-all duration-500 animate-pulse-glow" />
              <div className="relative bg-gradient-to-br from-primary to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
                <Wallet className="h-6 w-6 text-white" />
              </div>
            </div>
            <span className="text-2xl font-bold shimmer-text">
              ExpenseMind
            </span>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button 
                className="rounded-full px-6 btn-gradient shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 glow-border"
                data-testid="button-login"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md glass-card border-0 animate-bounce-in">
              <DialogHeader>
                <DialogTitle className="text-2xl shimmer-text">
                  Welcome to ExpenseMind
                </DialogTitle>
                <DialogDescription>
                  Enter your details to start your financial journey
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 rounded-xl border-2 focus:border-primary transition-all duration-300 focus:shadow-lg focus:shadow-primary/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-12 rounded-xl border-2 focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-12 rounded-xl border-2 focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 pt-16 pb-24 text-center">
        <div className="max-w-4xl mx-auto page-enter">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary text-sm font-medium mb-8 border border-primary/20 animate-bounce-in shadow-lg shadow-primary/10">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>Trusted by 50,000+ users worldwide</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            <span className="animate-slide-up inline-block" style={{ animationDelay: '0.1s' }}>Master Your Money,</span>
            <br />
            <span className="shimmer-text animate-slide-up inline-block" style={{ animationDelay: '0.3s' }}>
              Shape Your Future
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.5s' }}>
            The intelligent expense tracker that helps you understand your spending, 
            hit your goals, and build lasting wealth.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <Button 
              size="lg" 
              className="h-14 px-8 text-lg rounded-full btn-gradient shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 hover:scale-105 transition-all duration-300 glow-border relative overflow-hidden group"
              onClick={() => setIsOpen(true)}
              data-testid="button-get-started"
            >
              <span className="relative z-10 flex items-center">
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="h-14 px-8 text-lg rounded-full border-2 hover:bg-primary/5 hover:border-primary transition-all duration-300 hover:scale-105 group"
            >
              <span className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <div className="w-0 h-0 border-l-[6px] border-l-primary border-y-[4px] border-y-transparent ml-0.5" />
                </div>
                Watch Demo
              </span>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
          {stats.map((stat, index) => (
            <div 
              key={stat.label} 
              className="stagger-item group cursor-default"
              style={{ animationDelay: `${0.9 + index * 0.1}s` }}
            >
              <div className="text-3xl md:text-5xl font-bold shimmer-text group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-6 animate-bounce-in">
            <Sparkles className="w-4 h-4" />
            Powerful Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="animate-slide-up inline-block">Everything You Need to</span>
            <br />
            <span className="shimmer-text animate-slide-up inline-block" style={{ animationDelay: '0.2s' }}>
              Take Control
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
            Powerful features designed to make financial management effortless and even enjoyable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="card-3d stagger-item"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card 
                className="group glass-card border-0 overflow-hidden h-full relative card-3d-inner"
                data-testid={`card-${feature.title.toLowerCase().replace(' ', '-')}`}
              >
                {/* Animated gradient border */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary via-purple-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm" />
                
                <CardHeader className="pb-4 relative">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-3.5 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-xl relative overflow-hidden`}>
                    <feature.icon className="h-full w-full text-white relative z-10" />
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
                
                {/* Hover reveal effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative container mx-auto px-4 py-24">
        <div className="glass-card rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
          
          <div className="grid lg:grid-cols-2 gap-12 items-center relative">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-bounce-in">
                <Shield className="w-4 h-4" />
                Trusted & Secure
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                <span className="animate-slide-up inline-block">Why Smart People Choose</span>
                <span className="shimmer-text animate-slide-up inline-block" style={{ animationDelay: '0.2s' }}> ExpenseMind</span>
              </h2>
              <div className="space-y-4">
                {[
                  { text: "Automatic expense categorization saves hours", icon: "⚡" },
                  { text: "Real-time budget alerts prevent overspending", icon: "🔔" },
                  { text: "Beautiful insights make data understandable", icon: "📊" },
                  { text: "Secure cloud sync across all your devices", icon: "☁️" },
                  { text: "Export reports for tax season in one click", icon: "📄" }
                ].map((benefit, index) => (
                  <div 
                    key={benefit.text} 
                    className="flex items-center gap-3 stagger-item group hover:translate-x-2 transition-transform duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:shadow-emerald-500/50 transition-all duration-300">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors duration-300">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-2xl blur-2xl animate-pulse-glow" />
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl transform hover:rotate-y-3 hover:rotate-x-3 transition-transform duration-500 card-3d-inner">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse" style={{ animationDelay: '0.1s' }} />
                  <div className="h-20 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-lg mt-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-shimmer" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="h-16 bg-gradient-to-t from-emerald-500/30 to-emerald-500/10 rounded animate-pulse" />
                    <div className="h-16 bg-gradient-to-t from-primary/30 to-primary/10 rounded animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="h-16 bg-gradient-to-t from-purple-500/30 to-purple-500/10 rounded animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative container mx-auto px-4 py-24">
        <div className="relative overflow-hidden rounded-3xl group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-indigo-600 to-purple-700 animate-gradient-shift bg-[length:200%_200%]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          
          {/* Floating particles */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float" />
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
          
          <div className="relative p-12 md:p-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium mb-8 backdrop-blur-sm animate-bounce-in">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Limited Time Offer
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              <span className="animate-slide-up inline-block">Ready to Transform Your</span>
              <br />
              <span className="animate-slide-up inline-block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300" style={{ animationDelay: '0.2s' }}>Financial Life?</span>
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
              Join thousands of users who have taken control of their finances. 
              Start your journey to financial freedom today.
            </p>
            <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <Button 
                size="lg" 
                variant="secondary" 
                className="h-14 px-10 text-lg rounded-full font-semibold hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl relative overflow-hidden group/btn"
                onClick={() => setIsOpen(true)}
                data-testid="button-start-tracking"
              >
                <span className="relative z-10 flex items-center">
                  Get Started — It's Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative container mx-auto px-4 py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-gradient-to-br from-primary to-indigo-600 p-2 rounded-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-primary/50">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg shimmer-text">ExpenseMind</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <a href="#" className="hover:text-primary transition-colors duration-300 hover:underline">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors duration-300 hover:underline">Terms</a>
            <a href="#" className="hover:text-primary transition-colors duration-300 hover:underline">Contact</a>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            &copy; 2024 ExpenseMind. Made with ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}
