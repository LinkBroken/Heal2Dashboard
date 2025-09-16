'use client';

import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { MoreVertical, Eye, Edit2, Trash2, MailOpen, Archive, Flag } from 'lucide-react';

interface ActionsDropdownProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onMarkAsRead?: () => void;
  onArchive?: () => void;
  onFlag?: () => void;
  showMarkAsRead?: boolean;
  showArchive?: boolean;
  showFlag?: boolean;
}

export const ActionsDropdown: React.FC<ActionsDropdownProps> = ({
  onView,
  onEdit,
  onDelete,
  onMarkAsRead,
  onArchive,
  onFlag,
  showMarkAsRead = false,
  showArchive = false,
  showFlag = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: () => void) => {
    action();
    handleClose();
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        sx={{ color: '#64748b' }}
      >
        <MoreVertical size={16} />
      </IconButton>
      
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
        {onView && (
          <MenuItem onClick={() => handleAction(onView)}>
            <ListItemIcon>
              <Eye size={16} />
            </ListItemIcon>
            <ListItemText primary="View Details" />
          </MenuItem>
        )}
        
        {onEdit && (
          <MenuItem onClick={() => handleAction(onEdit)}>
            <ListItemIcon>
              <Edit2 size={16} />
            </ListItemIcon>
            <ListItemText primary="Edit" />
          </MenuItem>
        )}
        
        {showMarkAsRead && onMarkAsRead && (
          <MenuItem onClick={() => handleAction(onMarkAsRead)}>
            <ListItemIcon>
              <MailOpen size={16} />
            </ListItemIcon>
            <ListItemText primary="Mark as Read" />
          </MenuItem>
        )}
        
        {showArchive && onArchive && (
          <MenuItem onClick={() => handleAction(onArchive)}>
            <ListItemIcon>
              <Archive size={16} />
            </ListItemIcon>
            <ListItemText primary="Archive" />
          </MenuItem>
        )}
        
        {showFlag && onFlag && (
          <MenuItem onClick={() => handleAction(onFlag)}>
            <ListItemIcon>
              <Flag size={16} />
            </ListItemIcon>
            <ListItemText primary="Flag" />
          </MenuItem>
        )}
        
        {(onView || onEdit || showMarkAsRead || showArchive || showFlag) && onDelete && <Divider />}
        
        {onDelete && (
          <MenuItem onClick={() => handleAction(onDelete)} sx={{ color: '#dc2626' }}>
            <ListItemIcon>
              <Trash2 size={16} color="#dc2626" />
            </ListItemIcon>
            <ListItemText primary="Delete" />
          </MenuItem>
        )}
      </Menu>
    </>
  );
};