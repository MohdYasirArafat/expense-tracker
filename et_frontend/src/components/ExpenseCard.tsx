import { Stack, Card, CardContent, Typography } from "@mui/material";
import { type Summary } from "../types/expense";

interface ExpenseCardProps {
  summary: Summary;
}

export default function ExpenseCard({ summary }: ExpenseCardProps) {
  return (
    <Stack
      // 📱 Mobile par column format layout, 💻 Desktops par automatically side-by-side row rows layout
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      sx={{ mt: 3, width: "100%" }}
    >
      <Card
        sx={{
          flex: 1,
          boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography
            color="textSecondary"
            variant="subtitle2"
            sx={{ fontWeight: "medium" }}
          >
            Balance
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: "bold", mt: 0.5 }}>
            ₹{summary.balance}
          </Typography>
        </CardContent>
      </Card>

      <Card
        sx={{
          flex: 1,
          boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography
            color="textSecondary"
            variant="subtitle2"
            sx={{ fontWeight: "medium" }}
          >
            Income
          </Typography>
          <Typography
            variant="h5"
            sx={{ color: "green", fontWeight: "bold", mt: 0.5 }}
          >
            ₹{summary.income}
          </Typography>
        </CardContent>
      </Card>

      <Card
        sx={{
          flex: 1,
          boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography
            color="textSecondary"
            variant="subtitle2"
            sx={{ fontWeight: "medium" }}
          >
            Expense
          </Typography>
          <Typography
            variant="h5"
            sx={{ color: "red", fontWeight: "bold", mt: 0.5 }}
          >
            ₹{summary.expense}
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}
