import { useState, useEffect, useCallback } from "react";
import { type Summary, type CategoryData, type ExpenseResponse } from "../types/expense";
import { getExpenses, getSummary, getCategory } from "../api/expenseApi";

export function useDashboard() {
  const [expenses, setExpenses] = useState<ExpenseResponse | null>(null);
  const [summary, setSummary] = useState<Summary>({ income: 0, expense: 0, balance: 0 });
  const [chartData, setChartData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  // Search input debouncer trigger logic
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when queries transform
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category]);

  // Core Data Fetch Operations (Locked using useCallback to prevent recreational bindings)
  const fetchTransactionalData = useCallback(async () => {
    try {
      setLoading(true);
      const [summaryRes, expenseRes] = await Promise.all([
        getSummary(),
        getExpenses({ page, search: debouncedSearch, category }),
      ]);
      setSummary(summaryRes.data);
      setExpenses(expenseRes.data);
      setTotalPages(expenseRes.data.totalPages);
    } catch (err) {
      console.error("Transactional API Error:", err);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, category]);

  // Chart Load Isolated Function (Isolated from search strings)
  const fetchChartAnalytics = useCallback(async () => {
    try {
      const categoryRes = await getCategory();
      setChartData(categoryRes.data);
    } catch (err) {
      console.error("Analytics Chart Error:", err);
    }
  }, []);

  // Sync effect chains
  useEffect(() => {
    fetchTransactionalData();
  }, [fetchTransactionalData]);

  useEffect(() => {
    fetchChartAnalytics();
  }, [fetchChartAnalytics]);

  // Dynamic state invalidator function used globally after CRUD operations
  const invalidateDashboardCache = useCallback(() => {
    fetchTransactionalData();
    fetchChartAnalytics();
  }, [fetchTransactionalData, fetchChartAnalytics]);

  return {
    expenses,
    summary,
    chartData,
    loading,
    page,
    setPage,
    category,
    setCategory,
    search,
    setSearch,
    totalPages,
    invalidateDashboardCache,
  };
}
