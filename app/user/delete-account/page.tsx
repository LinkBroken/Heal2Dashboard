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
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import { AlertTriangle } from "lucide-react";

export default function DeleteAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");
  const [deletionPreview, setDeletionPreview] = useState<any>(null);

  // ✅ Check user on load
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        await loadDeletionPreview();
      }
      setCheckingAuth(false);
    };

    checkAuth();
  }, []);

  // ✅ Load deletion preview from Supabase RPC
  const loadDeletionPreview = async () => {
    try {
      const { data, error } = await supabase.rpc("preview_account_deletion");
      if (error) throw error;
      if (data?.success) setDeletionPreview(data.summary);
    } catch (err) {
      console.error("Failed to load preview:", err);
    }
  };

  // ✅ Google Sign-In
  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/user/delete-account`,
      },
    });
  };

  // ✅ Delete account
  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") {
      setError("Please type DELETE to confirm");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data: userCheck } = await supabase.auth.getUser();
      if (!userCheck.user) throw new Error("Unauthorized");

      const { data, error: rpcError } = await supabase.rpc(
        "delete_user_account"
      );

      if (rpcError) throw rpcError;
      if (!data.success)
        throw new Error(data.message || "Failed to delete account");

      await supabase.auth.signOut();
      router.push("/account-deleted");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  // ✅ Sign out instead
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // 🔄 Show loader while checking auth
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

            {user?.email && <Chip label={user.email} sx={{ mt: 2 }} />}
          </Box>

          {!user ? (
            // 🔓 Not logged in → show Google sign-in
            <Box sx={{ textAlign: "center" }}>
              <Alert severity="warning" sx={{ mb: 3 }}>
                To permanently delete your account, please sign in to verify
                ownership.
              </Alert>

              <Button
                variant="contained"
                color="error"
                size="large"
                onClick={handleGoogleSignIn}
              >
                Sign in with Google
              </Button>
            </Box>
          ) : (
            // 🔐 Logged in → show deletion UI
            <>
              {deletionPreview && (
                <Alert severity="error" sx={{ mb: 2 }}>
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

              <Alert severity="error" sx={{ mb: 2 }}>
                <strong>Warning:</strong> This action is permanent and
                irreversible.
              </Alert>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Type DELETE to confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                placeholder="DELETE"
                autoComplete="off"
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  variant="contained"
                  color="error"
                  size="large"
                  onClick={handleDeleteAccount}
                  disabled={loading || confirmText !== "DELETE"}
                >
                  {loading ? "Deleting..." : "Delete My Account Permanently"}
                </Button>

                <Button variant="outlined" size="large" onClick={handleSignOut}>
                  Sign Out Instead
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
