"use client";

import React from "react";
import {
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  FormHelperText,
} from "@mui/material";
import {
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  PersonOutline,
  DateRange,
} from "@mui/icons-material";
import { useDoctorSignupStore } from "@/app/store/doctorSignupStore";

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
  const { formData, errors, updateFormData } = useDoctorSignupStore();

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
            value={formData.firstName}
            onChange={(e) => updateFormData({ firstName: e.target.value })}
            // error={!!errors.firstName}
            // helperText={errors.firstName}
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
            value={formData.lastName}
            onChange={(e) => updateFormData({ lastName: e.target.value })}
            // error={!!errors.lastName}
            // helperText={errors.lastName}
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
          <FormControl fullWidth error={!!errors.languages}>
            <InputLabel>Languages</InputLabel>
            <Select
              multiple
              value={formData.languages || []}
              label="Languages"
              onChange={(e) =>
                updateFormData({ languages: e.target.value as string[] })
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
            onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              "aria-valuemax": new Date().getFullYear() - 18,

              startAdornment: (
                <InputAdornment position="start">
                  <DateRange
                    max={new Date().getFullYear() - 18}
                    sx={{ color: "action.active" }}
                  />
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
          <FormControl fullWidth error={!!errors.gender}>
            <InputLabel>Gender</InputLabel>
            <Select
              value={formData.gender}
              label="Gender"
              onChange={(e) => updateFormData({ gender: e.target.value })}
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
        </Grid>
      </Grid>
    </Box>
  );
}
