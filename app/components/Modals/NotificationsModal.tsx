import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Chip,
  Box,
  Card,
  CardContent,
  IconButton,
  Badge,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  Notifications,
  Mail,
  Campaign,
  Schedule,
  MarkEmailRead,
  MarkEmailUnread,
} from "@mui/icons-material";
import {
  getUserNotifications,
  markNotificationAsRead,
  getCurrentUserId,
} from "@/app/actions/sendMessage";

interface Notification {
  id: string;
  sender_id: string;
  recipient_ids: string[] | null;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  read_at: string | null;
  profiles: {
    first_name: string;
    last_name: string;
  };
}

interface NotificationsListProps {
  userId?: string;
  maxHeight?: number;
  showHeader?: boolean;
}

export const NotificationsList: React.FC<NotificationsListProps> = ({
  userId,
  maxHeight = 400,
  showHeader = true,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <Mail />;
      case "announcement":
        return <Campaign />;
      case "reminder":
        return <Schedule />;
      default:
        return <Notifications />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "message":
        return "primary";
      case "announcement":
        return "warning";
      case "reminder":
        return "info";
      case "system":
        return "secondary";
      default:
        return "default";
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    if (!currentUserId) return;

    try {
      await markNotificationAsRead(notificationId, currentUserId);

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                is_read: true,
                read_at: new Date().toISOString(),
              }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const loadNotifications = async () => {
    try {
      const userIdToUse = userId || currentUserId;
      if (!userIdToUse) return;

      const result = await getUserNotifications(userIdToUse);
      if (result.success && result.data) {
        setNotifications(result.data);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      if (!userId) {
        try {
          const id = await getCurrentUserId();
          setCurrentUserId(id);
        } catch (error) {
          console.error("Error getting current user:", error);
          setLoading(false);
        }
      } else {
        setCurrentUserId(userId);
      }
    };

    initializeUser();
  }, [userId]);

  useEffect(() => {
    if (currentUserId || userId) {
      loadNotifications();
    }
  }, [currentUserId, userId]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={200}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      {showHeader && (
        <CardContent sx={{ pb: 1 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" component="div">
              <Badge badgeContent={unreadCount} color="error">
                <Notifications sx={{ mr: 1 }} />
              </Badge>
              Notifications
            </Typography>
            <Button size="small" onClick={loadNotifications} disabled={loading}>
              Refresh
            </Button>
          </Box>
        </CardContent>
      )}

      <Box sx={{ maxHeight, overflow: "auto" }}>
        {notifications.length === 0 ? (
          <Box p={3} textAlign="center">
            <Notifications
              sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="body1" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <List>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    bgcolor: notification.is_read
                      ? "transparent"
                      : "action.hover",
                    "&:hover": { bgcolor: "action.selected" },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: notification.is_read
                          ? "grey.400"
                          : "primary.main",
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: notification.is_read
                              ? "normal"
                              : "bold",
                          }}
                        >
                          {notification.title}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip
                            label={notification.type}
                            size="small"
                            color={
                              getNotificationColor(notification.type) as any
                            }
                            variant="outlined"
                          />
                          {!notification.is_read && (
                            <IconButton
                              size="small"
                              onClick={() => handleMarkAsRead(notification.id)}
                              title="Mark as read"
                            >
                              <MarkEmailRead fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {notification.message}
                        </Typography>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="caption" color="text.secondary">
                            From: {notification.profiles.first_name}{" "}
                            {notification.profiles.last_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(
                              notification.created_at
                            ).toLocaleDateString()}{" "}
                            at{" "}
                            {new Date(
                              notification.created_at
                            ).toLocaleTimeString()}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Card>
  );
};
