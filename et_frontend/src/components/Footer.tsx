import { Box, Typography, Container, Link } from "@mui/material";
import { LinkedIn, Language, Phone, Email, GitHub } from "@mui/icons-material"; // 🟢 GitHub icon import kiya

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#0f172a",
        color: "#94a3b8",
        py: 4,
        mt: "auto",
        borderTop: "1px solid #1e293b",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "center", md: "flex-start" },
            gap: 4,
            textAlign: { xs: "center", md: "left" },
          }}
        >
          {/* Left Column: Developer Identity */}
          <Box>
            <Typography
              variant="h6"
              color="white"
              sx={{ fontWeight: "bold", mb: 0.5 }}
            >
              Mohammed Yasir
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontStyle: "italic", opacity: 0.8, mb: 2 }}
            >
              s/o Gulam Sabir
            </Typography>
            <Typography variant="body2">
              © {new Date().getFullYear()} ExpenseTracker Corp. All rights
              reserved.
            </Typography>
          </Box>

          {/* Center Column: Contact Details */}
          <Box>
            <Typography
              variant="subtitle2"
              color="white"
              sx={{
                fontWeight: "bold",
                mb: 1.5,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Contact Me
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                alignItems: { xs: "center", md: "flex-start" },
              }}
            >
              <Link
                href="tel:+919389753565"
                color="inherit"
                underline="hover"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Phone fontSize="small" sx={{ color: "#3b82f6" }} /> +91
                9389753565
              </Link>
              <Link
                href="mailto:mohdyasir.er@gmail.com"
                color="inherit"
                underline="hover"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Email fontSize="small" sx={{ color: "#3b82f6" }} />{" "}
                mohdyasir.er@gmail.com
              </Link>
            </Box>
          </Box>

          {/* Right Column: Professional Network Links */}
          <Box>
            <Typography
              variant="subtitle2"
              color="white"
              sx={{
                fontWeight: "bold",
                mb: 1.5,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Professional Links
            </Typography>
            {/* 🟢 Responsive Row: Custom layout links display wrapping flexbox engine */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" }, // Mobile par vertical list, tablets/desktop par side-by-side row
                gap: 3,
                justifyContent: { xs: "center", md: "flex-start" },
                alignItems: { xs: "center", md: "flex-start" },
              }}
            >
              <Link
                href="https://www.linkedin.com/in/mohd-yasir-027614217/?isSelfProfile=false"
                target="_blank"
                rel="noopener"
                color="inherit"
                underline="hover"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <LinkedIn sx={{ color: "#0a66c2" }} /> LinkedIn
              </Link>

              {/* 🟢 NEW ADDITION: GitHub Profile Anchor Link */}
              <Link
                href="https://github.com/MohdYasirArafat"
                target="_blank"
                rel="noopener"
                color="inherit"
                underline="hover"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <GitHub sx={{ color: "#ffffff" }} /> GitHub
              </Link>

              <Link
                href="https://myportfolio-react-pi.vercel.app/"
                target="_blank"
                rel="noopener"
                color="inherit"
                underline="hover"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <Language sx={{ color: "#10b981" }} /> Portfolio
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
