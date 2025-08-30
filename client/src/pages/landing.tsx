import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, PieChart, Target, TrendingUp, Shield, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wallet className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">ExpenseTracker</span>
          </div>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-login"
          >
            Sign In
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Take Control of Your
            <span className="text-primary"> Financial Future</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Track expenses, set budgets, and achieve your financial goals with our comprehensive 
            personal expense tracking application.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-3"
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-get-started"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Manage Your Money
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our powerful features help you understand your spending patterns and make better financial decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="text-center" data-testid="card-expense-tracking">
            <CardHeader>
              <PieChart className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Expense Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Easily categorize and track all your expenses with our intuitive interface. 
                Never lose track of where your money goes.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center" data-testid="card-budget-management">
            <CardHeader>
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Budget Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Set monthly budgets for different categories and get alerts when you're approaching your limits.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center" data-testid="card-visual-reports">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Visual Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Beautiful charts and graphs help you visualize your spending patterns and track your progress.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center" data-testid="card-secure-data">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your financial data is encrypted and secure. We never share your information with third parties.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center" data-testid="card-multi-category">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Multiple Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Organize expenses with pre-defined categories or create your own custom categories.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center" data-testid="card-goal-setting">
            <CardHeader>
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Goal Setting</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Set financial goals and track your progress towards achieving them with our goal management tools.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-primary text-primary-foreground rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Financial Life?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who have taken control of their finances with ExpenseTracker.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="text-lg px-8 py-3"
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-start-tracking"
          >
            Start Tracking Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
        <p>&copy; 2024 ExpenseTracker. All rights reserved.</p>
      </footer>
    </div>
  );
}
