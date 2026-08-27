"use client";

import React, { useEffect, useMemo } from "react";
import {
  Box,
  TextField,
  Typography,
  Grid,
  Fade,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { useDoctorSignupStore } from "@/app/store/doctorSignupStore";
import { getSupportedCountries } from "@/app/utils/phoneUtils";
import { useFormValidation } from "@/app/store/useFormValidation";
import { contactInfoSchema } from "@/app/utils/validation";

export default function ContactInfoStep() {
  const { formData, updateFormData, setIsPhoneNumbeValid } =
    useDoctorSignupStore();
  const { errors, validateField } = useFormValidation(contactInfoSchema);
  const [selectedCountryCode, setSelectedCountryCode] = React.useState("");


  // Memoize countries list to avoid recalculation on every render
  const countries = useMemo(() => getSupportedCountries(), []);

  // Initialize with first country on mount
  useEffect(() => {
    if (countries.length > 0 && !selectedCountryCode) {
      const firstCountry = countries[0];
      setSelectedCountryCode(firstCountry.code);

    }
  }, [countries, selectedCountryCode]);

  const handleFieldChange = (field: string, value: any) => {
    updateFormData({ [field]: value });
    validateField(field, value);
  };

  const handleCountryChange = (dialCode: string) => {
    const country = countries.find((c) => c.dial_code === dialCode);
    if (country) {
      setSelectedCountryCode(country.code);

      setIsPhoneNumbeValid(false);
      handleFieldChange("countryCode", dialCode);
    }
  };

  const handlePhoneChange = (value: string) => {
    // Only allow digits
    const digits = value.replace(/[^0-9]/g, "");

    handleFieldChange("phone", digits);

    setIsPhoneNumbeValid(digits.length > 0);
  };

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
          <Grid item xs={12} md={4}>
            <FormControl required fullWidth error={!!errors.countryCode}>
              <InputLabel>Country</InputLabel>
              <Select
                required
                value={formData.countryCode || ""}
                onChange={(e) => handleCountryChange(e.target.value)}
                sx={{
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "#667eea" },
                    "&.Mui-focused fieldset": { borderColor: "#667eea" },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#667eea",
                  },
                }}
              >
                {countries.map((c) => (
                  <MenuItem key={c.code} value={c.dial_code}>
                    {c.name} ({c.dial_code})
                  </MenuItem>
                ))}
              </Select>
              {errors.countryCode && (
                <FormHelperText>{errors.countryCode}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phone || ""}
              onChange={(e) => handlePhoneChange(e.target.value)}
              required
              helperText={errors.phone}
              error={!!errors.phone}
              placeholder="Enter digits only"
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
              value={formData.address || ""}
              onChange={(e) => handleFieldChange("address", e.target.value)}
              required
              multiline
              rows={2}
              error={!!errors.address}
              helperText={errors.address}
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
