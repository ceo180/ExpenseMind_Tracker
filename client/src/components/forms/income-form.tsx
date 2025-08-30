import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertIncomeSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { isUnauthorizedError } from "@/lib/authUtils";
import { z } from "zod";
import { format } from "date-fns";

const formSchema = insertIncomeSchema.extend({
  amount: z.string().min(1, "Amount is required"),
  source: z.string().min(1, "Source is required"),
  date: z.string().min(1, "Date is required"),
});

type FormData = z.infer<typeof formSchema>;

interface IncomeFormProps {
  income?: {
    id: string;
    amount: string;
    source: string;
    description?: string;
    date: string;
  };
  onSuccess?: () => void;
}

export default function IncomeForm({ income, onSuccess }: IncomeFormProps) {
  const { toast } = useToast();
  const isEditing = !!income;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: income?.amount || "",
      source: income?.source || "",
      description: income?.description || undefined,
      date: income ? format(new Date(income.date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
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
        await apiRequest("PUT", `/api/income/${income.id}`, payload);
      } else {
        await apiRequest("POST", "/api/income", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/income"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/totals"] });
      
      toast({
        title: "Success",
        description: `Income ${isEditing ? 'updated' : 'created'} successfully`,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="form-income">
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
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Income Source</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Salary, Freelance, Investment" 
                  {...field}
                  data-testid="input-source"
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
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional details about this income..." 
                  {...field}
                  data-testid="textarea-description"
                />
              </FormControl>
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

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={mutation.isPending}
            data-testid="button-submit"
          >
            {mutation.isPending ? "Saving..." : isEditing ? "Update Income" : "Create Income"}
          </Button>
        </div>
      </form>
    </Form>
  );
}