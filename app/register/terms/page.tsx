"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  Fade,
  Stack,
  Button,
} from "@mui/material";
import {
  ExpandMore,
  Shield,
  HealthAndSafety,
  Lock,
  Update,
  Warning,
  CheckCircle,
  Mail,
  Scale,
  ArrowBack,
} from "@mui/icons-material";
import { AlertTriangle, Baby, Heart, RefreshCw, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TermsAndConditions() {
  const theme = useTheme();
  const router = useRouter();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const sections = [
    {
      id: "panel1",
      icon: <User />,
      title: "1. Information We Collect",
      color: "blue",
      points: [
        "We may collect the following types of information:",
        "Personal Information: Name, date of birth, contact details, and account information.",
      ],
    },
    {
      id: "panel2",
      icon: <Heart />,
      title: "2. We use your information to",
      color: "green",
      points: [
        "Provide health consultations and related services.",
        "Communicate with you regarding appointments, follow-ups, or support.",
        "Improve our Services, technology, and user experience.",
        "Ensure compliance with legal and regulatory requirements.",
      ],
      important:
        "We will never sell your personal or health information to third parties.",
    },
    {
      id: "panel3",
      icon: <AlertTriangle />,
      title: "3. No Emergency Services",
      color: "orange",
      points: [
        "Our Services are not suitable for emergencies.",
        "If you believe you are experiencing a medical emergency, call 911 (or your local emergency number) immediately.",
      ],
    },
    {
      id: "panel4",
      icon: <CheckCircle />,
      title: "4. Consultation Limit",
      color: "purple",
      points: [
        "Consultations are based on the information you provide. If such information is incomplete, inaccurate, or withheld, our ability to provide useful recommendations may be limited.",
        "Our providers may advise you to seek in-person medical evaluation if your condition cannot be adequately addressed through consultation.",
      ],
    },
    {
      id: "panel5",
      icon: <Scale />,
      title: "5. No Guarantees",
      color: "red",
      points: [
        "While our providers aim to give reliable and professional guidance, we cannot guarantee outcomes.",
        "Results depend on multiple factors outside of our control, including your own decisions, adherence, and underlying health conditions.",
      ],
    },
    {
      id: "panel6",
      icon: <Lock />,
      title: "6. Data Protection & Privacy",
      color: "cyan",
      points: [
        "We are committed to protecting your personal and health information.",
        "All data you share with us is stored and processed in compliance with applicable data protection laws (e.g., HIPAA, GDPR, or other local regulations).",
        "We implement appropriate technical, administrative, and organizational safeguards to protect your information from unauthorized access, loss, misuse, or disclosure.",
        "Your information will never be shared with third parties without your explicit consent, except as required by law or necessary to provide our Services (e.g., licensed providers directly involved in your care).",
        "For more details, please refer to our Privacy Policy.",
      ],
    },
    {
      id: "panel7",
      icon: <Baby />,
      title: "7. Children's Privacy",
      color: "pink",
      points: [
        "Our Services are not directed toward children under 18 without parental/guardian consent.",
        "We do not knowingly collect information from children without proper authorization.",
      ],
    },
    {
      id: "panel8",
      icon: <Shield />,
      title: "8. Limitation of Liability",
      color: "gray",
      points: [
        "To the maximum extent permitted by law:",
        "Heal2gether and its providers are not liable for any adverse outcomes resulting from your decisions, actions, or failure to act after consultation.",
        "You accept full responsibility for your choices regarding your health.",
      ],
    },
    {
      id: "panel9",
      icon: <RefreshCw />,
      title: "9. Changes to Terms",
      color: "brown",
      points: [
        'We may update these Terms & Conditions at any time. Changes will be posted with an updated "Last Updated" date. Continued use of our Services constitutes acceptance of the updated terms.',
      ],
    },
    {
      id: "panel10",
      icon: <Mail />,
      title: "10. Contact Us",
      color: "indigo",
      points: [
        "For questions regarding these Terms & Conditions, please contact us at:",
        "heal2gether.app@gmail.com",
      ],
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Paper
            elevation={24}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              background: "rgba(255, 255, 255, 0.98)",
            }}
          >
            {/* Header Section */}
            <Box
              sx={{
                background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                color: "white",
                py: { xs: 4, md: 6 },
                px: { xs: 3, md: 6 },
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.1)",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -30,
                  left: -30,
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.08)",
                },
              }}
            >
              <Button
                variant="contained"
                startIcon={<ArrowBack fontSize="large" />}
                onClick={() => {
                  router.back();
                }}
                style={{
                  color: "white",
                  backgroundColor: "#1e3c72",
                }}
              />
              <Stack
                spacing={2}
                alignItems="center"
                sx={{ position: "relative", zIndex: 1 }}
              >
                <HealthAndSafety sx={{ fontSize: { xs: 60, md: 80 } }} />
                <Typography
                  variant={isMobile ? "h4" : "h3"}
                  fontWeight={700}
                  textAlign="center"
                  sx={{
                    textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                  }}
                  style={{
                    color: "white",
                  }}
                >
                  Terms & Conditions
                </Typography>
                <Typography
                  variant="h6"
                  textAlign="center"
                  style={{
                    color: "white",
                  }}
                  sx={{ opacity: 0.95 }}
                >
                  Welcome to Heal2gether ("we," "our," or "us"). By using our
                  consultation services, you agree to the following Terms &
                  Conditions.
                </Typography>
                <Chip
                  icon={<Update />}
                  label={`Last Updated: ${getCurrentDate()}`}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    backdropFilter: "blur(10px)",
                  }}
                />
              </Stack>
            </Box>

            {/* Content Section */}
            <Box sx={{ p: { xs: 2, md: 4 } }}>
              {sections.map((section, index) => (
                <Accordion
                  key={section.id}
                  expanded={expanded === section.id}
                  onChange={handleChange(section.id)}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    "&:before": { display: "none" },
                    boxShadow: expanded === section.id ? 4 : 1,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: 3,
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      background:
                        expanded === section.id
                          ? `linear-gradient(135deg, ${section.color}15 0%, ${section.color}05 100%)`
                          : "transparent",
                      borderRadius: 2,
                      minHeight: 70,
                      "& .MuiAccordionSummary-content": {
                        my: 2,
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          backgroundColor: section.color,
                          color: "white",
                          borderRadius: 2,
                          p: 1.5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {section.icon}
                      </Box>
                      <Typography
                        variant={isMobile ? "subtitle1" : "h6"}
                        fontWeight={600}
                        sx={{ color: section.color }}
                      >
                        {section.title}
                      </Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 2 }}>
                    <List>
                      {section.points.map((point, idx) => (
                        <ListItem
                          key={idx}
                          alignItems="flex-start"
                          sx={{ py: 1 }}
                        >
                          <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                            <CheckCircle
                              sx={{ color: section.color, fontSize: 20 }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={point}
                            sx={{
                              "& .MuiListItemText-primary": {
                                fontSize: "1rem",
                                lineHeight: 1.7,
                              },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                    {section.important && (
                      <Paper
                        sx={{
                          mt: 2,
                          p: 2,
                          backgroundColor: `${section.color}10`,
                          borderLeft: `4px solid ${section.color}`,
                        }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Warning sx={{ color: section.color }} />
                          <Typography fontWeight={600} color={section.color}>
                            {section.important}
                          </Typography>
                        </Stack>
                      </Paper>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>

            {/* Footer */}
            <Divider />
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                backgroundColor: "#f5f5f5",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                © 2025 Heal2gether. All rights reserved.
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}
