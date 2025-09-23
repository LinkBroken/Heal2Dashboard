"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff, Lock, Person } from "@mui/icons-material";
import { login } from "@/app/actions/login";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rememberMe" ? checked : value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await login(formData.email, formData.password);
    if (res.status !== 200) {
      setLoading(false);
      setError(res.message);
    }
    // Simulate API call
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        },
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={24}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: theme.shadows[24],
            },
          }}
        >
          <CardContent sx={{ p: isMobile ? 3 : 5 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  mb: 2,
                  boxShadow: theme.shadows[8],
                }}
              >
                <Lock sx={{ fontSize: 40, color: "white" }} />
              </Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: "#1a1a1a",
                  mb: 1,
                  fontSize: isMobile ? "1.75rem" : "2.125rem",
                }}
              >
                Welcome Back
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontSize: "1.1rem" }}
              >
                Sign in to your account to continue
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    autoComplete="email"
                    autoFocus
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: "action.active" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": {
                          borderColor: "#667eea",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#667eea",
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    autoComplete="current-password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: "action.active" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": {
                          borderColor: "#667eea",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#667eea",
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    onClick={handleSubmit}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      boxShadow: theme.shadows[8],
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                        boxShadow: theme.shadows[12],
                        transform: "translateY(-1px)",
                      },
                      "&:disabled": {
                        background: "rgba(0, 0, 0, 0.12)",
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
