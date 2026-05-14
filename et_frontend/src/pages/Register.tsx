import React, { useState } from "react";
import {
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  Link as MuiLink,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../api/axios";
import { useNavigate, Link as RouterLink } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Visibility and notification state managers
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>("");
  const [popupSeverity, setPopupSeverity] = useState<"success" | "error">(
    "success",
  );

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/user/signup", { name, email, password });

      setPopupSeverity("success");
      setPopupMessage(res.data?.message || "User registered successfully!");
      setOpenPopup(true);

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Registration failed. Try again.";
      setPopupSeverity("error");
      setPopupMessage(errorMsg);
      setOpenPopup(true);
    }
  };

  return (
    //  Container wrapper makes sure everything aligns dead-center inside the available height
    <Box
      sx={{
        display: "flex",
        flexGrow: 1,
        alignItems: "center",
        py: { xs: 4, sm: 6 },
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
          <Typography
            variant="h4"
            sx={{ textAlign: "center", mb: 3, fontWeight: "bold" }}
          >
            Sign Up
          </Typography>
          <Box
            component="form"
            onSubmit={handleRegister}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Name"
              required
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Email"
              type="email"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/*  Password Input with Toggle Eye Icon Adornment */}
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              //  FIX: Moved InputProps structure into slotProps configuration block
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 1 }}
            >
              Sign Up
            </Button>

            <Typography
              variant="body2"
              sx={{ textAlign: "center", mt: 1, color: "text.secondary" }}
            >
              Already have an account?{" "}
              <MuiLink
                component={RouterLink}
                to="/login"
                sx={{ fontWeight: "bold", textDecoration: "none" }}
              >
                Login
              </MuiLink>
            </Typography>
          </Box>
        </Paper>

        <Snackbar
          open={openPopup}
          autoHideDuration={4000}
          onClose={() => setOpenPopup(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setOpenPopup(false)}
            severity={popupSeverity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {popupMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default Register;
