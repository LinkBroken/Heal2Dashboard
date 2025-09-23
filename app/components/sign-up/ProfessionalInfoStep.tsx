"use client";

import React, { useState } from "react";
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
  Chip,
  FormControlLabel,
  Checkbox,
  Link,
  Paper,
  Alert,
} from "@mui/material";
import {
  Work,
  School,
  Star,
  Assignment,
  LocalHospital,
} from "@mui/icons-material";
import { useDoctorSignupStore } from "@/app/store/doctorSignupStore";

const SPECIALIZATIONS = [
  "General Practice",
  "Cardiology",
  "Dermatology",
  "Emergency Medicine",
  "Endocrinology",
  "Gastroenterology",
  "Neurology",
  "Oncology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Radiology",
  "Surgery",
  "Ophthalmology",
  "Obstetrics & Gynecology",
  "Otolaryngology (ENT)",
  "Urology",
  "Dentistry",
];

const LICENSE_PROGRAMS = [
  "United States Medical Licensing Examination (USMLE)",
  "Medical Licensing Assessment (MLA)",
  "Educational Commission for Foreign Medical Graduates (ECFMG)",
  "Licentiate of the Medical Council of Canada (LMCC)",
  "General Medical Council (GMC) - UK",
  "Australian Medical Council (AMC)",
  "Medical Council of India (MCI)",
  "Other",
];

export default function ProfessionalInfoStep() {
  const { formData, errors, updateFormData } = useDoctorSignupStore();

  const [showOtherLicense, setShowOtherLicense] = useState(false);

  const handleLicenseChange = (value: string) => {
    if (value === "Other") {
      setShowOtherLicense(true);
      updateFormData({ licenseNumber: "" });
    } else {
      setShowOtherLicense(false);
      updateFormData({ licenseNumber: value });
    }
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
        Professional Information
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, textAlign: "center" }}
      >
        Tell us about your medical expertise and qualifications
      </Typography>

      <Grid container spacing={3}>
        {/* Doctor Type */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.doctorType}>
            <InputLabel>Doctor Type</InputLabel>
            <Select
              value={formData.doctorType}
              label="Doctor Type"
              onChange={(e) => {
                updateFormData({ doctorType: e.target.value });
                if (e.target.value === "gp") {
                  updateFormData({ specialization: "General Practice" });
                }
              }}
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
              <MenuItem value="specialist">Specialist</MenuItem>
              <MenuItem value="gp">General Practitioner</MenuItem>
            </Select>
            {errors.doctorType && (
              <FormHelperText>{errors.doctorType}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* Specialization - Only show for specialists */}
        {formData.doctorType === "specialist" && (
          <Grid item xs={12}>
            <Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: "#1a1a1a",
                  mb: 2,
                }}
              >
                Medical Specialization *
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {SPECIALIZATIONS.filter(
                  (spec) => spec !== "General Practice"
                ).map((specialization) => (
                  <Chip
                    key={specialization}
                    label={specialization}
                    onClick={() => updateFormData({ specialization })}
                    color={
                      formData.specialization === specialization
                        ? "primary"
                        : "default"
                    }
                    variant={
                      formData.specialization === specialization
                        ? "filled"
                        : "outlined"
                    }
                    sx={{
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor:
                          formData.specialization === specialization
                            ? "primary.dark"
                            : "rgba(102, 126, 234, 0.08)",
                      },
                    }}
                  />
                ))}
              </Box>
              {errors.specialization && (
                <FormHelperText error sx={{ mx: 0 }}>
                  {errors.specialization}
                </FormHelperText>
              )}
            </Box>
          </Grid>
        )}

        {/* License Program - Only show for specialists */}
        {formData.doctorType === "specialist" && (
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.licenseNumber}>
              <InputLabel>Medical License Program</InputLabel>
              <Select
                value={showOtherLicense ? "Other" : formData.licenseNumber}
                label="Medical License Program"
                onChange={(e) => handleLicenseChange(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <School sx={{ color: "action.active" }} />
                  </InputAdornment>
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
                {LICENSE_PROGRAMS.map((program) => (
                  <MenuItem key={program} value={program}>
                    {program}
                  </MenuItem>
                ))}
              </Select>
              {errors.licenseNumber && (
                <FormHelperText>{errors.licenseNumber}</FormHelperText>
              )}
            </FormControl>

            {showOtherLicense && (
              <TextField
                fullWidth
                label="Enter Your License Program"
                value={formData.licenseNumber}
                onChange={(e) =>
                  updateFormData({ licenseNumber: e.target.value })
                }
                error={!!errors.licenseNumber}
                helperText={errors.licenseNumber}
                sx={{
                  mt: 2,
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
            )}
          </Grid>
        )}

        {/* Years of Experience */}
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            type="number"
            label="Years of Experience"
            value={formData.experience}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value <= 50) {
                updateFormData({ experience: e.target.value });
              }
            }}
            error={!!errors.yearsOfExperience}
            helperText={errors.yearsOfExperience || "Maximum 50 years"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Star sx={{ color: "action.active" }} />
                </InputAdornment>
              ),
              inputProps: { min: 0, max: 50 },
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

        {/* Skills */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Skills & Expertise"
            placeholder="Describe your medical skills, expertise, and areas of focus..."
            value={formData.skills}
            onChange={(e) => updateFormData({ skills: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{ alignSelf: "flex-start", mt: 1 }}
                >
                  <Assignment sx={{ color: "action.active" }} />
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

        {/* Terms and Conditions */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              backgroundColor: "#f0fdf4",
              border: "1px solid #16a34a",
              borderRadius: 2,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.acceptedTerms}
                  onChange={(e) =>
                    updateFormData({ acceptedTerms: e.target.checked })
                  }
                  sx={{
                    color: errors.acceptedTerms ? "#d32f2f" : "#16a34a",
                    "&.Mui-checked": {
                      color: "#16a34a",
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    sx={{ color: "#16a34a", fontWeight: 600 }}
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    sx={{ color: "#16a34a", fontWeight: 600 }}
                  >
                    Privacy Policy
                  </Link>
                </Typography>
              }
            />
            {errors.acceptedTerms && (
              <FormHelperText error sx={{ ml: 0, mt: 1 }}>
                {errors.acceptedTerms}
              </FormHelperText>
            )}
          </Paper>
        </Grid>

        {/* Professional Notice */}

        <Grid item xs={12}>
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            <Typography variant="body2">
              <strong>Professional Verification:</strong> Your medical
              credentials will be verified before your account is activated.
              This process typically takes 1-3 business days. You'll receive an
              email notification once verification is complete.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
}
