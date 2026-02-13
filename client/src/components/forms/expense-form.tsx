import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertExpenseSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { isUnauthorizedError } from "@/lib/authUtils";
import { z } from "zod";
import { format } from "date-fns";
import { Link } from "wouter";
import { Tags, AlertTriangle, ArrowRight } from "lucide-react";

const formSchema = insertExpenseSchema.extend({
  amount: z.string().min(1, "Amount is required"),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  date: z.string().min(1, "Date is required"),
});

type FormData = z.infer<typeof formSchema>;

interface ExpenseFormProps {
  expense?: {
    id: string;
    amount: string;
    description: string;
    paymentMethod: string;
    date: string;
    categoryId: string;
  };
  onSuccess?: () => void;
}

export default function ExpenseForm({ expense, onSuccess }: ExpenseFormProps) {
  const { toast } = useToast();
  const isEditing = !!expense;

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: expense?.amount || "",
      description: expense?.description || "",
      categoryId: expense?.categoryId || "",
      paymentMethod: expense?.paymentMethod || "cash",
      date: expense ? format(new Date(expense.date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = {
        ...data,
        date: data.date, // Let backend handle date transformation
        amount: data.amount,
      };

      if (isEditing) {
        await apiRequest("PUT", `/api/expenses/${expense.id}`, payload);
      } else {
        await apiRequest("POST", "/api/expenses", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/totals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/monthly-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/budget-progress"] });
      
      toast({
        title: "Success",
        description: `Expense ${isEditing ? 'updated' : 'created'} successfully`,
      });
      
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  // Show message if no categories exist
  if (!categories || (categories as any[]).length === 0) {
    return (
      <div className="space-y-4 py-4">
        <Alert className="border-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-amber-800 dark:text-amber-200">No Categories Found</p>
              <AlertDescription className="text-amber-700 dark:text-amber-300">
                You need to create at least one category before adding expenses. Categories help you organize and track your spending.
              </AlertDescription>
            </div>
          </div>
        </Alert>
        <Link href="/categories">
          <Button className="w-full rounded-xl h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25">
            <Tags className="h-4 w-4 mr-2" />
            Create Your First Category
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="form-expense">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  {...field}
                  data-testid="input-amount"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter expense description" 
                  {...field}
                  data-testid="input-description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(categories as any)?.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-payment-method">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="creditCard">Credit Card</SelectItem>
                  <SelectItem value="debitCard">Debit Card</SelectItem>
                  <SelectItem value="digitalWallet">Digital Wallet</SelectItem>
                  <SelectItem value="bankTransfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field}
                  data-testid="input-date"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button 
            type="submit" 
            disabled={mutation.isPending}
            className="flex-1"
            data-testid="button-submit-expense"
          >
            {mutation.isPending ? "Saving..." : isEditing ? "Update" : "Create"} Expense
          </Button>
        </div>
      </form>
    </Form>
  );
}
