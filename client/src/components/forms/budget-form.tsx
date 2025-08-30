import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertBudgetSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { isUnauthorizedError } from "@/lib/authUtils";
import { z } from "zod";
import { format } from "date-fns";

const formSchema = insertBudgetSchema.extend({
  startDate: z.string().min(1, "Start date is required"),
});

type FormData = z.infer<typeof formSchema>;

interface BudgetFormProps {
  budget?: {
    id: string;
    amount: string;
    period: string;
    startDate: string;
    categoryId: string;
  };
  onSuccess?: () => void;
}

export default function BudgetForm({ budget, onSuccess }: BudgetFormProps) {
  const { toast } = useToast();
  const isEditing = !!budget;

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: budget?.amount || "",
      period: budget?.period || "monthly",
      categoryId: budget?.categoryId || "",
      startDate: budget ? format(new Date(budget.startDate), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        amount: data.amount,
      };

      if (isEditing) {
        await apiRequest("PUT", `/api/budgets/${budget.id}`, payload);
      } else {
        await apiRequest("POST", "/api/budgets", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/budget-progress"] });
      
      toast({
        title: "Success",
        description: `Budget ${isEditing ? 'updated' : 'created'} successfully`,
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="form-budget">
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
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Amount</FormLabel>
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
          name="period"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Period</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-period">
                    <SelectValue placeholder="Select budget period" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field}
                  data-testid="input-start-date"
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
            data-testid="button-submit-budget"
          >
            {mutation.isPending ? "Saving..." : isEditing ? "Update" : "Create"} Budget
          </Button>
        </div>
      </form>
    </Form>
  );
}
