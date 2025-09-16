"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Avatar,
  Chip,
} from "@mui/material";
import { UserPlus } from "lucide-react";
import { Doctor } from "../../types/user";

interface AssignDoctorModalProps {
  open: boolean;
  onClose: () => void;
  doctors: Doctor[];
  onAssign: (doctorId: string) => void;
  currentDoctorId?: string;
}

export const AssignDoctorModal: React.FC<AssignDoctorModalProps> = ({
  open,
  onClose,
  doctors,
  onAssign,
  currentDoctorId,
}) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState(
    currentDoctorId || ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDoctorId) {
      onAssign(selectedDoctorId);
    }
  };

  const handleClose = () => {
    setSelectedDoctorId(currentDoctorId || "");
    onClose();
  };

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ bgcolor: "#2563eb", mr: 2 }}>
            <UserPlus size={20} />
          </Avatar>
          <Typography variant="h6">Assign Doctor</Typography>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Select Doctor</InputLabel>
              <Select
                value={selectedDoctorId}
                label="Select Doctor"
                onChange={(e) => setSelectedDoctorId(e.target.value)}
              >
                <MenuItem value="">
                  <em>No doctor assigned</em>
                </MenuItem>
                {doctors.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: "#059669",
                          mr: 2,
                          width: 32,
                          height: 32,
                        }}
                      >
                        {doctor.first_name.charAt(0)}
                        {doctor.last_name.charAt(0)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1">
                          Dr. {doctor.first_name} {doctor.last_name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                          {doctor.specialization} • {doctor.department}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedDoctor && (
              <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Selected Doctor Details:
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ bgcolor: "#059669", mr: 2 }}>
                    {selectedDoctor.first_name.charAt(0)}
                    {selectedDoctor.last_name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Dr. {selectedDoctor.first_name} {selectedDoctor.last_name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      {selectedDoctor.email}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip
                    label={selectedDoctor.specialization}
                    size="small"
                    sx={{ bgcolor: "#eff6ff", color: "#2563eb" }}
                  />
                  <Chip
                    label={selectedDoctor.department}
                    size="small"
                    sx={{ bgcolor: "#f0fdf4", color: "#059669" }}
                  />
                  {selectedDoctor.years_of_experience && (
                    <Chip
                      label={`${selectedDoctor.years_of_experience} years exp.`}
                      size="small"
                      sx={{ bgcolor: "#fef3c7", color: "#d97706" }}
                    />
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!selectedDoctorId}
          >
            Assign Doctor
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
