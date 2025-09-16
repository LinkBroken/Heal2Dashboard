"use client";

import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Grid,
  Divider,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { X, Save } from "lucide-react";
import { PatientWithProfile } from "@/app/types";

interface UserEditDrawerProps {
  open: boolean;
  onClose: () => void;
  user: PatientWithProfile;
  onSave: (updates: Partial<PatientWithProfile>) => void;
}

export const UserEditDrawer: React.FC<UserEditDrawerProps> = ({
  open,
  onClose,
  user,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<PatientWithProfile>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email || "",
        phone: user.phone || "",
        date_of_birth: user.date_of_birth || "",
        gender: user.gender || "other",
        blood_type: user.blood_type || null,
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (
    field: keyof PatientWithProfile,
    value: string | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 500,
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
            Edit Patient Profile
          </Typography>
          <IconButton onClick={onClose} size="small">
            <X size={20} />
          </IconButton>
        </Box>

        {/* Form */}
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
          <Stack spacing={3}>
            {/* Personal Information */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Personal Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={formData.first_name || ""}
                    onChange={(e) => handleChange("first_name", e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={formData.last_name || ""}
                    onChange={(e) => handleChange("last_name", e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={formData.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    value={formData.date_of_birth || ""}
                    onChange={(e) =>
                      handleChange("date_of_birth", e.target.value)
                    }
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Medical Information */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Medical Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={formData.gender || ""}
                      label="Gender"
                      onChange={(e) =>
                        handleChange("gender", e.target.value as any)
                      }
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Blood Type</InputLabel>
                    <Select
                      value={formData.blood_type || ""}
                      label="Blood Type"
                      onChange={(e) =>
                        handleChange("blood_type", e.target.value as any)
                      }
                    >
                      <MenuItem value="">Not specified</MenuItem>
                      <MenuItem value="A+">A+</MenuItem>
                      <MenuItem value="A-">A-</MenuItem>
                      <MenuItem value="B+">B+</MenuItem>
                      <MenuItem value="B-">B-</MenuItem>
                      <MenuItem value="AB+">AB+</MenuItem>
                      <MenuItem value="AB-">AB-</MenuItem>
                      <MenuItem value="O+">O+</MenuItem>
                      <MenuItem value="O-">O-</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Address Information */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Address Information
              </Typography>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={3}
                value={formData.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
                size="small"
              />
            </Box>
          </Stack>
        </Box>

        {/* Actions */}
        <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid #e2e8f0" }}>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSave}
              startIcon={<Save size={16} />}
            >
              Save Changes
            </Button>
            <Button variant="outlined" fullWidth onClick={onClose}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
};
