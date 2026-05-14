import api from "../api/axios";
import type { ExpenseResponse, Summary, CategoryData } from "../types/expense";

// Summary
export const getSummary = () => {
  return api.get<Summary>("/expense/summary");
};

// Category chart
export const getCategory = () => {
  return api.get<CategoryData[]>("/expense/category");
};

// Expenses (pagination + filter)
export const getExpenses = (params?: {
  page?: number;
  search?: string;
  category?: string;
}) => {
  return api.get<ExpenseResponse>("/expense/list", {
    params,
  });
};


// Baki functions (getSummary, getCategory, getExpenses) ke niche ise add karein:

export const createExpense = (data: {
  title: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
}) => {
  return api.post("/expense/add", data); // Agar backend route alag hai toh use badal lein
};


export const updateExpense = (id: string, data: any) => {
  return api.put(`/expense/edit/${id}`, data); // ✅ Ab backend ke '/edit/:id' se perfect match karega
};


export const deleteExpense = (id: string) => {
  return api.delete(`/expense/delete/${id}`);
};


// logout
export const logoutUser = () => {
  return api.post("/user/logout"); // Ensure path matching with your base userRouter mount path
};