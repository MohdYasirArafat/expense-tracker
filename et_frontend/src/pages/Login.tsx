// import React, { useState } from "react";
// import {
//   Button,
//   Container,
//   Paper,
//   TextField,
//   Typography,
//   Box,
//   Link as MuiLink,
//   Snackbar,
//   Alert,
//   IconButton,
//   InputAdornment,
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { useNavigate, Link as RouterLink } from "react-router-dom";
// import api from "../api/axios";
// import { useAuth } from "../context/AuthContext";

// function Login() {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");

//   // Visibility toggle and validation error states
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [openPopup, setOpenPopup] = useState<boolean>(false);
//   const [errorMessage, setErrorMessage] = useState<string>("");

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const res = await api.post("/user/login", { email, password });
//       console.log(res.data);

//       login({ loggedIn: true });
//       setEmail("");
//       setPassword("");
//       navigate("/dashboard", { replace: true });
//     } catch (error: any) {
//       const errorMsg =
//         error.response?.data?.message || "Invalid credentials. Try again.";
//       setErrorMessage(errorMsg);
//       setOpenPopup(true);
//     }
//   };

//   return (
//     // Center align framework wrapper structure
//     <Box
//       sx={{
//         display: "flex",
//         flexGrow: 1,
//         alignItems: "center",
//         py: { xs: 4, sm: 6 },
//       }}
//     >
//       <Container maxWidth="sm">
//         <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
//           <Typography
//             variant="h4"
//             sx={{ textAlign: "center", mb: 3, fontWeight: "bold" }}
//           >
//             Login
//           </Typography>
//           <Box
//             component="form"
//             onSubmit={handleLogin}
//             sx={{ display: "flex", flexDirection: "column", gap: 2 }}
//           >
//             <TextField
//               label="Email"
//               type="email"
//               placeholder="Enter email"
//               required
//               fullWidth
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />

//             {/* Password input configuration with inline custom adornment icons */}
//             <TextField
//               label="Password"
//               type={showPassword ? "text" : "password"}
//               placeholder="Enter password"
//               required
//               fullWidth
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               // FIX: Moved InputProps structure into slotProps configuration block
//               slotProps={{
//                 input: {
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <IconButton
//                         onClick={() => setShowPassword(!showPassword)}
//                         edge="end"
//                       >
//                         {showPassword ? <VisibilityOff /> : <Visibility />}
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 },
//               }}
//             />

//             <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               size="large"
//               sx={{ mt: 1 }}
//             >
//               Login
//             </Button>

//             <Typography
//               variant="body2"
//               sx={{ textAlign: "center", mt: 1, color: "text.secondary" }}
//             >
//               Don't have an account?{" "}
//               <MuiLink
//                 component={RouterLink}
//                 to="/signup"
//                 sx={{ fontWeight: "bold", textDecoration: "none" }}
//               >
//                 Sign Up
//               </MuiLink>
//             </Typography>
//           </Box>
//         </Paper>

//         <Snackbar
//           open={openPopup}
//           autoHideDuration={4000}
//           onClose={() => setOpenPopup(false)}
//           anchorOrigin={{ vertical: "top", horizontal: "center" }}
//         >
//           <Alert
//             onClose={() => setOpenPopup(false)}
//             severity="error"
//             variant="filled"
//             sx={{ width: "100%" }}
//           >
//             {errorMessage}
//           </Alert>
//         </Snackbar>
//       </Container>
//     </Box>
//   );
// }

// export default Login;

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
import { useNavigate, Link as RouterLink } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Visibility toggle and validation error states
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/user/login", { email, password });
      console.log("Login Success Data:", res.data);
      
      // 🟢 FIX: Local context login state ko pehle update karein taaki checks clear hon
      login({ loggedIn: true });
      
      setEmail("");
      setPassword("");
      
      // Navigate to dashboard immediately
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      console.error("Component handling exception details:", error);
      const errorMsg = error.response?.data?.message || "Invalid credentials. Try again.";
      setErrorMessage(errorMsg);
      setOpenPopup(true);
    }
  };

  return (
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
          <Typography variant="h4" sx={{ textAlign: "center", mb: 3, fontWeight: "bold" }}>
            Login
          </Typography>
          <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              placeholder="Enter email"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 1 }}>
              Login
            </Button>
            <Typography variant="body2" sx={{ textAlign: "center", mt: 1, color: "text.secondary" }}>
              Don't have an account?{" "}
              <MuiLink
                component={RouterLink}
                to="/signup"
                sx={{ fontWeight: "bold", textDecoration: "none" }}
              >
                Sign Up
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
        <Snackbar open={openPopup} autoHideDuration={4000} onClose={() => setOpenPopup(false)}>
          <Alert onClose={() => setOpenPopup(false)} severity="error" variant="filled" sx={{ width: "100%" }}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default Login;

