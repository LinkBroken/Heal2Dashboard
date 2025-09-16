"use client";

import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Box,
} from "@mui/material";
import { Menu, Search, Bell, User } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, sidebarOpen }) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onMenuClick}
          edge="start"
          sx={{ mr: 2, color: "#64748b" }}
        >
          <Menu size={24} />
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ flexGrow: 1, color: "#1e293b", fontWeight: 600 }}
        >
          Application Management{" "}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
