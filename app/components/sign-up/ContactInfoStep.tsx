import React from "react";
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
import { useDoctorSignupStore } from "../../store/doctorSignupStore";
import { countryPhoneLengths as countries } from "./countries";

export default function ContactInfoStep() {
  const { formData, updateFormData, errors } = useDoctorSignupStore();
  const [selectedCountryLength, setSelectedCountryLength] = React.useState(
    countries[0].phoneLength
  );

  console.log(selectedCountryLength);
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
            <FormControl fullWidth>
              <InputLabel>Country</InputLabel>
              <Select
                value={formData.countryCode}
                defaultValue={countries[0].dial_code}
                onChange={(e) => {
                  console.log(e.target.value);
                  const country = countries.find(
                    (c) => c.dial_code === e.target.value
                  );
                  setSelectedCountryLength(country?.phoneLength || 10);
                  updateFormData({ countryCode: e.target.value });
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
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => {
                if (
                  e.target.value.replace(/[^0-9]/g, "").length <=
                  (Array.isArray(selectedCountryLength)
                    ? selectedCountryLength[-1]
                    : selectedCountryLength)
                ) {
                  updateFormData({
                    phone: e.target.value.replace(/[^0-9]/g, ""),
                  });
                }

                errors.phone = `Invalid Phone number from ${
                  formData.countryCode ? formData.countryCode : "this country"
                } your phone number must be ${selectedCountryLength} characters long`;
              }}
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
              slotProps={{
                htmlInput: {
                  minLength: 5,
                  maxLength: selectedCountryLength,
                },
              }}
            />
            {errors.phone && (
              <FormHelperText error sx={{ mx: 0 }}>
                {errors.phone}
              </FormHelperText>
            )}
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
          {/* <Grid item xs={12} sm={6}>
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
          </Grid>*/}
        </Grid>
      </Box>
    </Fade>
  );
}
