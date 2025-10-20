"use client";

import React, { useEffect } from "react";
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
import { countryPhoneLengths as countries } from "./countries";
import { useFormValidation } from "@/app/store/useFormValidation";
import { contactInfoSchema } from "@/app/utils/validation";

export default function ContactInfoStep() {
  const { formData, updateFormData, setIsPhoneNumbeValid } =
    useDoctorSignupStore();
  const { errors, validateField } = useFormValidation(contactInfoSchema);
  const [selectedCountryLength, setSelectedCountryLength] = React.useState(
    countries[0].phoneLength
  );

  const handleFieldChange = (field: string, value: any) => {
    updateFormData({ [field]: value });
    validateField(field, value);
  };

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/[^0-9]/g, "");
    const maxLen = Array.isArray(selectedCountryLength)
      ? selectedCountryLength[selectedCountryLength.length - 1]
      : selectedCountryLength;

    // Only allow up to maxLen digits
    const truncatedDigits = digits.slice(0, maxLen);

    handleFieldChange("phone", truncatedDigits);

    // Validate phone length
    if (truncatedDigits.length === 0) {
      setIsPhoneNumbeValid(false);
    } else if (Array.isArray(selectedCountryLength)) {
      // Check if length matches any of the valid lengths
      setIsPhoneNumbeValid(
        selectedCountryLength.includes(truncatedDigits.length)
      );
    } else {
      // Check if length matches the single valid length
      setIsPhoneNumbeValid(truncatedDigits.length === selectedCountryLength);
    }
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
                onChange={(e) => {
                  const country = countries.find(
                    (c) => c.dial_code === e.target.value
                  );
                  setSelectedCountryLength(country?.phoneLength || 10);
                  handleFieldChange("countryCode", e.target.value);
                }}
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
                  <MenuItem key={c.name} value={c.dial_code}>
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
              slotProps={{
                htmlInput: {
                  minLength: 5,
                  maxLength: selectedCountryLength,
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
