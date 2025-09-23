import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Alert,
  InputAdornment,
  Fade,
  Button,
  Grid,
  IconButton,
} from "@mui/material";
import {
  Email,
  Lock,
  Send,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useDoctorSignupStore } from "../../store/doctorSignupStore";
import { createClient } from "@/app/utils/supabase/client";

const supabase = createClient();

export default function EmailStep() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const {
    formData,
    updateFormData,
    error,
    loading,
    otpSent,
    setError,
    setLoading,
    setOtpSent,
    errors,
  } = useDoctorSignupStore();
  const [localError, setLocalError] = useState("");

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthLabel = (strength: number) => {
    if (strength < 2) return { label: "Weak", color: "#dc2626" };
    if (strength < 4) return { label: "Fair", color: "#f59e0b" };
    if (strength < 5) return { label: "Good", color: "#10b981" };
    return { label: "Strong", color: "#16a34a" };
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthInfo = getPasswordStrengthLabel(passwordStrength);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value;
    updateFormData({ email });

    // Clear errors when user starts typing
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      setLocalError("Please enter a valid email address");
    } else {
      setLocalError("");
      setError("");
    }
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value;
    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters long");
    } else {
      setLocalError("");
    }
    updateFormData({ password });
  };

  const handleSendOTP = async () => {
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setLocalError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");
    setLocalError("");

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password, // Temporary password
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setError(
            "This email is already registered. Please use a different email or try signing in."
          );
        } else {
          setError(signUpError.message);
        }
      } else {
        setOtpSent(true);
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in timeout={600}>
      <Box sx={{ maxWidth: 400, mx: "auto" }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#1a1a1a",
            mb: 1,
            textAlign: "center",
          }}
        >
          Enter Your Email
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", mb: 4 }}
        >
          We'll send you a verification code to confirm your email address
        </Typography>

        {(error || localError) && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error || localError}
          </Alert>
        )}

        {otpSent && !error && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            Verification code sent to {formData.email}! Please check your email
            and proceed to the next step.
          </Alert>
        )}

        <TextField
          fullWidth
          type="email"
          label="Email Address"
          value={formData.email}
          onChange={handleEmailChange}
          required
          variant="outlined"
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email sx={{ color: "#667eea" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "&:hover fieldset": {
                borderColor: "#667eea",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#667eea",
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#667eea",
            },
          }}
          helperText="This will be your login email for the medical platform"
        />
        <Grid spacing={12}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              type={showPassword ? "text" : "password"}
              label="Password"
              value={formData.password}
              onChange={(e) => updateFormData({ password: e.target.value })}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "action.active" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleShowPassword} edge="end">
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

            {/* Password Strength Indicator */}
            {formData.password && (
              <Box
                sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}
              >
                <Box sx={{ display: "flex", gap: 0.5, flex: 1 }}>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <Box
                      key={level}
                      sx={{
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor:
                          passwordStrength >= level
                            ? strengthInfo.color
                            : "#e2e8f0",
                        transition: "background-color 0.3s ease",
                      }}
                    />
                  ))}
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: strengthInfo.color,
                    fontWeight: 600,
                    minWidth: 60,
                    textAlign: "right",
                  }}
                >
                  {strengthInfo.label}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
        {/* Confirm Password */}
        {/* <Grid item xs={12}>
          <TextField
            required
            fullWidth
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) =>
              updateFormData({ confirmPassword: e.target.value })
            }
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: "action.active" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowConfirmPassword} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
        </Grid> */}

        {!otpSent && (
          <Button
            fullWidth
            variant="contained"
            onClick={handleSendOTP}
            disabled={
              loading || !formData.email || !/\S+@\S+\.\S+/.test(formData.email)
            }
            startIcon={<Send />}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              margin: 2,
              "&:hover": {
                background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
              },
            }}
          >
            {loading ? "Sending..." : "Send Verification Code"}
          </Button>
        )}
      </Box>
    </Fade>
  );
}
