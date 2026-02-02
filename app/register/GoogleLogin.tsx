"use client";

import { useTransition } from "react";
import { googleLoginAction } from "../actions/loginWithGoogle";
import { Button } from "@mui/material";
import { Google } from "@mui/icons-material";

export default function GoogleButton() {
  const [isPending, startTransition] = useTransition();

  const handleGoogleLogin = () => {
    startTransition(async () => {
      try {
        const url = await googleLoginAction();
        if (url) {
          window.location.href = url;
        }
      } catch (error) {
        console.error("Google login error:", error);
      }
    });
  };

  return (
    <Button
      fullWidth
      variant="outlined"
      startIcon={<Google />}
      onClick={handleGoogleLogin}
      disabled={isPending}
      sx={{
        mt: 2,
        py: 1.5,
        borderRadius: 2,
        color: "#1a1a1a",
        borderColor: "#e2e8f0",
        textTransform: "none",
        fontSize: "1rem",
        fontWeight: 500,
        "&:hover": {
          backgroundColor: "#f8fafc",
          borderColor: "#cbd5e1",
        },
      }}
    >
      {isPending ? "Connecting..." : "Continue with Google"}
    </Button>
  );
}
