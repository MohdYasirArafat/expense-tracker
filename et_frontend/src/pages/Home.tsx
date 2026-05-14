import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const slides = [
  {
    title: "Track Expenses Easily",
    desc: "Monitor your daily spending habits with smart automated insights.",
    bg: "#3b82f6",
  },
  {
    title: "Smart Analytical Charts",
    desc: "Visualize your categories seamlessly through clean interface layers.",
    bg: "#10b981",
  },
  {
    title: "Secure Data Assets",
    desc: "Your monetary storage metrics remain protected with standard encryption.",
    bg: "#8b5cf6",
  },
];

export const Home = () => {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Dynamic Animated Slider Banner */}
      <Box
        sx={{
          backgroundColor: slides[currentSlide].bg,
          color: "white",
          py: { xs: 8, md: 14 },
          textAlign: "center",
          transition: "background-color 0.8s ease-in-out",
          position: "relative",
        }}
      >
        <Container maxWidth="md">
          <Box key={currentSlide} sx={{ animation: "fadeIn 0.8s ease-in-out" }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                mb: 2,
                fontSize: { xs: "2.5rem", md: "4rem" },
              }}
            >
              {slides[currentSlide].title}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.9,
                fontSize: { xs: "1rem", md: "1.5rem" },
              }}
            >
              {slides[currentSlide].desc}
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            component={Link}
            to={user?.loggedIn ? "/dashboard" : "/signup"}
            sx={{
              backgroundColor: "#0f172a",
              color: "white",
              "&:hover": { backgroundColor: "#334155" },
              px: 4,
              py: 1.5,
              fontWeight: "bold",
            }}
          >
            {user?.loggedIn ? "Go to Dashboard" : "Get Started Free"}
          </Button>
        </Container>
      </Box>

      {/* Info Features Grid (100% App-Related & English Only) */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
            gap: 4,
          }}
        >
          {/* Card 1: Related to entry logging */}
          <Card sx={{ textAlign: "center", p: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                ⚡ Quick Expense Logging
              </Typography>
              <Typography color="text.secondary">
                Log your daily spendings instantly. Organize your outgoings by
                assigning custom categories like Food, Bills, Rent, or Shopping.
              </Typography>
            </CardContent>
          </Card>

          {/* Card 2: Related to the charts/visual layout */}
          <Card sx={{ textAlign: "center", p: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                📊 Smart Insights & Charts
              </Typography>
              <Typography color="text.secondary">
                Monitor your cash leaks through dynamic visual charts. See a
                clean categorical breakdown of exactly where your money goes.
              </Typography>
            </CardContent>
          </Card>

          {/* Card 3: Related to security/cookie session */}
          <Card sx={{ textAlign: "center", p: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                🛡️ Secure Session Leases
              </Typography>
              <Typography color="text.secondary">
                Your transaction metrics remain confidential. Safe HTTP-only
                browser cookies encrypt and isolate your active login state.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* Embedded CSS for Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </Box>
  );
};
