'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Avatar,
} from '@mui/material';
import { User as UserIcon } from 'lucide-react';
import { User } from '../../types/notification';

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (user: Omit<User, 'id'>) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'User',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      onAdd(formData);
      setFormData({ name: '', email: '', role: 'User' });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', role: 'User' });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: '#2563eb', mr: 2 }}>
            <UserIcon size={20} />
          </Avatar>
          <Typography variant="h6">Add New User</Typography>
        </Box>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              fullWidth
            />
            
            <TextField
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              fullWidth
            />
            
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Administrator">Administrator</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Add User
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};