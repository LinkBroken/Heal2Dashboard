import {
  Notification,
  NotificationStats,
  User,
  Report,
} from "../types/notification";

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "System Maintenance Scheduled",
    message:
      "Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM EST. Please save your work.",
    type: "warning",
    priority: "high",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    category: "System",
  },
  {
    id: "2",
    title: "New User Registration",
    message:
      "A new user has registered and is waiting for approval. Please review their information.",
    type: "info",
    priority: "medium",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: false,
    category: "Users",
  },
  {
    id: "3",
    title: "Security Alert",
    message:
      "Multiple failed login attempts detected for user account. Account has been temporarily locked.",
    type: "error",
    priority: "high",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: true,
    category: "Security",
  },
  {
    id: "4",
    title: "Backup Completed Successfully",
    message:
      "Daily database backup has been completed successfully. All data is secure.",
    type: "success",
    priority: "low",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    read: true,
    category: "System",
  },
  {
    id: "5",
    title: "Policy Update Required",
    message:
      "Privacy policy has been updated. Please review the changes and acknowledge them.",
    type: "info",
    priority: "medium",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    read: false,
    category: "Legal",
  },
  {
    id: "6",
    title: "Server Performance Alert",
    message:
      "Server CPU usage has exceeded 85% for the past 15 minutes. Consider scaling resources.",
    type: "warning",
    priority: "high",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    read: false,
    category: "Performance",
  },
];

export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@company.com",
    role: "Administrator",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "Manager",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@company.com",
    role: "User",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    role: "User",
  },
];

export const mockReports: Report[] = [
  {
    id: "1",
    title: "Monthly Analytics Report",
    description:
      "Comprehensive analytics report for the current month including user engagement and system performance.",
    type: "analytics",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: "completed",
  },
  {
    id: "2",
    title: "Security Audit Report",
    description:
      "Security assessment report covering vulnerabilities and recommendations.",
    type: "security",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    status: "pending",
  },
  {
    id: "3",
    title: "Performance Metrics",
    description: "System performance metrics and optimization recommendations.",
    type: "performance",
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    status: "completed",
  },
];

export const mockStats: NotificationStats = {
  total: mockNotifications.length,
  unread: mockNotifications.filter((n) => !n.read).length,
  highPriority: mockNotifications.filter((n) => n.priority === "high").length,
  readToday: mockNotifications.filter((n) => {
    const today = new Date();
    const notificationDate = new Date(n.timestamp);
    return n.read && notificationDate.toDateString() === today.toDateString();
  }).length,
};
