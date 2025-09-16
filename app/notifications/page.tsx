"use client";

import React, { useState } from "react";
import { Container } from "@mui/material";
import { DashboardLayout } from "../components/Layout/DashboardLayout";

import { NotificationDrawer } from "../components/Drawers/NotificationDrawer";
import { mockNotifications } from "../data/mockData";
import { Notification } from "../types/notification";

import { NotificationsList } from "../components/Modals/NotificationsModal";

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <NotificationsList />
        <NotificationDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          notification={selectedNotification}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDeleteNotification}
        />
      </Container>
    </DashboardLayout>
  );
}
