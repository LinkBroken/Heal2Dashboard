"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { createClient } from "@/app/utils/supabase/client";

export default function DeleteAccountPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const supabase = createClient();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUserEmail(user.email || "");
      setCheckingAuth(false);
    } else {
      // Redirect to login if not authenticated
      router.push("/register?redirect=/delete-account");
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
    setError("");
  };

  const handleClose = () => {
    setOpen(false);
    setConfirmText("");
    setError("");
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") {
      setError("Please type DELETE to confirm");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/delete-account", {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete account");
      }

      // Sign out and redirect
      await supabase.auth.signOut();
      router.push("/register?deleted=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/register");
  };

  if (checkingAuth) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

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
        <Card sx={{ width: "100%" }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <WarningAmberIcon
                sx={{ fontSize: 60, color: "error.main", mb: 2 }}
              />
              <Typography variant="h4" component="h1" gutterBottom>
                Delete Account
              </Typography>
            </Box>

            {userEmail && (
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Chip
                  icon={<GoogleIcon />}
                  label={userEmail}
                  variant="outlined"
                  color="primary"
                />
              </Box>
            )}

            <Typography variant="body1" color="text.secondary" paragraph>
              This action cannot be undone. Deleting your account will:
            </Typography>

            <Box component="ul" sx={{ pl: 2, mb: 3 }}>
              <Typography
                component="li"
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Permanently delete your profile and all associated data
              </Typography>
              <Typography
                component="li"
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Remove all your records from our system
              </Typography>
              <Typography
                component="li"
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Disconnect your Google account from this service
              </Typography>
              <Typography
                component="li"
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Sign you out of all devices immediately
              </Typography>
            </Box>

            <Alert severity="error" sx={{ mb: 3 }}>
              <strong>Warning:</strong> This action is permanent and
              irreversible. All your data will be lost forever.
            </Alert>

            <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
              <Button
                variant="contained"
                color="error"
                size="large"
                fullWidth
                onClick={handleClickOpen}
                startIcon={<WarningAmberIcon />}
              >
                Delete My Account Permanently
              </Button>

              <Button
                variant="outlined"
                size="large"
                fullWidth
                onClick={handleSignOut}
              >
                Sign Out Instead
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <WarningAmberIcon color="error" />
            <span>Confirm Account Deletion</span>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            You are about to permanently delete your account ({userEmail}) that
            is connected via Google.
          </DialogContentText>

          <DialogContentText sx={{ mb: 2 }}>
            This will remove all your data and cannot be undone.
          </DialogContentText>

          <DialogContentText sx={{ mb: 2, fontWeight: "bold" }}>
            Type <span style={{ color: "red" }}>DELETE</span> to confirm:
          </DialogContentText>

          <TextField
            autoFocus
            fullWidth
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
            placeholder="Type DELETE"
            disabled={loading}
            error={!!error && confirmText !== "DELETE"}
            helperText={
              confirmText && confirmText !== "DELETE"
                ? "Must type DELETE exactly"
                : ""
            }
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={loading || confirmText !== "DELETE"}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Deleting Account..." : "Delete Account Forever"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
