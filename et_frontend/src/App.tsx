import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import Login from "./pages/Login";
import { Box, CircularProgress } from "@mui/material";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

// Protected Route Guard Controller Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  // Session load hote waqt clean dynamic spinner render hoga
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Strict structural authentication token verification check
  if (!user || !user.loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Main box stretches full screen height using standard layout rules */}
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <Navbar />

          {/* Main Content Area: Flex Grow pushes the footer down seamlessly */}
          <Box
            component="main"
            sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Register />} />

              {/* Protected Workspace Area */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Global Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>

          <Footer />
        </Box>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
