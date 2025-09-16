'use client';

import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { Download, FileText, Database, FileSpreadsheet } from 'lucide-react';
import { Notification } from '../../types/notification';
import { exportToCSV, exportToJSON, exportToPDF } from '../../utils/exportUtils';

interface DownloadMenuProps {
  notifications: Notification[];
  filteredNotifications: Notification[];
}

export const DownloadMenu: React.FC<DownloadMenuProps> = ({ 
  notifications, 
  filteredNotifications 
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (format: 'csv' | 'json' | 'pdf', useFiltered: boolean = false) => {
    const dataToExport = useFiltered ? filteredNotifications : notifications;
    const filename = `notifications_${new Date().toISOString().split('T')[0]}`;
    
    switch (format) {
      case 'csv':
        exportToCSV(dataToExport, filename);
        break;
      case 'json':
        exportToJSON(dataToExport, filename);
        break;
      case 'pdf':
        exportToPDF(dataToExport, filename);
        break;
    }
    
    handleClose();
  };

  const hasFilters = filteredNotifications.length !== notifications.length;

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<Download size={16} />}
        onClick={handleClick}
        sx={{ color: '#64748b', borderColor: '#e2e8f0' }}
      >
        Export
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleExport('csv')}>
          <ListItemIcon>
            <FileSpreadsheet size={16} />
          </ListItemIcon>
          <ListItemText 
            primary="Export as CSV" 
            secondary={`${notifications.length} notifications`}
          />
        </MenuItem>
        
        <MenuItem onClick={() => handleExport('json')}>
          <ListItemIcon>
            <Database size={16} />
          </ListItemIcon>
          <ListItemText 
            primary="Export as JSON" 
            secondary={`${notifications.length} notifications`}
          />
        </MenuItem>
        
        <MenuItem onClick={() => handleExport('pdf')}>
          <ListItemIcon>
            <FileText size={16} />
          </ListItemIcon>
          <ListItemText 
            primary="Export as Text" 
            secondary={`${notifications.length} notifications`}
          />
        </MenuItem>
        
        {hasFilters && (
          <>
            <Divider />
            <MenuItem onClick={() => handleExport('csv', true)}>
              <ListItemIcon>
                <FileSpreadsheet size={16} />
              </ListItemIcon>
              <ListItemText 
                primary="Export Filtered (CSV)" 
                secondary={`${filteredNotifications.length} notifications`}
              />
            </MenuItem>
            
            <MenuItem onClick={() => handleExport('json', true)}>
              <ListItemIcon>
                <Database size={16} />
              </ListItemIcon>
              <ListItemText 
                primary="Export Filtered (JSON)" 
                secondary={`${filteredNotifications.length} notifications`}
              />
            </MenuItem>
            
            <MenuItem onClick={() => handleExport('pdf', true)}>
              <ListItemIcon>
                <FileText size={16} />
              </ListItemIcon>
              <ListItemText 
                primary="Export Filtered (Text)" 
                secondary={`${filteredNotifications.length} notifications`}
              />
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};