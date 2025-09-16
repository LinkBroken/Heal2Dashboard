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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
} from "@mui/material";
import { DashboardLayout } from "../components/Layout/DashboardLayout";
import { ActionsDropdown } from "../components/Dropdowns/ActionsDropdown";
import { mockReports as initialReports } from "../data/mockData";
import { Report } from "../types/notification";
import {
  BarChart3,
  FileText,
  Shield,
  Activity,
  Download,
  Eye,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import getAppointmentsData from "../actions/getAppointmentsData";
import { Appointment } from "../types";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#059669";
      case "scheduled":
        return "#2563eb";
      case "cancelled":
        return "#dc2626";
      case "no-show":
        return "#d97706";
      case "pending":
        return "#d97706";
      case "failed":
        return "#dc2626";
      default:
        return "#64748b";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "analytics":
        return <BarChart3 size={20} />;
      case "security":
        return <Shield size={20} />;
      case "performance":
        return <Activity size={20} />;
      default:
        return <FileText size={20} />;
    }
  };

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case "consultation":
        return <Users size={16} />;
      case "follow-up":
        return <Activity size={16} />;
      case "check-up":
        return <CheckCircle size={16} />;
      case "emergency":
        return <AlertCircle size={16} />;
      default:
        return <Calendar size={16} />;
    }
  };

  const handleViewReport = (report: Report) => {
    console.log("Viewing report:", report);
  };

  const handleDownloadReport = (report: Report) => {
    console.log("Downloading report:", report);
  };

  const handleDeleteReport = (id: string) => {
    setReports((prev) => prev.filter((report) => report.id !== id));
  };

  const handleGenerateReport = () => {
    const newReport: Report = {
      id: (reports.length + 1).toString(),
      title: "Appointment Analytics Report",
      description: `Generated report with ${appointments.length} appointments`,
      type: "analytics",
      createdAt: new Date(),
      status: "completed",
    };
    setReports((prev) => [newReport, ...prev]);
  };

  // Calculate appointment statistics
  const appointmentStats = React.useMemo(() => {
    if (!appointments.length) return null;

    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(
      (a) => a.status === "completed"
    ).length;
    const cancelledAppointments = appointments.filter(
      (a) => a.status === "cancelled"
    ).length;
    const scheduledAppointments = appointments.filter(
      (a) => a.status === "scheduled"
    ).length;

    const today = new Date();
    const thisMonth = appointments.filter((a) => {
      const appointmentDate = new Date(a.appointment_date);
      return (
        appointmentDate.getMonth() === today.getMonth() &&
        appointmentDate.getFullYear() === today.getFullYear()
      );
    }).length;

    const averageDuration =
      appointments.reduce((sum, a) => sum + a.duration_minutes, 0) /
      totalAppointments;

    const completionRate =
      totalAppointments > 0
        ? (completedAppointments / totalAppointments) * 100
        : 0;

    return {
      total: totalAppointments,
      completed: completedAppointments,
      cancelled: cancelledAppointments,
      scheduled: scheduledAppointments,
      thisMonth,
      averageDuration: Math.round(averageDuration),
      completionRate: Math.round(completionRate),
    };
  }, [appointments]);

  const reportStats = [
    {
      title: "Total Reports",
      value: reports.length,
      icon: FileText,
      color: "#2563eb",
      bgColor: "#eff6ff",
    },
    {
      title: "Completed",
      value: reports.filter((r) => r.status === "completed").length,
      icon: BarChart3,
      color: "#059669",
      bgColor: "#d1fae5",
    },
    {
      title: "Pending",
      value: reports.filter((r) => r.status === "pending").length,
      icon: Activity,
      color: "#d97706",
      bgColor: "#fef3c7",
    },
    {
      title: "This Month",
      value: reports.filter((r) => {
        const reportDate = new Date(r.createdAt);
        const now = new Date();
        return (
          reportDate.getMonth() === now.getMonth() &&
          reportDate.getFullYear() === now.getFullYear()
        );
      }).length,
      icon: Shield,
      color: "#2563eb",
      bgColor: "#eff6ff",
    },
  ];

  const appointmentStatsCards = appointmentStats
    ? [
        {
          title: "Total Appointments",
          value: appointmentStats.total,
          icon: Calendar,
          color: "#2563eb",
          bgColor: "#eff6ff",
        },
        {
          title: "Completed",
          value: appointmentStats.completed,
          icon: CheckCircle,
          color: "#059669",
          bgColor: "#d1fae5",
        },
        {
          title: "Cancelled",
          value: appointmentStats.cancelled,
          icon: XCircle,
          color: "#dc2626",
          bgColor: "#fee2e2",
        },
        {
          title: "This Month",
          value: appointmentStats.thisMonth,
          icon: Clock,
          color: "#7c3aed",
          bgColor: "#f3e8ff",
        },
      ]
    : [];

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  const formatDateTime = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const res = await getAppointmentsData();
        setAppointments(res || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h1" sx={{ mb: 1 }}>
              Reports
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
            Reports & Analytics
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b" }}>
            Generate, view, and manage system reports and appointment analytics.
          </Typography>
        </Box>

        {/* Appointment Statistics */}
        {appointmentStats && (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Appointment Overview
              </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {appointmentStatsCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Card>
                      <CardContent>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
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

            {/* Additional Metrics */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Completion Rate
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, mr: 2 }}>
                        {appointmentStats.completionRate}%
                      </Typography>
                      <Chip
                        label={
                          appointmentStats.completionRate >= 80
                            ? "Excellent"
                            : appointmentStats.completionRate >= 60
                            ? "Good"
                            : "Needs Improvement"
                        }
                        size="small"
                        color={
                          appointmentStats.completionRate >= 80
                            ? "success"
                            : appointmentStats.completionRate >= 60
                            ? "primary"
                            : "warning"
                        }
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={appointmentStats.completionRate}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Average Duration
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Clock size={24} color="#2563eb" />
                      <Typography variant="h4" sx={{ fontWeight: 700, ml: 1 }}>
                        {appointmentStats.averageDuration}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ ml: 1, color: "#64748b" }}
                      >
                        minutes
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}

        {appointments.length > 0 && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h5">Recent Appointments</Typography>
                <Button
                  variant="outlined"
                  startIcon={<Download size={16} />}
                  size="small"
                >
                  Export Data
                </Button>
              </Box>

              <TableContainer
                component={Paper}
                sx={{ boxShadow: "none", border: "1px solid #e2e8f0" }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                      <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                        Appointment
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                        Doctor
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                        Type
                      </TableCell>

                      <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                        Date & Time
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                        Duration
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow
                        key={appointment?.id}
                        sx={{ "&:hover": { backgroundColor: "#f8fafc" } }}
                      >
                        <TableCell>
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 500,
                                color: "#1e293b",
                                mb: 0.5,
                              }}
                            >
                              {appointment?.id.slice(0, 8)}...
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "#64748b" }}
                            >
                              Patient: {appointment?.patient_id?.slice(0, 8)}...
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                            {appointment?.doctors?.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {getAppointmentTypeIcon(appointment?.type)}
                            <Typography
                              variant="body2"
                              sx={{
                                ml: 1,
                                color: "#64748b",
                                textTransform: "capitalize",
                              }}
                            >
                              {appointment?.type}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                            {formatDateTime(appointment?.appointment_date)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#64748b" }}>
                            {appointment?.duration_minutes} min
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={appointment?.status}
                            size="small"
                            sx={{
                              backgroundColor: `${getStatusColor(
                                appointment?.status
                              )}15`,
                              color: getStatusColor(appointment?.status),
                              fontWeight: 500,
                              textTransform: "capitalize",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Container>
    </DashboardLayout>
  );
}
