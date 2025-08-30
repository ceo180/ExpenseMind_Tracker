import {
  users,
  categories,
  expenses,
  income,
  budgets,
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type Expense,
  type InsertExpense,
  type Income,
  type InsertIncome,
  type Budget,
  type InsertBudget,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, gte, lte, sum, sql } from "drizzle-orm";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Category operations
  getCategories(userId: string): Promise<Category[]>;
  createCategory(userId: string, category: InsertCategory): Promise<Category>;
  updateCategory(userId: string, id: string, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(userId: string, id: string): Promise<void>;
  
  // Expense operations
  getExpenses(userId: string, limit?: number): Promise<(Expense & { category: Category })[]>;
  createExpense(userId: string, expense: InsertExpense): Promise<Expense>;
  updateExpense(userId: string, id: string, expense: Partial<InsertExpense>): Promise<Expense>;
  deleteExpense(userId: string, id: string): Promise<void>;
  
  // Income operations
  getIncome(userId: string, limit?: number): Promise<Income[]>;
  createIncome(userId: string, incomeData: InsertIncome): Promise<Income>;
  
  // Budget operations
  getBudgets(userId: string): Promise<(Budget & { category: Category })[]>;
  createBudget(userId: string, budget: InsertBudget): Promise<Budget>;
  updateBudget(userId: string, id: string, budget: Partial<InsertBudget>): Promise<Budget>;
  deleteBudget(userId: string, id: string): Promise<void>;
  
  // Analytics operations
  getMonthlyExpenses(userId: string, year: number, month: number): Promise<{ categoryId: string; categoryName: string; total: number }[]>;
  getTotalExpensesThisMonth(userId: string): Promise<number>;
  getTotalIncomeThisMonth(userId: string): Promise<number>;
  getBudgetProgress(userId: string): Promise<{ budget: Budget & { category: Category }; spent: number }[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Category operations
  async getCategories(userId: string): Promise<Category[]> {
    return await db
      .select()
      .from(categories)
      .where(eq(categories.userId, userId))
      .orderBy(categories.name);
  }

  async createCategory(userId: string, category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values({ ...category, userId })
      .returning();
    return newCategory;
  }

  async updateCategory(userId: string, id: string, category: Partial<InsertCategory>): Promise<Category> {
    const [updatedCategory] = await db
      .update(categories)
      .set(category)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
      .returning();
    return updatedCategory;
  }

  async deleteCategory(userId: string, id: string): Promise<void> {
    await db
      .delete(categories)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)));
  }

  // Expense operations
  async getExpenses(userId: string, limit = 50): Promise<(Expense & { category: Category })[]> {
    const result = await db
      .select({
        id: expenses.id,
        userId: expenses.userId,
        categoryId: expenses.categoryId,
        amount: expenses.amount,
        description: expenses.description,
        paymentMethod: expenses.paymentMethod,
        date: expenses.date,
        createdAt: expenses.createdAt,
        category: categories,
      })
      .from(expenses)
      .innerJoin(categories, eq(expenses.categoryId, categories.id))
      .where(eq(expenses.userId, userId))
      .orderBy(desc(expenses.date))
      .limit(limit);

    return result;
  }

  async createExpense(userId: string, expense: InsertExpense): Promise<Expense> {
    const [newExpense] = await db
      .insert(expenses)
      .values({ ...expense, userId })
      .returning();
    return newExpense;
  }

  async updateExpense(userId: string, id: string, expense: Partial<InsertExpense>): Promise<Expense> {
    const [updatedExpense] = await db
      .update(expenses)
      .set(expense)
      .where(and(eq(expenses.id, id), eq(expenses.userId, userId)))
      .returning();
    return updatedExpense;
  }

  async deleteExpense(userId: string, id: string): Promise<void> {
    await db
      .delete(expenses)
      .where(and(eq(expenses.id, id), eq(expenses.userId, userId)));
  }

  // Income operations
  async getIncome(userId: string, limit = 50): Promise<Income[]> {
    return await db
      .select()
      .from(income)
      .where(eq(income.userId, userId))
      .orderBy(desc(income.date))
      .limit(limit);
  }

  async createIncome(userId: string, incomeData: InsertIncome): Promise<Income> {
    const [newIncome] = await db
      .insert(income)
      .values({ ...incomeData, userId })
      .returning();
    return newIncome;
  }

  // Budget operations
  async getBudgets(userId: string): Promise<(Budget & { category: Category })[]> {
    const result = await db
      .select({
        id: budgets.id,
        userId: budgets.userId,
        categoryId: budgets.categoryId,
        amount: budgets.amount,
        period: budgets.period,
        startDate: budgets.startDate,
        createdAt: budgets.createdAt,
        category: categories,
      })
      .from(budgets)
      .innerJoin(categories, eq(budgets.categoryId, categories.id))
      .where(eq(budgets.userId, userId));

    return result;
  }

  async createBudget(userId: string, budget: InsertBudget): Promise<Budget> {
    const [newBudget] = await db
      .insert(budgets)
      .values({ ...budget, userId })
      .returning();
    return newBudget;
  }

  async updateBudget(userId: string, id: string, budget: Partial<InsertBudget>): Promise<Budget> {
    const [updatedBudget] = await db
      .update(budgets)
      .set(budget)
      .where(and(eq(budgets.id, id), eq(budgets.userId, userId)))
      .returning();
    return updatedBudget;
  }

  async deleteBudget(userId: string, id: string): Promise<void> {
    await db
      .delete(budgets)
      .where(and(eq(budgets.id, id), eq(budgets.userId, userId)));
  }

  // Analytics operations
  async getMonthlyExpenses(userId: string, year: number, month: number): Promise<{ categoryId: string; categoryName: string; total: number }[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const result = await db
      .select({
        categoryId: expenses.categoryId,
        categoryName: categories.name,
        total: sum(expenses.amount),
      })
      .from(expenses)
      .innerJoin(categories, eq(expenses.categoryId, categories.id))
      .where(
        and(
          eq(expenses.userId, userId),
          gte(expenses.date, startDate),
          lte(expenses.date, endDate)
        )
      )
      .groupBy(expenses.categoryId, categories.name);

    return result.map(r => ({
      categoryId: r.categoryId,
      categoryName: r.categoryName,
      total: parseFloat(r.total || "0"),
    }));
  }

  async getTotalExpensesThisMonth(userId: string): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const result = await db
      .select({
        total: sum(expenses.amount),
      })
      .from(expenses)
      .where(
        and(
          eq(expenses.userId, userId),
          gte(expenses.date, startOfMonth),
          lte(expenses.date, endOfMonth)
        )
      );

    return parseFloat(result[0]?.total || "0");
  }

  async getTotalIncomeThisMonth(userId: string): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const result = await db
      .select({
        total: sum(income.amount),
      })
      .from(income)
      .where(
        and(
          eq(income.userId, userId),
          gte(income.date, startOfMonth),
          lte(income.date, endOfMonth)
        )
      );

    return parseFloat(result[0]?.total || "0");
  }

  async getBudgetProgress(userId: string): Promise<{ budget: Budget & { category: Category }; spent: number }[]> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const budgetsData = await this.getBudgets(userId);
    const result = [];

    for (const budget of budgetsData) {
      const spentResult = await db
        .select({
          total: sum(expenses.amount),
        })
        .from(expenses)
        .where(
          and(
            eq(expenses.userId, userId),
            eq(expenses.categoryId, budget.categoryId),
            gte(expenses.date, startOfMonth),
            lte(expenses.date, endOfMonth)
          )
        );

      const spent = parseFloat(spentResult[0]?.total || "0");
      result.push({ budget, spent });
    }

    return result;
  }
}

export const storage = new DatabaseStorage();
