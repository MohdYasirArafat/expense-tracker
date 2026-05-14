// import { Box, AppBar, Toolbar, Typography, Button, Stack, TextField, Select, MenuItem ,Card,CardContent,IconButton} from "@mui/material";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  TextField,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";

import { Grid } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { useDashboard } from "../hooks/useDashboard"; // Custom hook imported

// Presentational Sub-Modules
import ExpenseCard from "../components/ExpenseCard";
import ExpenseList from "../components/ExpenseList";
import ExpenseForm from "../components/ExpenseForm";

// Production Grade Fixed Identification Asset Mapping
const CATEGORY_COLORS: Record<string, string> = {
  Food: "#1976d2",
  Transport: "#2e7d32",
  Rent: "#ed6c02",
  Shopping: "#9c27b0",
  Entertainment: "#e91e63",
  Health: "#00acc1",
  Salary: "#4caf50",
  Others: "#9e9e9e",
};

const CATEGORY_OPTIONS = Object.keys(CATEGORY_COLORS);

export default function Dashboard() {
  const [openModal, setOpenModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any | null>(null);

  // Destructure state engines directly from industry flow hook
  const {
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
  } = useDashboard();

  if (loading && !expenses) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Typography variant="h6">Loading Dashboard System...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#f4f6fb",
        minHeight: "100vh",
        width: "100vw", //  Pure viewport ko cover karega
        maxWidth: "100%", //  Background ko tight screen bound rakhega
        overflowX: "hidden", //  Horizontal scrolling ko completely band karega
      }}
    >
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: "100%", // Content box pure background ke andar hi load hoga
          boxSizing: "border-box", // Padding calculation ko balanced rakhta hai
        }}
      >
        {/* ... (Baaki aapka topbar, grid layout, chart, aur filters wala poora code bilkul same rahega) ... */}

        <AppBar
          position="static"
          sx={{
            bgcolor: "white",
            color: "black",
            boxShadow: "none",
            borderBottom: "1px solid #eee",
          }}
        >
          <Toolbar
            sx={{
              // 📱 Mobile par elements vertical stacked aur centered honge, 💻 Desktop par side-by-side spacing
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              gap: { xs: 1.5, sm: 0 },
              py: { xs: 1.5, sm: 0 }, // Mobile par vertical spacing padding de di
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                }}
              >
                Dashboard Infrastructure
              </Typography>
            </Box>

            {/* Button handles width dynamically based on layout framework */}
            <Button
              variant="contained"
              onClick={() => setOpenModal(true)}
              sx={{
                mt: { xs: 0.5, sm: 0 },
                // 📱 Mobile screen par 100% width,  Desktop/Tablets par automatic fit layout
                width: { xs: "100%", sm: "auto" },
              }}
            >
              + Add Transaction
            </Button>
          </Toolbar>
        </AppBar>

        {/*  Naya Responsive Setup: */}
        <Stack
          direction={{ xs: "column", sm: "row" }} //  Mobile par vertical list,  Desktop par rows sequence
          spacing={2}
          sx={{ mt: 2, width: "100%" }}
        >
          <TextField
            label="Search via Title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth // Explicitly matches parent frame width constraints
          />
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            displayEmpty
            fullWidth // Auto scales cleanly on phone screens
          >
            <MenuItem value="">All System Categories</MenuItem>
            {CATEGORY_OPTIONS.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        <ExpenseCard summary={summary} />

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* CHARTS CONTAINER CONTAINER - RE-RENDERS HALTED UNLESS GLOBAL DATA MUTATES */}
          {/* <Grid item xs={12} md={6}> */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Expense Breakdown Analytics
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                    >
                      {chartData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={
                            CATEGORY_COLORS[entry.name] ||
                            CATEGORY_COLORS.Others
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* DYNAMIC LIST INTERFACE */}
          {/* <Grid item xs={12} md={6}> */}
          <Grid size={{ xs: 12, md: 6 }}>
            <ExpenseList
              expenses={expenses}
              onRefresh={invalidateDashboardCache}
              onEditClick={(expense) => {
                setEditingExpense(expense);
                setOpenModal(true);
              }}
            />
          </Grid>
        </Grid>

        {/* COMPACT INFRASTRUCTURE PAGINATION GRID */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </Button>
          <Typography sx={{ mx: 2, alignSelf: "center" }}>
            Page {page} of {totalPages}
          </Typography>
          <Button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </Box>
      </Box>

      {/* COMPONENT CRUD FORM HANDLER */}
      <ExpenseForm
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingExpense(null);
        }}
        onSuccess={invalidateDashboardCache}
        editData={editingExpense}
      />
    </Box>
  );
}
