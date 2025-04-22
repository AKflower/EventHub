import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useUserContext } from "../../context/UserContext";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Avatar,
  InputAdornment,
  IconButton,
  Card,
  Stack,
} from "@mui/material";
import {
  AdminPanelSettings as AdminIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon,
} from "@mui/icons-material";

const API_URL =
  process.env.REACT_APP_API_URL + "/api" || "http://localhost:3001/api";

const AdminLogin = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setSessionInfo } = useUserContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        mail,
        password,
      });

      if (response.data && response.data.token) {
        // Get user details to check role
        const userResponse = await axios.get(
          `${API_URL}/users/${response.data.userId}`,
          {
            headers: {
              Authorization: `Bearer ${response.data.token}`,
            },
          }
        );

        if (userResponse.data.roleId !== 1) {
          toast.error("Access denied. Admin privileges required.");
          setLoading(false);
          return;
        }

        // Save auth info to context
        setSessionInfo({
          token: response.data.token,
          userId: response.data.userId,
          isAdmin: true,
        });

        // Save token to localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("isAdmin", "true");

        toast.success("Login successful!");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.error ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={8}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              p: 3,
              backgroundColor: "#379777",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "#fff",
                color: "#379777",
                mb: 2,
              }}
            >
              <AdminIcon sx={{ fontSize: 50 }} />
            </Avatar>
            <Typography variant="h4" color="white" fontWeight="bold">
              Admin Portal
            </Typography>
            <Typography variant="body1" color="white" sx={{ opacity: 0.8 }}>
              Sign in to manage your events and users
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={toggleShowPassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{
                py: 1.5,
                backgroundColor: "#379777",
                "&:hover": {
                  backgroundColor: "#2B7C61",
                },
                borderRadius: 2,
                fontSize: "1rem",
                fontWeight: "bold",
              }}
              startIcon={loading ? null : <LoginIcon />}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>
        </Card>

        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          sx={{ mt: 2, opacity: 0.7 }}
        >
          <Typography variant="body2" color="text.secondary">
            Event Hub Admin Portal
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default AdminLogin;
