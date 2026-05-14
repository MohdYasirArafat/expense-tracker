import { Card, CardContent, Typography, Box, IconButton } from "@mui/material"; 
import { Edit, Delete } from "@mui/icons-material"; 
import { type ExpenseResponse, type Expense } from "../types/expense"; 
import { deleteExpense } from "../api/expenseApi"; 

interface ExpenseListProps { 
  expenses: ExpenseResponse | null; 
  onRefresh: () => void; 
  onEditClick: (expense: Expense) => void; 
} 

export default function ExpenseList({ expenses, onRefresh, onEditClick }: ExpenseListProps) { 
  
  const handleDelete = async (id: string) => { 
    if (window.confirm("Kya aap is transaction ko delete karna chahte hain?")) { 
      try { 
        await deleteExpense(id); 
        onRefresh(); 
      } catch (err) { 
        console.error("Delete error:", err); 
      } 
    } 
  }; 

  return ( 
    <Card sx={{ borderRadius: 2, boxShadow: "0px 2px 8px rgba(0,0,0,0.05)", width: "100%" }}> 
      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}> 
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>Recent Expenses</Typography> 
        
        {/* Empty State handler layer safety wrapper check */}
        {(!expenses || expenses.expenses.length === 0) && (
          <Typography variant="body2" color="textSecondary" sx={{ textCenter: "center", py: 4, textAlign: "center" }}>
            No transactions found for this search/filter criteria.
          </Typography>
        )}

        {expenses?.expenses.map((expense) => ( 
          <Box 
            key={expense._id} 
            sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              py: 1.5, 
              borderBottom: "1px solid #eee",
              gap: 1.5 // ✅ Prevents boxes context crushing into each other on small devices
            }} 
          > 
            {/* Left Content Area: Added max-width control bounds to prevent texts running into actions block */}
            <Box sx={{ minWidth: 0, flexGrow: 1 }}> 
              <Typography 
                sx={{ 
                  fontWeight: "bold",
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                  whiteSpace: "nowrap",       // ✅ Text boundaries handling configuration rules
                  overflow: "hidden",        
                  textOverflow: "ellipsis"    // Long titles text auto converts to '...' rather than colliding
                }}
              >
                {expense.title}
              </Typography> 
              <Typography variant="caption" color="textSecondary" sx={{ display: "block", mt: -0.2 }}>
                {expense.category}
              </Typography> 
            </Box> 

            {/* Right Action Units Block Container */}
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.2, sm: 1 }, flexShrink: 0 }}> 
              <Typography 
                sx={{ 
                  color: expense.category === "Salary" ? "green" : "red", 
                  fontWeight: "bold", 
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                  mr: { xs: 0.5, sm: 2 } 
                }}
              > 
                ₹{expense.amount} 
              </Typography> 
              
              {/* EDIT BUTTON ELEMENT */}
              <IconButton size="small" color="primary" onClick={() => onEditClick(expense)}> 
                <Edit fontSize="small" /> 
              </IconButton> 
              
              {/* DELETE BUTTON ELEMENT */}
              <IconButton size="small" color="error" onClick={() => handleDelete(expense._id)}> 
                <Delete fontSize="small" /> 
              </IconButton> 
            </Box> 
          </Box> 
        ))} 
      </CardContent> 
    </Card> 
  ); 
}
