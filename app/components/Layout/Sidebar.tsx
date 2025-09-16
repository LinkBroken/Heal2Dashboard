"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Avatar,
  Divider,
} from "@mui/material";
import {
  LayoutDashboard,
  Users,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";
import { createClient } from "@/app/utils/supabase/client";
import { Schedule } from "@mui/icons-material";

const drawerWidth = 280;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const pathname = usePathname();
  const supabase = createClient();
  const menuItems = [
    { icon: LayoutDashboard, text: "Dashboard", href: "/" },
    { icon: Users, text: "Users", href: "/users" },
    { icon: Bell, text: "Notifications", href: "/notifications" },
    { icon: BarChart3, text: "Appointments", href: "/reports" },
    { icon: Schedule, text: "Schedules", href: "/doctors" },
  ];

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Shield size={32} color="#2563eb" />
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, mt: 1, color: "#1e293b" }}
        >
          Professional
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b" }}>
          Dashboard
        </Typography>
      </Box>

      <Divider />

      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                sx={{
                  borderRadius: 2,
                  backgroundColor: isActive ? "#f1f5f9" : "transparent",
                  color: isActive ? "#2563eb" : "#64748b",
                  "&:hover": {
                    backgroundColor: "#f8fafc",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                  <Icon size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ mt: "auto", p: 2 }}>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: "flex", alignItems: "center", mb: 2, p: 1 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              mr: 2,
              bgcolor: "#2563eb",
            }}
          >
            A
          </Avatar>
          <Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: "#1e293b" }}
            >
              Admin
            </Typography>
          </Box>
        </Box>

        <ListItemButton
          sx={{
            borderRadius: 2,
            color: "#64748b",
            "&:hover": {
              backgroundColor: "#f8fafc",
            },
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
            <LogOut size={20} />
          </ListItemIcon>
          <ListItemText
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.reload();
            }}
            primary="Sign Out"
            primaryTypographyProps={{ fontSize: "0.9rem" }}
          />
        </ListItemButton>
      </Box>
    </Drawer>
  );
};
