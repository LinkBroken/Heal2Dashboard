"use client";

import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { X, Mail, Shield, Calendar, Edit2, Save } from "lucide-react";
import { DoctorProfile, User } from "@/app/types";
import { createClient } from "@/app/utils/supabase/client";

interface UserDrawerProps {
  open: boolean;
  onClose: () => void;
  user: DoctorProfile | null;
  onSave: (user: DoctorProfile) => void;
  loading: boolean;
}

export const UserDrawer: React.FC<UserDrawerProps> = ({
  open,
  onClose,
  user,
  onSave,
  loading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<DoctorProfile | null>(null);

  React.useEffect(() => {
    if (user) {
      setEditedUser({ ...user, status: user.status });
    }
  }, [user]);

  if (!user || !editedUser) return null;

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "administrator":
        return "#dc2626";
      case "manager":
        return "#d97706";
      case "user":
        return "#059669";
      default:
        return "#64748b";
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 400,
          maxWidth: "90vw",
        },
      }}
    >
      <Box
        sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {isEditing ? "Edit User" : "User Details"}
          </Typography>
          <Box>
            {open && (
              <IconButton
                onClick={() => setIsEditing(true)}
                size="small"
                sx={{ mr: 1 }}
              >
                <Edit2 size={20} />
              </IconButton>
            )}
            <IconButton onClick={onClose} size="small">
              <X size={20} />
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ flexGrow: 1 }}>
          {/* Avatar and Basic Info */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                mr: 2,
                bgcolor: "#2563eb",
                fontSize: "1.5rem",
              }}
            ></Avatar>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Stack>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Calendar size={16} style={{ marginRight: 8 }} />
                Account Status
              </Typography>
              <Chip
                label={
                  user.status.charAt(0).toUpperCase() + user.status.slice(1)
                }
                size="small"
                sx={{
                  backgroundColor:
                    user.status === "approved" ? "#d1fae515" : "#fef3c7",
                  color: user.status === "approved" ? "#059669" : "#dc2626",
                  fontWeight: 500,
                }}
              />
              <Divider sx={{ my: 3 }} />
              {isEditing ? (
                <FormControl fullWidth size="small">
                  <Select
                    value={editedUser.status}
                    onChange={(e) =>
                      setEditedUser({
                        ...user,
                        status: e.target.value ?? user.status,
                      })
                    }
                  >
                    <MenuItem value="approved">Approve</MenuItem>
                    <MenuItem value="suspended">Suspend</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <Typography variant="body1" sx={{ color: "#1e293b" }}>
                  {user.status === "approved"
                    ? "Approved"
                    : user.status === "suspended"
                    ? "Suspended"
                    : "Pending"}{" "}
                </Typography>
              )}
            </Box>
          </Stack>
        </Box>

        {/* Actions */}
        <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid #e2e8f0" }}>
          <Stack spacing={2}>
            {isEditing ? (
              <>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() =>
                    onSave({ ...editedUser, status: editedUser.status })
                  }
                  startIcon={<Save size={16} />}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    setIsEditing(false);
                    setEditedUser({ ...user, status: user.status });
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setIsEditing(true)}
                  startIcon={<Edit2 size={16} />}
                >
                  Edit User
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
};
