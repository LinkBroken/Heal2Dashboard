"use client";

import React from "react";
import {
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  FormHelperText,
  ListItemText,
  Checkbox,
} from "@mui/material";
import { Person, PersonOutline, DateRange } from "@mui/icons-material";
import { useDoctorSignupStore } from "@/app/store/doctorSignupStore";
import { useFormValidation } from "@/app/store/useFormValidation";
import { basicInfoSchema } from "@/app/utils/validation";
import { countryPhoneLengths } from "./CONSTANTS";

const GENDERS = ["Male", "Female"];

const LANGUAGES = [
  "Arabic",
  "English",
  "Tigre",
  "Saho",
  "Hidareb",
  "Kunama",
  "Bilen",
  "Tigrinya",
  "Afar",
  "Nara",
  "Other",
];

export default function BasicInfoStep() {
  const { formData, updateFormData } = useDoctorSignupStore();
  const { errors, validateField } = useFormValidation(basicInfoSchema);

  const handleFieldChange = (field: string, value: any) => {
    updateFormData({ [field]: value });
    validateField(field, value);
  };

  return (
    <Box>
      <Typography
        variant="h5"
        component="h2"
        sx={{
          fontWeight: 600,
          color: "#1a1a1a",
          mb: 1,
          textAlign: "center",
        }}
      >
        Basic Information
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, textAlign: "center" }}
      >
        Let's start with your basic details
      </Typography>

      <Grid container spacing={3}>
        {/* Name Fields */}
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="First Name"
            value={formData.firstName || ""}
            onChange={(e) => handleFieldChange("firstName", e.target.value)}
            error={!!errors.firstName}
            helperText={errors.firstName}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: "action.active" }} />
                </InputAdornment>
              ),
            }}
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
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Last Name"
            value={formData.lastName || ""}
            onChange={(e) => handleFieldChange("lastName", e.target.value)}
            error={!!errors.lastName}
            helperText={errors.lastName}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutline sx={{ color: "action.active" }} />
                </InputAdornment>
              ),
            }}
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
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl
            style={{ minWidth: "120px" }}
            fullWidth
            error={!!errors.languages}
          >
            <InputLabel>Languages</InputLabel>
            <Select
              multiple
              value={formData.languages || []}
              label="Languages"
              onChange={(e) =>
                handleFieldChange("languages", e.target.value as string[])
              }
              renderValue={(selected) => (selected as string[]).join(", ")}
              sx={{
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#667eea",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#667eea",
                },
              }}
            >
              {LANGUAGES.map((language) => (
                <MenuItem key={language} value={language}>
                  {language}
                </MenuItem>
              ))}
            </Select>
            {errors.languages && (
              <FormHelperText>{errors.languages}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            type="date"
            label="Date of Birth"
            value={formData.dateOfBirth || ""}
            onChange={(e) => handleFieldChange("dateOfBirth", e.target.value)}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              inputProps: {
                max: new Date(
                  new Date().setFullYear(new Date().getFullYear() - 18)
                )
                  .toISOString()
                  .split("T")[0],
              },
              startAdornment: (
                <InputAdornment position="start">
                  <DateRange sx={{ color: "action.active" }} />
                </InputAdornment>
              ),
            }}
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
            }}
          />
        </Grid>

        {/* Gender */}
        <Grid item xs={12} sm={6}>
          <FormControl
            style={{ width: "120px" }}
            fullWidth
            error={!!errors.gender}
          >
            <InputLabel>Gender</InputLabel>
            <Select
              value={formData.gender || ""}
              label="Gender"
              onChange={(e) => handleFieldChange("gender", e.target.value)}
              sx={{
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#667eea",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#667eea",
                },
              }}
            >
              {GENDERS.map((gender) => (
                <MenuItem key={gender} value={gender}>
                  {gender}
                </MenuItem>
              ))}
            </Select>
            {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
          </FormControl>
          {/* Countries Multi-select */}
        </Grid>
      </Grid>
      <Grid
        xs={12}
        sm={6}
        sx={{
          mt: 3,
        }}
      >
        <FormControl fullWidth error={!!errors.allowedCountries}>
          <InputLabel>Which Countries You want your patients from</InputLabel>
          <Select
            multiple
            value={formData.allowedCountries || []}
            label="Your Patients' Country"
            onChange={(e) => {
              const value = e.target.value as string[];
              if (value.includes("all")) {
                if ((formData.allowedCountries || []).length === countryPhoneLengths.length) {
                  // Deselect all
                  handleFieldChange("allowedCountries", []);
                } else {
                  // Select all
                  handleFieldChange(
                    "allowedCountries",
                    countryPhoneLengths.map((c) => c.code)
                  );
                }
              } else {
                handleFieldChange("allowedCountries", value);
              }
            }}
            renderValue={(selected) =>
              countryPhoneLengths
                .filter((c) => (selected as string[]).includes(c.code))
                .map((c) => c.name)
                .join(", ")
            }
            sx={{
              borderRadius: 2,
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#667eea",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#667eea",
              },
            }}
          >
            <MenuItem value="all">
              <Checkbox
                checked={
                  (formData.allowedCountries || []).length ===
                  countryPhoneLengths.length
                }
                indeterminate={
                  (formData.allowedCountries || []).length > 0 &&
                  (formData.allowedCountries || []).length <
                  countryPhoneLengths.length
                }
              />
              <ListItemText primary="Select All" />
            </MenuItem>
            {countryPhoneLengths.map((country) => (
              <MenuItem key={country.code} value={country.code}>
                <Checkbox
                  checked={(formData.allowedCountries || []).includes(
                    country.code
                  )}
                />
                <ListItemText
                  primary={`${country.name} (${country.dial_code})`}
                />
              </MenuItem>
            ))}
          </Select>
          {errors.allowedCountries && (
            <FormHelperText>{errors.allowedCountries}</FormHelperText>
          )}
        </FormControl>
      </Grid>
    </Box>
  );
}
