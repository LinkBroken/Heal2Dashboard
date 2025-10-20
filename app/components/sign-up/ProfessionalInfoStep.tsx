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
  Button,
  Avatar,
} from "@mui/material";
import { Work, School, Star, Assignment, CloudDone } from "@mui/icons-material";
import { useDoctorSignupStore } from "@/app/store/doctorSignupStore";
import { UploadCloud as CloudUploadIcon } from "lucide-react";
import styled from "@emotion/styled";
import { useFormValidation } from "@/app/store/useFormValidation";
import {
  professionalInfoSchema,
  documentFileSchema,
  imageFileSchema,
} from "@/app/utils/validation";

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

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function ProfessionalInfoStep() {
  const {
    formData,
    document: file,
    updateFormData,
    setDocument: setFile,
    profileImage,
    setProfileImage,
  } = useDoctorSignupStore();

  const { errors, validateField, setErrors } = useFormValidation(
    professionalInfoSchema
  );
  const [showOtherLicense, setShowOtherLicense] = useState(false);

  const handleFieldChange = (field: string, value: any) => {
    updateFormData({ [field]: value });
    validateField(field, value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result as string;
          console.log("Base64 result:", base64String);

          // Update form data with the full base64 string (with prefix!)
          updateFormData({ document: base64String });
          setFile(base64String);

          // Clear any previous errors
          setErrors((prev) => ({ ...prev, document: "" }));
        };

        // ✅ actually trigger the read
        reader.readAsDataURL(file);
      } catch (error: any) {
        console.log(error);
        setErrors((prev) => ({
          ...prev,
          document: error.errors?.[0]?.message || "Invalid file",
        }));
      }
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // if (e.target.files && e.target.files.length > 0) {
    //   const selectedFile = e.target.files[0];

    // Validate image
    try {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(selectedFile);
      imageFileSchema.parse(selectedFile);
      const file = new File([selectedFile], selectedFile.name, {
        type: selectedFile.type,
      });
      console.log(file);
      // Update form data
      updateFormData({ profileImage: file });

      // Clear any previous errors
      setErrors((prev) => ({ ...prev, profileImage: "" }));
    } catch (error: any) {
      console.log(error);
      setErrors((prev) => ({
        ...prev,
        profileImage: error.errors?.[0]?.message || "Invalid file",
      }));
    }
  };

  const handleLicenseChange = (value: string) => {
    if (value === "Other") {
      setShowOtherLicense(true);
      handleFieldChange("licenseNumber", "");
    } else {
      setShowOtherLicense(false);
      handleFieldChange("licenseNumber", value);
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
              value={formData.doctorType || ""}
              label="Doctor Type"
              onChange={(e) => {
                const value = e.target.value;
                handleFieldChange("doctorType", value);
                if (value === "gp") {
                  handleFieldChange("specialization", "General Practice");
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
                    onClick={() =>
                      handleFieldChange("specialization", specialization)
                    }
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
                value={
                  showOtherLicense ? "Other" : formData.licenseNumber || ""
                }
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
                value={formData.licenseNumber || ""}
                onChange={(e) =>
                  handleFieldChange("licenseNumber", e.target.value)
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
            value={formData.experience || ""}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (isNaN(value) || value <= 50) {
                handleFieldChange("experience", e.target.value);
              }
            }}
            error={!!errors.experience}
            helperText={
              errors.experience || "If more than 15 years, please enter 15"
            }
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
            label="Additional Skills"
            placeholder="Describe your medical skills, expertise, and areas of focus..."
            value={formData.skills || ""}
            onChange={(e) => handleFieldChange("skills", e.target.value)}
            error={!!errors.skills}
            helperText={errors.skills}
            multiline
            rows={3}
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

        {/* University */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="University"
            placeholder="Enter your university name..."
            value={formData.university || ""}
            onChange={(e) => handleFieldChange("university", e.target.value)}
            error={!!errors.university}
            helperText={errors.university}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
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

        {/* Join Reason */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Why heal2gether"
            placeholder="Tell us why you want to join our platform..."
            value={formData.join_reason || ""}
            onChange={(e) => handleFieldChange("join_reason", e.target.value)}
            error={!!errors.join_reason}
            helperText={errors.join_reason}
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

        {/* File Uploads */}
        <Grid
          style={{
            marginTop: "20px",
            width: "100%",
            justifyContent: "flex-end",
            display: "flex",
            gap: "20px",
            alignItems: "center",
            flexWrap: "wrap",
            flexDirection: "row-reverse",
          }}
          container
        >
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "column",
              gap: 2,
              alignSelf: "center",
            }}
          >
            <Typography
              variant="body1"
              sx={{ fontWeight: 600, color: "#1a1a1a", mb: 2 }}
            >
              Upload Your Medical License
            </Typography>
            <CloudDone style={{ width: 100, height: 100, color: "#94a3b8" }} />
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{
                background: file
                  ? "linear-gradient(135deg, #16a34a 0%, #15803d 100%)"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background: file
                    ? "linear-gradient(135deg, #15803d 0%, #166534 100%)"
                    : "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                },
              }}
            >
              {file ? "File uploaded" : "Upload file"}
              <VisuallyHiddenInput
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                required
              />
            </Button>
            {errors.document && (
              <FormHelperText error sx={{ textAlign: "center" }}>
                {errors.document}
              </FormHelperText>
            )}
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                color: "#1a1a1a",
                mb: 2,
              }}
            >
              Upload Your Profile Image
            </Typography>
            <Avatar
              src={profileImage ? profileImage.toString() : ""}
              sx={{ width: 100, height: 100 }}
            />
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{
                background: profileImage
                  ? "linear-gradient(135deg, #16a34a 0%, #15803d 100%)"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background: profileImage
                    ? "linear-gradient(135deg, #15803d 0%, #166534 100%)"
                    : "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                },
              }}
            >
              {profileImage ? "Image uploaded" : "Upload image"}
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                required
              />
            </Button>
            {errors.profileImage && (
              <FormHelperText error sx={{ textAlign: "center" }}>
                {errors.profileImage}
              </FormHelperText>
            )}
          </Grid>
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
                  checked={formData.acceptedTerms || false}
                  onChange={(e) =>
                    handleFieldChange("acceptedTerms", e.target.checked)
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
                    href={`/register/terms`}
                    sx={{ color: "#16a34a", fontWeight: 600 }}
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/register/terms"
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
