"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { DashboardLayout } from "../components/Layout/DashboardLayout";
import { UserDrawer } from "../components/Drawers/UserDrawer";
import { ActionsDropdown } from "../components/Dropdowns/ActionsDropdown";
import { AddUserModal } from "../components/Modals/AddUserModal";
import { mockUsers as initialUsers } from "../data/mockData";
import { User as UserType } from "../types/notification";
import { MessageModal } from "../components/Modals/MessageModal";
import {
  User as UserIcon,
  Mail,
  Shield,
  MoreVertical,
  MessageSquare,
  Search,
  Users,
  UserCheck,
  UserX,
  Stethoscope,
  Heart,
} from "lucide-react";
import {
  sendMessage,
  getCurrentUserId,
  verifyAdminUser,
} from "../actions/sendMessage";

import { getUsersData as getdoctorsData } from "../actions/getUsersData";
import { DoctorProfile, PatientProfile } from "../types";
import updateUserStatus from "../actions/updateUserStatus";
import Link from "next/link";

// Combined user type for unified handling
type CombinedUser = (DoctorProfile | PatientProfile) & {
  userType: "doctor" | "patient";
};

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<CombinedUser | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [doctorsData, setDoctorsData] = useState<DoctorProfile[]>([]);
  const [patientsData, setPatientsData] = useState<PatientProfile[]>([]);
  const [combinedUsers, setCombinedUsers] = useState<CombinedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<CombinedUser[]>([]);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "doctor":
        return "#059669";
      case "patient":
        return "#2563eb";
      case "administrator":
        return "#dc2626";
      case "manager":
        return "#d97706";
      default:
        return "#64748b";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "#059669";
      case "pending":
        return "#d97706";
      case "suspended":
        return "#dc2626";
      default:
        return "#64748b";
    }
  };

  // Combine and map users data
  const combineUsersData = (
    doctors: DoctorProfile[],
    patients: PatientProfile[]
  ) => {
    const mappedDoctors: CombinedUser[] = doctors.map((doctor) => ({
      ...doctor,
      userType: "doctor" as const,
    }));

    const mappedPatients: CombinedUser[] = patients.map((patient) => ({
      ...patient,
      userType: "patient" as const,
      role: "patient", // Ensure patients have consistent role
    }));

    return [...mappedDoctors, ...mappedPatients];
  };

  // Filter users based on search and filters
  const filterUsers = (users: CombinedUser[]) => {
    return users.filter((user) => {
      // Text search
      const searchMatch =
        !searchQuery ||
        `${user.first_name} ${user.last_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const statusMatch =
        statusFilter === "all" || user.status === statusFilter;

      // Tab filter
      const tabMatch =
        activeTab === 0 ||
        (activeTab === 1 && user.userType === "doctor") ||
        (activeTab === 2 && user.userType === "patient");

      return searchMatch && statusMatch && tabMatch;
    });
  };

  const handleSendMessage = async (messageData: {
    title: string;
    message: string;
    recipientIds: string[] | null;
    type: string;
  }) => {
    if (!currentUserId) {
      throw new Error("User not authenticated");
    }

    setSendingMessage(true);
    try {
      await sendMessage({
        ...messageData,

        senderId: currentUserId,
      });

      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    } finally {
      setSendingMessage(false);
    }
  };

  const handleViewUser = (user: CombinedUser) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  const handleSaveUser = async (user: CombinedUser) => {
    setLoading(true);
    await updateUserStatus(user.id, user?.status!);
    setLoading(false);
    window.location.reload();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusFilterChange = (event: any) => {
    setStatusFilter(event.target.value);
  };

  // Update user stats with correct data
  const userStats = [
    {
      title: "Total Users",
      value: combinedUsers.length,
      icon: Users,
      color: "#2563eb",
      bgColor: "#dbeafe",
    },
    {
      title: "Doctors",
      value: doctorsData.length,
      icon: Stethoscope,
      color: "#059669",
      bgColor: "#d1fae5",
    },
    {
      title: "Patients",
      value: patientsData.length,
      icon: Heart,
      color: "#dc2626",
      bgColor: "#fee2e2",
    },
    {
      title: "Inactive Users",
      value: combinedUsers.filter((u) => u.status !== "approved").length,
      icon: UserX,
      color: "#d97706",
      bgColor: "#fef3c7",
    },
  ];

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const data = await getdoctorsData();
      setDoctorsData(data!.doctors);
      setPatientsData(data!.patients);

      const combined = combineUsersData(data!.doctors, data!.patients);
      setCombinedUsers(combined);

      const usersId = await getCurrentUserId();
      setCurrentUserId(usersId);
      setLoading(false);
    };
    getData();
  }, []);

  useEffect(() => {
    const filtered = filterUsers(combinedUsers);
    setFilteredUsers(filtered);
  }, [combinedUsers, searchQuery, statusFilter, activeTab]);

  const renderUserSpecificField = (user: CombinedUser) => {
    if (user.userType === "doctor") {
      return (user as DoctorProfile).specialty || "N/A";
    } else {
      // For patients, you might want to show medical record number, age, or other patient-specific info
      return "N/A";
    }
  };

  const renderUserProfileLink = (user: CombinedUser) => {
    if (user.userType === "doctor") {
      return (
        <Link href={`/users/${user.id}`}>
          <Typography
            variant="body2"
            sx={{ color: "#2563eb", cursor: "pointer" }}
          >
            View Doctor Profile
          </Typography>
        </Link>
      );
    } else {
      return (
        <Link href={`/users/${user.id}`}>
          <Typography
            variant="body2"
            sx={{ color: "#2563eb", cursor: "pointer" }}
          >
            View Patient Profile
          </Typography>
        </Link>
      );
    }
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
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h1" sx={{ mb: 1 }}>
            Users Management
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b" }}>
            Manage doctors, patients, roles, and permissions.
          </Typography>
          <Button
            variant="contained"
            startIcon={<MessageSquare size={20} />}
            onClick={() => setMessageModalOpen(true)}
            sx={{
              mt: 2,
              backgroundColor: "#2563eb",
              "&:hover": {
                backgroundColor: "#1d4ed8",
              },
            }}
          >
            Send Message
          </Button>
        </Box>

        {/* User Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {userStats.map((stat, index) => {
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

        <Card>
          <CardContent>
            {/* Header with Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label={`All Users (${combinedUsers.length})`} />
                <Tab label={`Doctors (${doctorsData.length})`} />
                <Tab label={`Patients (${patientsData.length})`} />
              </Tabs>
            </Box>

            {/* Filters */}
            <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
              <TextField
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 300 }}
                size="small"
              />

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TableContainer
              component={Paper}
              sx={{ boxShadow: "none", border: "1px solid #e2e8f0" }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                    <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                      User
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                      User ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                      Email
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                      Type
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                      Specialty/Info
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                      Phone
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                      Profile
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      sx={{ "&:hover": { backgroundColor: "#f8fafc" } }}
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              mr: 2,
                              bgcolor: getRoleColor(user.userType),
                            }}
                          >
                            {user.first_name?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500, color: "#1e293b" }}
                            >
                              {user.first_name} {user.last_name}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "#64748b" }}
                            >
                              {user.userType === "doctor"
                                ? "Doctor"
                                : "Patient"}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                          {user.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Mail size={16} color="#64748b" />
                          <Typography
                            variant="body2"
                            sx={{ ml: 1, color: "#64748b" }}
                          >
                            {user.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.userType}
                          size="small"
                          icon={
                            user.userType === "doctor" ? (
                              <Stethoscope size={16} />
                            ) : (
                              <Heart size={16} />
                            )
                          }
                          sx={{
                            backgroundColor: `${getRoleColor(user.userType)}15`,
                            color: getRoleColor(user.userType),
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                          {renderUserSpecificField(user)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                          {user.phone || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            user.status === "approved"
                              ? "Approved"
                              : user.status === "suspended"
                              ? "Suspended"
                              : "Pending"
                          }
                          size="small"
                          sx={{
                            backgroundColor: `${getStatusColor(
                              user?.status!
                            )}15`,
                            color: getStatusColor(user?.status!),
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell>{renderUserProfileLink(user)}</TableCell>
                      <TableCell>
                        <ActionsDropdown
                          onView={() => handleViewUser(user)}
                          onEdit={() => handleViewUser(user)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        sx={{ textAlign: "center", py: 4 }}
                      >
                        <Typography variant="body1" sx={{ color: "#64748b" }}>
                          No users found matching your criteria.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <UserDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          // @ts-ignore

          user={selectedUser}
          // @ts-ignore

          onSave={handleSaveUser}
          loading={loading}
        />
        <MessageModal
          isOpen={messageModalOpen}
          onClose={() => setMessageModalOpen(false)}
          // @ts-ignore

          users={combinedUsers}
          onSendMessage={handleSendMessage}
          loading={sendingMessage}
        />
      </Container>
    </DashboardLayout>
  );
}
