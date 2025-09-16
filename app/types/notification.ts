export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
  read: boolean;
  category: string;
  avatar?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  highPriority: number;
  readToday: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  type: 'analytics' | 'performance' | 'security' | 'usage';
  createdAt: Date;
  status: 'pending' | 'completed' | 'failed';
}