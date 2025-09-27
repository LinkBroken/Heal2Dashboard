"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
} from "@mui/material";
import { useDoctorSignupStore } from "../store/doctorSignupStore";
import EmailStep from "@/app/components/sign-up/EmailStep";
import OTPStep from "@/app/components/sign-up/OTPStep";
import BasicInfoStep from "@/app/components/sign-up/BasicInfoContact";
import ContactInfoStep from "@/app/components/sign-up/ContactInfoStep";
import ProfessionalInfoStep from "@/app/components/sign-up/ProfessionalInfoStep";
import {
  CheckCircle,
  ArrowBack,
  ArrowForward,
  PersonAdd,
} from "@mui/icons-material";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  UploadDoctorCertificate,
  uploadDoctorProfile,
} from "../actions/uploadProfile";
import { useFormValidation } from "../store/useFormValidation";
import router from "next/router";
import AlreadyRegistered from "./AlreadyRegistered";
import RegistrationSuccessModal from "../components/sign-up/SuccessModal";

const steps = [
  "Email Verification",
  "Confirm Code",
  "Basic Information",
  "Contact & Personal",
  "Professional Details",
];

export default function DoctorSignupPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "left"
  );
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  useEffect(() => {
    async function getSupabase() {
      const supabase = await createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const {
        data: { user },
      } = await supabase.auth.getUser(session?.access_token ?? "");
      console.log(user);
    }
    getSupabase();
  }, []);
  const {
    currentStep,
    loading,
    validateStep,
    isEmailVerified,
    setCurrentStep,
    setLoading,
    formData,
    resetForm,
    session,

    profileImage,
    document,
  } = useDoctorSignupStore();
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setSlideDirection("left");
      setCurrentStep(Math.min(currentStep + 1, 5));
    }
  };

  const handleBack = () => {
    setSlideDirection("right");
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleSubmit = async () => {
    console.log(currentStep);
    // if (!validateStep(currentStep)) return;
    if (!validateStep(currentStep)) {
      alert("Please fix the wrong fields");
      return;
    }
    setLoading(true);
    const supabase = new SupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        },
      }
    );
    console.log(supabase);
    try {
      // Simulate API call to save doctor data to your database
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(supabase);
      const {
        data: { user },
      } = await supabase.auth.getUser(session?.access_token ?? "");

      console.log(user);
      console.log("Doctor registration data:", formData);
      const profileData = {
        id: user?.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: "doctor",
        status: "pending",
        languages: formData.languages,
      };
      const { error } = await supabase
        .from("profiles")
        .insert(profileData)
        .eq("id", user?.id);

      console.log(error?.code);
      if (error?.code) {
        console.error("Registration error:", error);
        alert("Registration failed. Please try again.");
        return;
      }
      try {
        const doctorData = {
          id: user?.id,
          name: `${formData.firstName} ${formData.lastName}`,
          specialty: formData.specialization || "General",
          doctor_type: formData.doctorType,
          location: formData.address,
          phone: `${
            formData.countryCode ? formData.countryCode.replace("+", "00") : ""
          }${formData.phone}`,
          email: user?.email,
          date_of_birth: formData.dateOfBirth,
          rating: 0,
          experience: formData.experience,
          address: formData.address,
          status: "pending",
          license_number: formData.licenseNumber,
          gender: formData.gender?.toLowerCase(),
          profile_id: user?.id,
          skills: formData.skills,
          emergency_number: formData.emergencyNumber,
          join_reason: formData.join_reason,
          university: formData.university,
        };

        const { data, error: doctorError } = await supabase
          .from("doctors")
          .insert([doctorData])
          .eq("id", user?.id);

        console.log(doctorError);
        if (doctorError) {
          console.error("Registration error:", doctorError);
          alert("Registration failed. Please try again.");
          return;
        }

        if (document) {
          await UploadDoctorCertificate({
            document: document,
            userId: user?.id ?? "",
          });
        }

        if (profileImage) {
          console.log(profileImage, "image");
          await uploadDoctorProfile({
            image: profileImage,
            userId: user?.id ?? "",
          });
        }
        // console.log(id);

        console.log(data);
      } catch (error) {
        console.log(error);
        console.error("Doctor error:", error);
      }
    } catch (error) {
      console.log(error);
      console.error("Registration error:", error);
    } finally {
      localStorage.setItem("registered", "true");
      setSuccessModalOpen(true);
      await supabase.auth.signOut();
      router.replace("/");
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (currentStep === 2 && isEmailVerified) {
      setTimeout(() => {
        handleNext();
      }, 1000);
    }
  }, [isEmailVerified, currentStep]);

  const renderStepContent = () => {
    useEffect(() => {
      const registered = localStorage.getItem("registered")!;
      console.log(registered);
      if (!registered) {
        setIsRegistered(true);
      }
    }, []);
    if (!isRegistered) {
      return (
        <AlreadyRegistered
          onLoginClick={() => alert("Login")}
          onSupportClick={() => window.open("mailto:heal2gether.app@gmail.com")}
        />
      );
    }
    switch (currentStep) {
      case 1:
        return <EmailStep />;
      case 2:
        return <OTPStep />;
      case 3:
        return <BasicInfoStep />;
      case 4:
        return <ContactInfoStep />;
      case 5:
        return <ProfessionalInfoStep />;
      default:
        return <EmailStep />;
    }
    // return <ContactInfoStep />;
  };

  const canProceed = () => {
    if (currentStep === 2 && isEmailVerified && session) {
      return true;
    }
    return validateStep(currentStep);
  };
  console.log(formData);
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        },
      }}
    >
      <RegistrationSuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        onGoToLogin={() => setSuccessModalOpen(false)}
      />
      <Container maxWidth="md">
        <Fade in={true} timeout={800}>
          <Card
            elevation={24}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: theme.shadows[24],
              },
            }}
          >
            <CardContent sx={{ p: isMobile ? 3 : 5 }}>
              {/* Header */}
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    mb: 2,
                    boxShadow: theme.shadows[8],
                  }}
                >
                  <PersonAdd sx={{ fontSize: 40, color: "white" }} />
                </Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    color: "#1a1a1a",
                    mb: 1,
                    fontSize: isMobile ? "1.75rem" : "2.125rem",
                  }}
                >
                  Join as a Doctor
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontSize: "1.1rem", mb: 3 }}
                >
                  Create your professional medical account
                </Typography>

                {/* Step Indicator */}
                <Stepper
                  activeStep={currentStep - 1}
                  sx={{
                    mb: 4,
                    "& .MuiStepIcon-root": {
                      fontSize: "1.5rem",
                      "&.Mui-active": {
                        color: "#667eea",
                      },
                      "&.Mui-completed": {
                        color: "#16a34a",
                      },
                    },
                    "& .MuiStepLabel-label": {
                      fontSize: isMobile ? "0.875rem" : "1rem",
                      "&.Mui-active": {
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  {steps.map((label, index) => (
                    <Step key={label}>
                      <StepLabel
                        StepIconComponent={({ active, completed }) => (
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: completed
                                ? "#16a34a"
                                : active
                                ? "#667eea"
                                : "#e2e8f0",
                              color: completed || active ? "white" : "#64748b",
                              fontSize: "0.875rem",
                              fontWeight: 600,
                              border: active ? "2px solid #667eea" : "none",
                            }}
                          >
                            {completed ? (
                              <CheckCircle sx={{ fontSize: 20 }} />
                            ) : (
                              index + 1
                            )}
                          </Box>
                        )}
                      >
                        {!isMobile && label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              {/* Step Content */}
              <Box sx={{ minHeight: 400, mb: 4 }}>
                <Slide
                  direction={slideDirection}
                  in={true}
                  timeout={400}
                  key={currentStep}
                >
                  <Box>{renderStepContent()}</Box>
                </Slide>
              </Box>

              {/* Navigation Buttons */}
              <Grid container spacing={2} justifyContent="space-between">
                <Grid item>
                  {currentStep > 1 && (
                    <Button
                      onClick={handleBack}
                      variant="outlined"
                      startIcon={<ArrowBack />}
                      disabled={loading}
                      sx={{
                        borderColor: "#667eea",
                        color: "#667eea",
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        "&:hover": {
                          borderColor: "#5a67d8",
                          backgroundColor: "rgba(102, 126, 234, 0.04)",
                        },
                      }}
                    >
                      Previous
                    </Button>
                  )}
                </Grid>
                <Grid item>
                  {currentStep < 5 ? (
                    <Button
                      onClick={handleNext}
                      variant="contained"
                      endIcon={<ArrowForward />}
                      disabled={!canProceed()}
                      sx={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        boxShadow: theme.shadows[8],
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                          boxShadow: theme.shadows[12],
                        },
                      }}
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      variant="contained"
                      endIcon={<CheckCircle />}
                      disabled={!canProceed()}
                      sx={{
                        background:
                          "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        boxShadow: theme.shadows[8],
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #15803d 0%, #166534 100%)",
                          boxShadow: theme.shadows[12],
                        },
                      }}
                    >
                      {loading ? "Registering..." : "Complete Registration"}
                    </Button>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
}
