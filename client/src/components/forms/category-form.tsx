import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertCategorySchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { isUnauthorizedError } from "@/lib/authUtils";
import { z } from "zod";

const formSchema = insertCategorySchema;

type FormData = z.infer<typeof formSchema>;

interface CategoryFormProps {
  category?: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  onSuccess?: () => void;
}

const categoryIcons = [
  { value: "fas fa-utensils", label: "🍽️ Food & Dining", emoji: "🍽️" },
  { value: "fas fa-car", label: "🚗 Transportation", emoji: "🚗" },
  { value: "fas fa-shopping-bag", label: "🛍️ Shopping", emoji: "🛍️" },
  { value: "fas fa-film", label: "🎬 Entertainment", emoji: "🎬" },
  { value: "fas fa-home", label: "🏠 Bills & Utilities", emoji: "🏠" },
  { value: "fas fa-heart", label: "❤️ Healthcare", emoji: "❤️" },
  { value: "fas fa-plane", label: "✈️ Travel", emoji: "✈️" },
  { value: "fas fa-graduation-cap", label: "🎓 Education", emoji: "🎓" },
  { value: "fas fa-tag", label: "🏷️ Others", emoji: "🏷️" },
];

const categoryColors = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Orange
  "#EF4444", // Red
  "#7C3AED", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#F97316", // Orange
  "#8B5CF6", // Violet
];

export default function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const { toast } = useToast();
  const isEditing = !!category;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      icon: category?.icon || "fas fa-tag",
      color: category?.color || "#3B82F6",
    },
  });

  const selectedColor = form.watch("color");

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (isEditing) {
        await apiRequest("PUT", `/api/categories/${category.id}`, data);
      } else {
        await apiRequest("POST", "/api/categories", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      
      toast({
        title: "Success",
        description: `Category ${isEditing ? 'updated' : 'created'} successfully`,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="form-category">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter category name" 
                  {...field}
                  data-testid="input-name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-icon">
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoryIcons.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      {icon.label}
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
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <div className="space-y-3">
                <FormControl>
                  <Input 
                    type="color" 
                    {...field}
                    className="w-16 h-10"
                    data-testid="input-color"
                  />
                </FormControl>
                <div className="grid grid-cols-5 gap-2">
                  {categoryColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color ? "border-foreground scale-110" : "border-muted"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => field.onChange(color)}
                      data-testid={`color-${color}`}
                    />
                  ))}
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button 
            type="submit" 
            disabled={mutation.isPending}
            className="flex-1"
            data-testid="button-submit-category"
          >
            {mutation.isPending ? "Saving..." : isEditing ? "Update" : "Create"} Category
          </Button>
        </div>
      </form>
    </Form>
  );
}
