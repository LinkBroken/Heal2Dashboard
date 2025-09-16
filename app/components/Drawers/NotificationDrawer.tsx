'use client';

import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Button,
  Avatar,
  Stack,
} from '@mui/material';
import { X, Clock, User, Tag, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { Notification } from '../../types/notification';

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
  notification: Notification | null;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  open,
  onClose,
  notification,
  onMarkAsRead,
  onDelete,
}) => {
  if (!notification) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info size={20} />;
      case 'success': return <CheckCircle size={20} />;
      case 'warning': return <AlertTriangle size={20} />;
      case 'error': return <AlertCircle size={20} />;
      default: return <Info size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return '#0891b2';
      case 'success': return '#059669';
      case 'warning': return '#d97706';
      case 'error': return '#dc2626';
      default: return '#0891b2';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#d97706';
      case 'low': return '#059669';
      default: return '#64748b';
    }
  };

  const handleMarkAsRead = () => {
    onMarkAsRead(notification.id);
    onClose();
  };

  const handleDelete = () => {
    onDelete(notification.id);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 400,
          maxWidth: '90vw',
        },
      }}
    >
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notification Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <X size={20} />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flexGrow: 1 }}>
          {/* Type and Priority */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{
                backgroundColor: `${getTypeColor(notification.type)}15`,
                color: getTypeColor(notification.type),
                mr: 2,
              }}
            >
              {getTypeIcon(notification.type)}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ color: '#64748b', textTransform: 'capitalize' }}>
                {notification.type} Notification
              </Typography>
              <Chip
                label={notification.priority}
                size="small"
                sx={{
                  backgroundColor: `${getPriorityColor(notification.priority)}15`,
                  color: getPriorityColor(notification.priority),
                  fontWeight: 500,
                  textTransform: 'capitalize',
                  mt: 0.5,
                }}
              />
            </Box>
          </Box>

          {/* Title */}
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#1e293b' }}>
            {notification.title}
          </Typography>

          {/* Message */}
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6, color: '#475569' }}>
            {notification.message}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Metadata */}
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Clock size={16} color="#64748b" />
              <Typography variant="body2" sx={{ ml: 1, color: '#64748b' }}>
                {notification.timestamp.toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tag size={16} color="#64748b" />
              <Typography variant="body2" sx={{ ml: 1, color: '#64748b' }}>
                Category: {notification.category}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <User size={16} color="#64748b" />
              <Typography variant="body2" sx={{ ml: 1, color: '#64748b' }}>
                Status: {notification.read ? 'Read' : 'Unread'}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Actions */}
        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #e2e8f0' }}>
          <Stack spacing={2}>
            {!notification.read && (
              <Button
                variant="contained"
                fullWidth
                onClick={handleMarkAsRead}
                sx={{ mb: 1 }}
              >
                Mark as Read
              </Button>
            )}
            
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={handleDelete}
            >
              Delete Notification
            </Button>
          </Stack>
        </Box>
      </Box>
    </Drawer>
  );
};