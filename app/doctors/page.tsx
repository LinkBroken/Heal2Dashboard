"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Avatar,
  Paper,
  Divider,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DashboardLayout } from "../components/Layout/DashboardLayout";
import getDoctorSchedules from "../actions/getDoctorSchedule";
import {
  Calendar,
  Clock,
  Stethoscope,
  Activity,
  CheckCircle,
  XCircle,
  Edit,
  Plus,
  Filter,
} from "lucide-react";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
}

interface TimeSlot {
  start: string;
  end: string;
}

interface DoctorSchedule {
  id: string;
  doctor_id: string;
  day_of_week: number;
  is_available: boolean;
  time_slots: TimeSlot[];
  consultation_fee: number;
  created_at: string;
  updated_at: string;
  profiles: Profile;
}

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DAY_ABBREVIATIONS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DoctorSchedulesPage() {
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const res = await getDoctorSchedules();
        setSchedules(res || []);
      } catch (error) {
        console.error("Error fetching doctor schedules:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  // Group schedules by doctor
  const doctorSchedules = React.useMemo(() => {
    const grouped = schedules.reduce((acc, schedule) => {
      const doctorId = schedule.doctor_id;
      if (!acc[doctorId]) {
        acc[doctorId] = {
          profile: schedule.profiles,
          schedules: [],
        };
      }
      acc[doctorId].schedules.push(schedule);
      return acc;
    }, {} as Record<string, { profile: Profile; schedules: DoctorSchedule[] }>);

    return Object.values(grouped);
  }, [schedules]);

  // Calculate statistics
  const stats = React.useMemo(() => {
    const totalDoctors = doctorSchedules.length;
    const activeDoctors = doctorSchedules.filter((d) =>
      d.schedules.some((s) => s.is_available)
    ).length;

    const totalTimeSlots = schedules.reduce(
      (sum, schedule) => sum + (schedule.time_slots?.length || 0),
      0
    );

    const averageFee =
      schedules.length > 0
        ? schedules.reduce((sum, s) => sum + (s.consultation_fee || 0), 0) /
          schedules.length
        : 0;

    return {
      totalDoctors,
      activeDoctors,
      totalTimeSlots,
      averageFee: Math.round(averageFee * 100) / 100,
    };
  }, [doctorSchedules, schedules]);

  const statsCards = [
    {
      title: "Total Doctors",
      value: stats.totalDoctors,
      icon: Stethoscope,
      color: "#2563eb",
      bgColor: "#eff6ff",
    },
    {
      title: "Active Schedules",
      value: stats.activeDoctors,
      icon: CheckCircle,
      color: "#059669",
      bgColor: "#d1fae5",
    },
    {
      title: "Time Slots",
      value: stats.totalTimeSlots,
      icon: Clock,
      color: "#7c3aed",
      bgColor: "#f3e8ff",
    },
    {
      title: "Avg Fee",
      value: `$${stats.averageFee}`,
      icon: Activity,
      color: "#d97706",
      bgColor: "#fef3c7",
    },
  ];

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getAvailabilityColor = (isAvailable: boolean) => {
    return isAvailable ? "#059669" : "#dc2626";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h1" sx={{ mb: 1 }}>
              Doctor Schedules
            </Typography>
            <LinearProgress />
          </Box>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h1" sx={{ mb: 1 }}>
            Doctor Time Slots & Schedules
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b" }}>
            Manage doctor availability, working hours, and consultation
            schedules.
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              // @ts-ignore

              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: stat.bgColor,
                          mr: 2,
                        }}
                      >
                        <Icon size={24} color={stat.color} />
                      </Box>
                      <Typography
                        variant="h3"
                        sx={{ fontWeight: 700, color: "#1e293b" }}
                      >
                        {stat.value}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{ color: "#64748b", fontWeight: 500 }}
                    >
                      {stat.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Doctor Schedules */}
        <Grid container spacing={3}>
          {doctorSchedules.map((doctorData) => (
            // @ts-ignore

            <Grid item xs={12} key={doctorData.profile.id}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  {/* Doctor Header */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        mr: 3,
                        backgroundColor: "#e0e7ff",
                        color: "#3730a3",
                      }}
                    >
                      <Stethoscope size={32} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Typography
                          variant="h4"
                          sx={{ fontWeight: 600, color: "#1e293b", mr: 2 }}
                        >
                          Dr. {doctorData.profile.first_name}{" "}
                          {doctorData.profile.last_name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: "#64748b" }}>
                        Doctor ID: {doctorData.profile.id}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* Weekly Schedule */}
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Weekly Schedule
                  </Typography>

                  <Grid container spacing={2}>
                    {DAYS_OF_WEEK.map((day, dayIndex) => {
                      const daySchedule = doctorData.schedules.find(
                        (s) => s.day_of_week === dayIndex
                      );

                      return (
                        // @ts-ignore
                        <Grid item xs={12} md={6} lg={4} key={dayIndex}>
                          <Paper
                            sx={{
                              p: 2,
                              border: "1px solid #e2e8f0",
                              borderRadius: 2,
                              backgroundColor: daySchedule?.is_available
                                ? "#f0fdf4"
                                : "#fef2f2",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 2,
                              }}
                            >
                              <Calendar size={16} color="#64748b" />
                              <Typography
                                variant="body1"
                                sx={{
                                  ml: 1,
                                  fontWeight: 600,
                                  color: "#1e293b",
                                }}
                              >
                                {day}
                              </Typography>
                              <Box sx={{ ml: "auto" }}>
                                <Chip
                                  label={
                                    daySchedule?.is_available
                                      ? "Available"
                                      : "Unavailable"
                                  }
                                  size="small"
                                  sx={{
                                    backgroundColor: `${getAvailabilityColor(
                                      daySchedule?.is_available || false
                                    )}15`,
                                    color: getAvailabilityColor(
                                      daySchedule?.is_available || false
                                    ),
                                    fontWeight: 500,
                                  }}
                                />
                              </Box>
                            </Box>

                            {daySchedule?.is_available &&
                            daySchedule.time_slots &&
                            daySchedule.time_slots.length > 0 ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 1,
                                }}
                              >
                                {daySchedule.time_slots.map(
                                  (slot, slotIndex) => (
                                    <Box
                                      key={slotIndex}
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        p: 1,
                                        backgroundColor: "#ffffff",
                                        borderRadius: 1,
                                        border: "1px solid #e2e8f0",
                                      }}
                                    >
                                      <Clock size={14} color="#059669" />
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          ml: 1,
                                          color: "#1e293b",
                                          fontWeight: 500,
                                        }}
                                      >
                                        {formatTime(slot.start)} -{" "}
                                        {formatTime(slot.end)}
                                      </Typography>
                                    </Box>
                                  )
                                )}
                                <Box
                                  sx={{
                                    mt: 1,
                                    pt: 1,
                                    borderTop: "1px solid #e2e8f0",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{ color: "#64748b" }}
                                  >
                                    Fee:{" "}
                                    {formatCurrency(
                                      daySchedule.consultation_fee
                                    )}
                                  </Typography>
                                </Box>
                              </Box>
                            ) : (
                              <Box sx={{ textAlign: "center", py: 2 }}>
                                <XCircle size={24} color="#dc2626" />
                                <Typography
                                  variant="body2"
                                  sx={{ mt: 1, color: "#64748b" }}
                                >
                                  No time slots available
                                </Typography>
                              </Box>
                            )}
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {doctorSchedules.length === 0 && (
          <Card>
            <CardContent sx={{ textAlign: "center", py: 8 }}>
              <Calendar size={64} color="#64748b" />
              <Typography variant="h5" sx={{ mt: 2, mb: 1, color: "#64748b" }}>
                No Doctor Schedules Found
              </Typography>
              <Typography variant="body1" sx={{ color: "#64748b", mb: 3 }}>
                Start by adding doctor schedules to manage appointments.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Plus size={16} />}
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                  },
                }}
              >
                Add First Schedule
              </Button>
            </CardContent>
          </Card>
        )}
      </Container>
    </DashboardLayout>
  );
}
