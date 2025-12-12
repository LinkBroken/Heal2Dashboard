"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/app/utils/supabase/client";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { AlertTriangle } from "lucide-react";
import checkUser from "@/app/actions/checkUser";

export default function DeleteAccountPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [deletionPreview, setDeletionPreview] = useState<any>(null);

  const handleClose = () => setShowModal(false);

  useEffect(() => {
    isUserLogged();
    loadDeletionPreview();
  }, []);

  const isUserLogged = async () => {
    const isLogged = await checkUser();
    console.log(isLogged);
    if (isLogged) {
      setCheckingAuth(false);
    } else {
      router.push("/register");
    }
  };

  const loadDeletionPreview = async () => {
    try {
      const { data, error } = await supabase.rpc("preview_account_deletion");
      if (error) throw error;
      if (data?.success) setDeletionPreview(data.summary);
    } catch (err) {
      console.error("Failed to load preview:", err);
    }
  };

  const handleClickOpen = () => {
    setShowModal(true);
    setError("");
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") {
      setError("Please type DELETE to confirm");
      return;
    }

    setLoading(true);
    setError("");

    const { data: user } = await supabase.auth.getUser();
    console.log(user);
    try {
      const { data, error: rpcError } = await supabase.rpc(
        "delete_user_account"
      );

      if (rpcError) throw rpcError;
      if (!data.success)
        throw new Error(data.message || "Failed to delete account");

      await supabase.auth.signOut();
      router.push("/account-deleted");
    } catch (err) {
      console.log(err);
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
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        bgcolor: "grey.50",
      }}
    >
      <Card sx={{ maxWidth: 700, width: "100%" }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Box
                sx={{
                  borderRadius: "50%",
                  bgcolor: "error.light",
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AlertTriangle size={48} color="#d32f2f" />
              </Box>
            </Box>

            <Typography variant="h3" gutterBottom>
              Delete Account
            </Typography>

            {userEmail && <Chip label={userEmail} sx={{ mt: 2 }} />}
          </Box>

          {deletionPreview && (
            <Alert severity="error">
              <Typography variant="subtitle2" gutterBottom>
                <strong>The following will be permanently deleted:</strong>
              </Typography>

              <List dense>
                <ListItem disablePadding>
                  <ListItemText
                    primary={`• Your profile (${deletionPreview.role})`}
                  />
                </ListItem>

                {deletionPreview.appointments > 0 && (
                  <ListItem disablePadding>
                    <ListItemText
                      primary={`• ${deletionPreview.appointments} appointment(s)`}
                    />
                  </ListItem>
                )}

                {deletionPreview.reviews > 0 && (
                  <ListItem disablePadding>
                    <ListItemText
                      primary={`• ${deletionPreview.reviews} review(s)`}
                    />
                  </ListItem>
                )}

                {deletionPreview.notifications > 0 && (
                  <ListItem disablePadding>
                    <ListItemText
                      primary={`• ${deletionPreview.notifications} notification(s)`}
                    />
                  </ListItem>
                )}
              </List>
            </Alert>
          )}

          <Alert severity="error" sx={{ mt: 2 }}>
            <strong>Warning:</strong> This action is permanent and irreversible.
          </Alert>

          {error && <Alert severity="error">{error}</Alert>}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              color="error"
              size="large"
              onClick={handleClickOpen}
            >
              Delete My Account Permanently
            </Button>

            <Button variant="outlined" size="large" onClick={handleSignOut}>
              Sign Out Instead
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={showModal} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AlertTriangle size={24} color="#d32f2f" />
            Final Confirmation Required
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            You are about to permanently delete your account ({userEmail}). This
            action cannot be undone.
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" gutterBottom>
              Type <strong style={{ color: "#d32f2f" }}>DELETE</strong> to
              confirm:
            </Typography>

            <TextField
              fullWidth
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
              placeholder="Type DELETE"
              autoComplete="off"
              error={confirmText !== "" && confirmText !== "DELETE"}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAccount}
            disabled={loading || confirmText !== "DELETE"}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? "Deleting..." : "Delete Forever"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
