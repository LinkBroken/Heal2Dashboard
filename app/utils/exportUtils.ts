import { Notification } from '../types/notification';

export const exportToCSV = (notifications: Notification[], filename: string = 'notifications') => {
  const headers = [
    'ID',
    'Title',
    'Message',
    'Type',
    'Priority',
    'Category',
    'Status',
    'Timestamp',
  ];

  const csvContent = [
    headers.join(','),
    ...notifications.map(notification => [
      notification.id,
      `"${notification.title.replace(/"/g, '""')}"`,
      `"${notification.message.replace(/"/g, '""')}"`,
      notification.type,
      notification.priority,
      notification.category,
      notification.read ? 'Read' : 'Unread',
      notification.timestamp.toISOString(),
    ].join(','))
  ].join('\n');

  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
};

export const exportToJSON = (notifications: Notification[], filename: string = 'notifications') => {
  const jsonContent = JSON.stringify(notifications, null, 2);
  downloadFile(jsonContent, `${filename}.json`, 'application/json');
};

export const exportToPDF = async (notifications: Notification[], filename: string = 'notifications') => {
  // Simple text-based PDF content
  const content = [
    'NOTIFICATIONS REPORT',
    '===================',
    '',
    `Generated: ${new Date().toLocaleString()}`,
    `Total Notifications: ${notifications.length}`,
    '',
    ...notifications.map((notification, index) => [
      `${index + 1}. ${notification.title}`,
      `   Type: ${notification.type} | Priority: ${notification.priority}`,
      `   Status: ${notification.read ? 'Read' : 'Unread'} | Category: ${notification.category}`,
      `   Date: ${notification.timestamp.toLocaleString()}`,
      `   Message: ${notification.message}`,
      '',
    ].flat())
  ].join('\n');

  downloadFile(content, `${filename}.txt`, 'text/plain');
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};