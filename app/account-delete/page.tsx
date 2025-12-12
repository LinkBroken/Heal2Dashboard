"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Alert,
  AlertTitle,
  Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HomeIcon from "@mui/icons-material/Home";

export default function AccountDeletedPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/register");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleSignUp = () => {
    router.push("/register");
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Card
          sx={{
            width: "100%",
            boxShadow: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <CheckCircleIcon
                  sx={{
                    fontSize: 80,
                    color: "#4caf50",
                  }}
                />
              </Box>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 700 }}
              >
                Account Deleted
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Your account has been permanently removed
              </Typography>
            </Box>

            <Alert severity="success" sx={{ mb: 3 }}>
              <AlertTitle>Success</AlertTitle>
              All your personal data and associated records have been securely
              deleted from our system.
            </Alert>

            <Paper
              elevation={0}
              sx={{
                backgroundColor: "#f5f5f5",
                p: 2,
                mb: 3,
                borderLeft: "4px solid #4caf50",
              }}
            >
              <Typography variant="body2" color="textSecondary" paragraph>
                <strong>What happened:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                <Typography
                  component="li"
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 1 }}
                >
                  Your profile and all personal information have been removed
                </Typography>
                <Typography
                  component="li"
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 1 }}
                >
                  All associated records have been permanently deleted
                </Typography>
                <Typography
                  component="li"
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 1 }}
                >
                  Your Google account is no longer connected to our service
                </Typography>
                <Typography
                  component="li"
                  variant="body2"
                  color="textSecondary"
                >
                  You have been signed out from all devices
                </Typography>
              </Box>
            </Paper>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Need help?</strong> If you have questions about your
                deletion, please contact our support team.
              </Typography>
            </Alert>

            <Box sx={{ mb: 3, textAlign: "center" }}>
              <Typography variant="body2" color="textSecondary">
                Redirecting in{" "}
                <Box
                  component="span"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  {countdown}
                </Box>{" "}
                seconds...
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleSignUp}
                startIcon={<HomeIcon />}
                sx={{
                  backgroundColor: "#4caf50",
                  "&:hover": {
                    backgroundColor: "#45a049",
                  },
                }}
              >
                Return to Sign In
              </Button>
            </Box>

            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ display: "block", mt: 3, textAlign: "center" }}
            >
              You can create a new account anytime if you change your mind.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
