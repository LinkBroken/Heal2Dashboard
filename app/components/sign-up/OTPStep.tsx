import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Alert, Fade, Button, TextField } from "@mui/material";
import { VerifiedUser, Refresh } from "@mui/icons-material";
import { useDoctorSignupStore } from "../../store/doctorSignupStore";
import supabase from "@/app/utils/supabase/client";

export default function OTPStep() {
  const {
    formData,
    error,
    loading,
    setError,
    setLoading,
    setEmailVerified,
    setSession,
    session,
  } = useDoctorSignupStore();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus on first input when component mounts
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter the complete 6-digit verification code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data: session, error: verifyError } =
        await supabase.auth.verifyOtp({
          email: formData.email,
          token: otpValue,
          type: "signup",
        });
      console.log(session);

      if (verifyError) {
        setError(verifyError.message);
      } else {
        setEmailVerified(true);
        setSession(session.session);

        // The user will automatically proceed to next step via the parent component
      }
    } catch (err: any) {
      console.log(session, err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError("");

    try {
      const { error: resendError } = await supabase.auth.resend({
        email: formData.email,
        type: "signup",
      });

      if (resendError) {
        setError(resendError.message);
      } else {
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (err: any) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setResendLoading(false);
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
          Verify Your Email
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", mb: 4 }}
        >
          Enter the 6-digit verification code sent to{" "}
          <strong>{formData.email}</strong>
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 4 }}>
          {otp.map((digit, index) => (
            <TextField
              key={index}
              inputRef={(el) => (inputRefs.current[index] = el)}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              inputProps={{
                maxLength: 1,
                style: {
                  textAlign: "center",
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  padding: "16px 0",
                },
              }}
              sx={{
                width: 56,
                height: 64,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#667eea",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                    borderWidth: 2,
                  },
                },
              }}
            />
          ))}
        </Box>

        <Button
          fullWidth
          variant="contained"
          onClick={handleVerifyOTP}
          disabled={loading || otp.some((digit) => !digit)}
          startIcon={<VerifiedUser />}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 600,
            mb: 2,
            "&:hover": {
              background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
            },
          }}
        >
          {loading ? "Verifying..." : "Verify Code"}
        </Button>

        <Button
          fullWidth
          variant="text"
          onClick={handleResendOTP}
          disabled={resendLoading}
          startIcon={<Refresh />}
          sx={{
            color: "#667eea",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(102, 126, 234, 0.04)",
            },
          }}
        >
          {resendLoading ? "Resending..." : "Resend Code"}
        </Button>
      </Box>
    </Fade>
  );
}
