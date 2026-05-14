// import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // AuthContext import kiya
import { logoutUser } from "../api/expenseApi";
import { useState } from "react";

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); //  Auth state aur logout trigger nikala
  const [mobileOpen, setMobileOpen] = useState(false);

  // Dynamic array checking login state conditions
  const navItems = user?.loggedIn
    ? [
        { text: "Dashboard", path: "/dashboard", action: null },
        { text: "Logout", path: "#", action: "logout" },
      ]
    : [
        { text: "Login", path: "/login", action: null },
        { text: "Sign Up", path: "/signup", action: null },
      ];

  const handleAction = async (item: {
    text: string;
    path: string;
    action: string | null;
  }) => {
    setMobileOpen(false); // Mobile drawer close karein

    if (item.action === "logout") {
      try {
        await logoutUser(); // Backend cleanup call
        logout(); // Frontend react state set to false
        navigate("/", { replace: true });
      } catch (err) {
        console.error("Navbar logout execution error:", err);
      }
    }
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#1e293b" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo Text linking to Home */}
        {/* <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: "none", color: "white", fontWeight: "bold" }}
        >
          💰 ExpenseTracker
        </Typography> */}
        <Typography
  variant="h6"
  component={Link}
  to="/"
  sx={{ 
    textDecoration: "none", 
    color: "white", 
    fontWeight: "bold",
    display: "flex", 
    alignItems: "center",
    gap: "8px" 
  }}
>
  <img 
    src="/expense-app-logo.jpg" 
    alt="ExpenseTracker Logo" 
    style={{ height: "30px", width: "30px", borderRadius: "4px" }} 
  />
  ExpenseTracker
</Typography>


        {/* Desktop View Buttons (Dynamic rendering based on auth) */}
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          {navItems.map((item) => (
            <Button
              key={item.text}
              component={item.action === "logout" ? "button" : Link}
              to={item.action === "logout" ? undefined : item.path}
              onClick={
                item.action === "logout" ? () => handleAction(item) : undefined
              }
              variant={
                item.text === "Sign Up" || item.text === "Logout"
                  ? "contained"
                  : "text"
              }
              color={
                item.text === "Logout"
                  ? "error"
                  : item.text === "Sign Up"
                    ? "primary"
                    : "inherit"
              }
              sx={{
                color: "white",
                mx: 1,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              {item.text}
            </Button>
          ))}
        </Box>

        {/* Mobile Hamburger Menu Icon */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={() => setMobileOpen(true)}
          sx={{ display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Mobile Drawer (Responsive Dynamic Menu Engine) */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        <Box
          sx={{
            width: 250,
            backgroundColor: "#1e293b",
            height: "100%",
            color: "white",
            pt: 2,
          }}
        >
          <List>
            {navItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                {item.action === "logout" ? (
                  <ListItemButton
                    onClick={() => handleAction(item)}
                    sx={{
                      bgcolor: "#dc2626",
                      "&:hover": { bgcolor: "#b91c1c" },
                      m: 1,
                      borderRadius: 1,
                    }}
                  >
                    <ListItemText
                      primary={item.text}
                      sx={{ textAlign: "center", fontWeight: "bold" }}
                    />
                  </ListItemButton>
                ) : (
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                  >
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};
