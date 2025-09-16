'use client';

import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import { Bell, Mail, AlertTriangle, CheckCircle } from 'lucide-react';
import { NotificationStats } from '../../types/notification';

interface StatsCardsProps {
  stats: NotificationStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const statsData = [
    {
      title: 'Total Notifications',
      value: stats.total,
      icon: Bell,
      color: '#2563eb',
      bgColor: '#eff6ff',
    },
    {
      title: 'Unread',
      value: stats.unread,
      icon: Mail,
      color: '#d97706',
      bgColor: '#fef3c7',
    },
    {
      title: 'High Priority',
      value: stats.highPriority,
      icon: AlertTriangle,
      color: '#dc2626',
      bgColor: '#fee2e2',
    },
    {
      title: 'Read Today',
      value: stats.readToday,
      icon: CheckCircle,
      color: '#059669',
      bgColor: '#d1fae5',
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
                  <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};