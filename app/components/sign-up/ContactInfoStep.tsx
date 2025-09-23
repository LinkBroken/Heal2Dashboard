import React from "react";
import { Box, TextField, Typography, Grid, Fade } from "@mui/material";
import { useDoctorSignupStore } from "../../store/doctorSignupStore";

export default function ContactInfoStep() {
  const { formData, updateFormData } = useDoctorSignupStore();

  return (
    <Fade in timeout={600}>
      <Box sx={{ maxWidth: 500, mx: "auto" }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#1a1a1a",
            mb: 1,
            textAlign: "center",
          }}
        >
          Contact Information
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", mb: 4 }}
        >
          Please provide your contact and address information
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => updateFormData({ phone: e.target.value })}
              required
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
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#667eea",
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              value={formData.address}
              onChange={(e) => updateFormData({ address: e.target.value })}
              required
              multiline
              rows={2}
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
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#667eea",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              value={formData.city}
              onChange={(e) => updateFormData({ city: e.target.value })}
              required
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
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#667eea",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="State"
              value={formData.state}
              onChange={(e) => updateFormData({ state: e.target.value })}
              required
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
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#667eea",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="ZIP Code"
              value={formData.zipCode}
              onChange={(e) => updateFormData({ zipCode: e.target.value })}
              required
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
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#667eea",
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
}
