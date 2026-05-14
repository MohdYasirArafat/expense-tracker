import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { createExpense, updateExpense } from "../api/expenseApi";

const CATEGORY_OPTIONS = [
  "Food",
  "Transport",
  "Rent",
  "Shopping",
  "Entertainment",
  "Health",
  "Salary",
  "Others",
];

interface ExpenseFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: any;
}

export default function ExpenseForm({
  open,
  onClose,
  onSuccess,
  editData,
}: ExpenseFormProps) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  // 🔄 Synergizes modal content fields on edit trigger or resets on fresh creation
  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title || "",
        amount: editData.amount?.toString() || "",
        category: editData.category || "Food",
        description: editData.description || "",
        date: editData.date
          ? new Date(editData.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    } else {
      setForm({
        title: "",
        amount: "",
        category: "Food",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [editData, open]);

  // Combined central change handler covering text fields as well as select nodes
  const handleFormChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: form.title,
        amount: Number(form.amount),
        category: form.category,
        description: form.description,
        date: form.date,
      };

      if (editData) {
        await updateExpense(editData._id, payload);
      } else {
        await createExpense(payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* ✅ FIX 1: Turned title dynamic based on user CRUD interaction context */}
      <DialogTitle sx={{ fontWeight: "bold" }}>
        {editData ? "Edit Transaction Details" : "Add New Transaction"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleFormChange}
              required
              fullWidth
            />
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleFormChange}
              required
              fullWidth
            />

            {/* ✅ FIX 2: Optimized select mapping input controls integration attributes */}
            <Select
              name="category"
              value={form.category}
              onChange={handleFormChange} // Standardized input handler
              fullWidth
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat === "Salary" ? "Salary (Income)" : cat}
                </MenuItem>
              ))}
            </Select>

            <TextField
              label="Date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleFormChange}
              required
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleFormChange}
              multiline
              rows={3}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            {editData ? "Update Changes" : "Save Record"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
