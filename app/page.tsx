"use client";

import React from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { DashboardLayout } from "./components/Layout/DashboardLayout";
import { StatsCards } from "./components/Dashboard/StatsCards";
import { mockStats, mockNotifications } from "./data/mockData";
import { TrendingUp, Users, Activity, Shield } from "lucide-react";

export default function Dashboard() {
  const quickStats = [
    {
      title: "System Health",
      value: "98.5%",
      icon: Activity,
      color: "#059669",
      bgColor: "#d1fae5",
    },
    {
      title: "Active Users",
      value: "1,234",
      icon: Users,
      color: "#2563eb",
      bgColor: "#eff6ff",
    },
    {
      title: "Growth Rate",
      value: "+12.5%",
      icon: TrendingUp,
      color: "#059669",
      bgColor: "#d1fae5",
    },
    {
      title: "Security Score",
      value: "95/100",
      icon: Shield,
      color: "#2563eb",
      bgColor: "#eff6ff",
    },
  ];
  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h1" sx={{ mb: 1 }}>
            Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b" }}>
            Welcome back! Here's what's happening with your system today.
          </Typography>
        </Box>

        <StatsCards stats={mockStats} />

        <Grid container spacing={3}>
          {quickStats.map((stat, index) => {
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
                        variant="h4"
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

        <Box sx={{ mt: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Recent Activity
              </Typography>
              <Typography variant="body1" sx={{ color: "#64748b" }}>
                System is running smoothly. All services are operational and
                performing within normal parameters.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </DashboardLayout>
  );
}
