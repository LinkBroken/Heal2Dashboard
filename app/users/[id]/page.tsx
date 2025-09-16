"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Stack,
  IconButton,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { DashboardLayout } from "../../components/Layout/DashboardLayout";
import { UserEditDrawer } from "@/app/components/Drawers/UserEditDrawer";
import { CombinedUserProfile, AppointmentWithDetails } from "@/app/types";
import {
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  Edit,
  Download,
  ArrowLeft,
  Clock,
  Activity,
  Stethoscope,
  Heart,
  Award,
  MapPin,
  Users,
  Calendar as CalendarIcon,
} from "lucide-react";
import { getAppointmentsByUser } from "@/app/actions/getAppointmentsByUser";
import { getUserById } from "@/app/actions/getUserById";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<CombinedUserProfile | null>(null);
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadUserData();
    loadAppointments();
  }, [userId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = await getUserById(userId);
      setUser(userData);
    } catch (err) {
      setError("Failed to load user data");
      console.error("Error loading user:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadAppointments = async () => {
    try {
      const appointmentsData = await getAppointmentsByUser(userId);
      setAppointments(appointmentsData);
    } catch (err) {
      console.error("Error loading appointments:", err);
    }
  };

  const handleGeneratePdf = async () => {
    try {
      setGeneratingPdf(true);
      const response = await fetch(`/api/users/${userId}`, {
        method: "POST",
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${user?.userType}-${user?.name}-${user?.id}-profile.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error("Failed to generate PDF");
      }
    } catch (err) {
      console.error("Error generating PDF:", err);
    } finally {
      setGeneratingPdf(false);
    }
  };

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "#2563eb";
      case "completed":
        return "#059669";
      case "cancelled":
        return "#dc2626";
      case "no-show":
        return "#d97706";
      default:
        return "#64748b";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getUserTypeIcon = () => {
    return user?.userType === "doctor" ? Stethoscope : Heart;
  };

  const getUserTypeColor = () => {
    return user?.userType === "doctor" ? "#2563eb" : "#dc2626";
  };

  const getUserTypeLabel = () => {
    return user?.userType === "doctor" ? "Dr." : "";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
            }}
          >
            <CircularProgress />
          </Box>
        </Container>
      </DashboardLayout>
    );
  }

  if (error || !user) {
    return (
      <DashboardLayout>
        <Container maxWidth="xl">
          <Alert severity="error" sx={{ mt: 4 }}>
            {error || "User not found"}
          </Alert>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        {/* Header */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={() => router.back()} sx={{ mr: 2 }}>
              <ArrowLeft size={20} />
            </IconButton>
            <Box>
              <Typography variant="h1" sx={{ mb: 1 }}>
                {getUserTypeLabel()} {user.name}
              </Typography>
              <Typography variant="body1" sx={{ color: "#64748b" }}>
                {user.userType === "doctor" ? "Doctor" : "Patient"} Profile &
                Management
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<Download size={16} />}
              onClick={handleGeneratePdf}
              disabled={generatingPdf}
            >
              {generatingPdf ? "Generating..." : "Download PDF"}
            </Button>
            <Button
              variant="contained"
              startIcon={<Edit size={16} />}
              onClick={() => setEditDrawerOpen(true)}
            >
              Edit Profile
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {/* User Information Card */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mr: 2,
                      bgcolor: getUserTypeColor(),
                      fontSize: "2rem",
                    }}
                  >
                    {user.first_name?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 600, color: "#1e293b" }}
                    >
                      {getUserTypeLabel()} {user.first_name} {user.last_name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b" }}>
                      {user.userType === "doctor" ? "Doctor" : "Patient"} ID:{" "}
                      {user.id.slice(0, 8).toUpperCase()}
                    </Typography>
                    <Chip
                      label={user.profile?.status || "Active"}
                      size="small"
                      sx={{
                        mt: 1,
                        backgroundColor:
                          user.profile?.status === "approved"
                            ? "#d1fae5"
                            : "#fef3c7",
                        color:
                          user.profile?.status === "approved"
                            ? "#059669"
                            : "#d97706",
                        textTransform: "capitalize",
                      }}
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={2}>
                  {user.email && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Mail size={16} color="#64748b" />
                      <Typography
                        variant="body2"
                        sx={{ ml: 1, color: "#64748b" }}
                      >
                        {user.email}
                      </Typography>
                    </Box>
                  )}
                  {user.phone && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Phone size={16} color="#64748b" />
                      <Typography
                        variant="body2"
                        sx={{ ml: 1, color: "#64748b" }}
                      >
                        {user.phone}
                      </Typography>
                    </Box>
                  )}
                  {user.userType === "doctor" && user.specialty && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Stethoscope size={16} color="#64748b" />
                      <Typography
                        variant="body2"
                        sx={{ ml: 1, color: "#64748b" }}
                      >
                        {user.specialty}
                      </Typography>
                    </Box>
                  )}
                  {user.userType === "doctor" && user.rating && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Award size={16} color="#64748b" />
                      <Typography
                        variant="body2"
                        sx={{ ml: 1, color: "#64748b" }}
                      >
                        Rating: {user.rating}/5
                      </Typography>
                    </Box>
                  )}
                  {user.userType === "patient" && user.date_of_birth && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Calendar size={16} color="#64748b" />
                      <Typography
                        variant="body2"
                        sx={{ ml: 1, color: "#64748b" }}
                      >
                        DOB: {formatDate(user.date_of_birth)}
                      </Typography>
                    </Box>
                  )}
                  {user.address && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <MapPin size={16} color="#64748b" />
                      <Typography
                        variant="body2"
                        sx={{ ml: 1, color: "#64748b" }}
                      >
                        {user.address}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Main Content Area */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={tabValue}
                    onChange={(event, newValue) => setTabValue(newValue)}
                    aria-label="user detail tabs"
                  >
                    <Tab
                      label={`Appointments (${appointments.length})`}
                      icon={<CalendarIcon size={16} />}
                      iconPosition="start"
                    />
                    <Tab
                      label={
                        user.userType === "doctor"
                          ? "Professional Info"
                          : "Personal Info"
                      }
                      icon={<FileText size={16} />}
                      iconPosition="start"
                    />
                    <Tab
                      label="Statistics"
                      icon={<Activity size={16} />}
                      iconPosition="start"
                    />
                  </Tabs>
                </Box>

                {/* Appointments Tab */}
                <TabPanel value={tabValue} index={0}>
                  {appointments.length === 0 ? (
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 6,
                        color: "#64748b",
                      }}
                    >
                      <CalendarIcon
                        size={48}
                        style={{ marginBottom: 16, opacity: 0.5 }}
                      />
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        No appointments found
                      </Typography>
                      <Typography variant="body2">
                        {user.userType === "doctor"
                          ? "This doctor hasn't had any appointments yet."
                          : "This patient hasn't had any appointments yet."}
                      </Typography>
                    </Box>
                  ) : (
                    <TableContainer
                      component={Paper}
                      sx={{ boxShadow: "none" }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                            <TableCell sx={{ fontWeight: 600 }}>
                              Date & Time
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                              {user.userType === "doctor"
                                ? "Patient"
                                : "Doctor"}
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                              Status
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                              Duration
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {appointments.map((appointment) => (
                            <TableRow
                              key={appointment.id}
                              sx={{
                                "&:hover": { backgroundColor: "#f8fafc" },
                              }}
                            >
                              <TableCell>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {formatDateTime(appointment.appointment_date)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="body2"
                                  sx={{ textTransform: "capitalize" }}
                                >
                                  {appointment.type || "General"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {user.userType === "doctor" &&
                                appointment.patient ? (
                                  <Typography variant="body2">
                                    {appointment.patient.first_name}{" "}
                                    {appointment.patient.last_name}
                                  </Typography>
                                ) : user.userType === "patient" &&
                                  appointment.doctor ? (
                                  <Typography variant="body2">
                                    Dr. {appointment.doctor.name}{" "}
                                    {appointment.doctor.last_name}
                                  </Typography>
                                ) : (
                                  <Typography
                                    variant="body2"
                                    sx={{ color: "#64748b" }}
                                  >
                                    N/A
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={appointment.status}
                                  size="small"
                                  sx={{
                                    backgroundColor: `${getAppointmentStatusColor(
                                      appointment.status
                                    )}15`,
                                    color: getAppointmentStatusColor(
                                      appointment.status
                                    ),
                                    textTransform: "capitalize",
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {appointment.duration_minutes || 30} min
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </TabPanel>

                {/* Professional/Personal Info Tab */}
                <TabPanel value={tabValue} index={1}>
                  <Grid container spacing={3}>
                    {user.userType === "doctor" ? (
                      <>
                        <Grid item xs={12} md={6}>
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor: "#f8fafc",
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{ mb: 2, color: "#1e293b" }}
                            >
                              Professional Details
                            </Typography>
                            <Stack spacing={2}>
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{ color: "#64748b", mb: 0.5 }}
                                >
                                  Specialty
                                </Typography>
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {user.specialty || "Not specified"}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{ color: "#64748b", mb: 0.5 }}
                                >
                                  Experience
                                </Typography>
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {user.experience || "Not specified"}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{ color: "#64748b", mb: 0.5 }}
                                >
                                  Rating
                                </Typography>
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {user.rating
                                    ? `${user.rating}/5`
                                    : "Not rated"}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{ color: "#64748b", mb: 0.5 }}
                                >
                                  Location
                                </Typography>
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {user.location || "Not specified"}
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>
                        </Grid>
                      </>
                    ) : (
                      <>
                        <Grid item xs={12} md={6}>
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor: "#f8fafc",
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{ mb: 2, color: "#1e293b" }}
                            >
                              Personal Information
                            </Typography>
                            <Stack spacing={2}>
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{ color: "#64748b", mb: 0.5 }}
                                >
                                  Date of Birth
                                </Typography>
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {user.date_of_birth
                                    ? formatDate(user.date_of_birth)
                                    : "Not provided"}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{ color: "#64748b", mb: 0.5 }}
                                >
                                  Gender
                                </Typography>
                                <Typography
                                  variant="body1"
                                  sx={{
                                    fontWeight: 500,
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {user.gender || "Not specified"}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{ color: "#64748b", mb: 0.5 }}
                                >
                                  Emergency Contact
                                </Typography>
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {user.emergency_contact || "Not provided"}
                                </Typography>
                              </Box>
                            </Stack>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor: "#f8fafc",
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{ mb: 2, color: "#1e293b" }}
                            >
                              Medical History
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "#64748b" }}
                            >
                              {user.medical_history ||
                                "No medical history recorded"}
                            </Typography>
                          </Box>
                        </Grid>
                      </>
                    )}

                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: "#f8fafc",
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ mb: 2, color: "#1e293b" }}
                        >
                          Account Information
                        </Typography>
                        <Stack spacing={2}>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ color: "#64748b", mb: 0.5 }}
                            >
                              Role
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 500,
                                textTransform: "capitalize",
                              }}
                            >
                              {user.profile?.role || user.userType}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ color: "#64748b", mb: 0.5 }}
                            >
                              Status
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 500,
                                textTransform: "capitalize",
                              }}
                            >
                              {user.profile?.status || "Active"}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ color: "#64748b", mb: 0.5 }}
                            >
                              Member Since
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500 }}
                            >
                              {formatDate(user.created_at)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ color: "#64748b", mb: 0.5 }}
                            >
                              Strikes
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500 }}
                            >
                              {user.profile?.strikes || 0}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </Grid>
                  </Grid>
                </TabPanel>

                {/* Statistics Tab */}
                <TabPanel value={tabValue} index={2}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          p: 3,
                          backgroundColor: "#f8fafc",
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ mb: 3, color: "#1e293b" }}
                        >
                          Appointment Statistics
                        </Typography>
                        <Stack spacing={2}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: "#64748b" }}
                            >
                              Total Appointments:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {appointments.length}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: "#64748b" }}
                            >
                              Completed:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: "#059669" }}
                            >
                              {
                                appointments.filter(
                                  (a) => a.status === "completed"
                                ).length
                              }
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: "#64748b" }}
                            >
                              Scheduled:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: "#2563eb" }}
                            >
                              {
                                appointments.filter(
                                  (a) => a.status === "scheduled"
                                ).length
                              }
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: "#64748b" }}
                            >
                              Cancelled:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: "#dc2626" }}
                            >
                              {
                                appointments.filter(
                                  (a) => a.status === "cancelled"
                                ).length
                              }
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: "#64748b" }}
                            >
                              No-Show:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: "#d97706" }}
                            >
                              {
                                appointments.filter(
                                  (a) => a.status === "no-show"
                                ).length
                              }
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box
                        sx={{
                          p: 3,
                          backgroundColor: "#f8fafc",
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ mb: 3, color: "#1e293b" }}
                        >
                          Activity Summary
                        </Typography>
                        <Stack spacing={2}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: "#64748b" }}
                            >
                              Account Age:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {Math.floor(
                                (Date.now() -
                                  new Date(user.created_at).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )}{" "}
                              days
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ color: "#64748b" }}
                            >
                              Last Activity:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {appointments.length > 0
                                ? formatDate(appointments[0].appointment_date)
                                : "No recent activity"}
                            </Typography>
                          </Box>
                          {user.userType === "doctor" && (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ color: "#64748b" }}
                              >
                                Unique Patients:
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600 }}
                              >
                                {
                                  new Set(
                                    appointments
                                      .map((a) => a.patient?.id)
                                      .filter(Boolean)
                                  ).size
                                }
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </Box>
                    </Grid>
                  </Grid>
                </TabPanel>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <UserEditDrawer
          open={editDrawerOpen}
          onClose={() => setEditDrawerOpen(false)}
          user={user}
          onSave={() => {
            setEditDrawerOpen(false);
            loadUserData();
          }}
          loading={false}
        />
      </Container>
    </DashboardLayout>
  );
}
