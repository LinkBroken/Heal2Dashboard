import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Avatar,
  Chip,
  Box,
  Typography,
  Divider,
  InputAdornment,
  Card,
  CardContent,
  Alert,
  Tabs,
  Tab,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Send,
  Search,
  Person,
  Group,
  Mail,
  Notifications,
  Campaign,
  Schedule,
  Close,
  ExpandMore,
  SelectAll,
  Clear,
} from "@mui/icons-material";
import { DoctorProfile } from "@/app/types";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: DoctorProfile[];
  onSendMessage: (messageData: {
    title: string;
    message: string;
    recipientIds: string[] | null;
    type: string;
  }) => Promise<void>;
  loading?: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`message-tabpanel-${index}`}
      aria-labelledby={`message-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const MessageModal: React.FC<MessageModalProps> = ({
  isOpen,
  onClose,
  users,
  onSendMessage,
  loading = false,
}) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [notificationType, setNotificationType] = useState("message");
  const [searchTerm, setSearchTerm] = useState("");

  const notificationTypes = [
    {
      value: "message",
      label: "Message",
      icon: <Mail />,
      color: "primary" as const,
    },
    {
      value: "system",
      label: "System",
      icon: <Notifications />,
      color: "secondary" as const,
    },
    {
      value: "announcement",
      label: "Announcement",
      icon: <Campaign />,
      color: "warning" as const,
    },
    {
      value: "reminder",
      label: "Reminder",
      icon: <Schedule />,
      color: "info" as const,
    },
  ];

  const filteredUsers = users.filter(
    (user) =>
      `${user.first_name} ${user.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!title.trim() || !message.trim()) {
      return;
    }

    if (tabValue === 0 && selectedUsers.length === 0) {
      return;
    }

    try {
      await onSendMessage({
        title: title.trim(),
        message: message.trim(),
        recipientIds: tabValue === 1 ? null : selectedUsers,
        type: notificationType,
      });

      // Reset form
      setTitle("");
      setMessage("");
      setSelectedUsers([]);
      setTabValue(0);
      setNotificationType("message");
      setSearchTerm("");
      onClose();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    setSelectedUsers(filteredUsers.map((user) => user.id));
  };

  const clearSelection = () => {
    setSelectedUsers([]);
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "error";
      case "doctor":
        return "success";
      case "patient":
        return "info";
      default:
        return "default";
    }
  };

  const selectedNotificationType = notificationTypes.find(
    (type) => type.value === notificationType
  );

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: "70vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
          background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
          color: "white",
          borderRadius: "12px 12px 0 0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Send />
          <Box>
            <Typography variant="h5" component="div" fontWeight="bold">
              Send Message
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Communicate with your users effectively
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{ color: "white" }}
          disabled={loading}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            variant="fullWidth"
            sx={{ px: 3 }}
          >
            <Tab
              icon={<Person />}
              label="Individual Users"
              iconPosition="start"
              sx={{ textTransform: "none", fontWeight: 600 }}
            />
            <Tab
              icon={<Group />}
              label="Broadcast to All"
              iconPosition="start"
              sx={{ textTransform: "none", fontWeight: 600 }}
            />
          </Tabs>
        </Box>

        <Box sx={{ px: 3 }}>
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Select Recipients
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {selectedUsers.length} of {filteredUsers.length} selected
                  </Typography>
                  <Tooltip title="Select All">
                    <IconButton
                      size="small"
                      onClick={selectAllUsers}
                      disabled={loading}
                    >
                      <SelectAll />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Clear Selection">
                    <IconButton
                      size="small"
                      onClick={clearSelection}
                      disabled={loading}
                    >
                      <Clear />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <TextField
                fullWidth
                placeholder="Search users by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
                disabled={loading}
              />

              <Paper
                variant="outlined"
                sx={{
                  maxHeight: 300,
                  overflow: "auto",
                  bgcolor: "grey.50",
                }}
              >
                <List dense>
                  {filteredUsers.length === 0 ? (
                    <ListItem>
                      <ListItemText
                        primary="No users found"
                        secondary="Try adjusting your search criteria"
                        sx={{ textAlign: "center" }}
                      />
                    </ListItem>
                  ) : (
                    filteredUsers.map((user) => (
                      <ListItem key={user.id} disablePadding>
                        <ListItemButton
                          onClick={() => handleUserToggle(user.id)}
                          disabled={loading}
                        >
                          <Checkbox
                            edge="start"
                            checked={selectedUsers.includes(user.id)}
                            tabIndex={-1}
                            disableRipple
                            color="primary"
                          />
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: "primary.main" }}>
                              {user?.first_name?.charAt(0)}
                              {user?.last_name?.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={`${user.first_name} ${user.last_name}`}
                            secondary={user.email}
                          />
                          <Chip
                            label={user.role}
                            size="small"
                            color={getRoleColor(user.role)}
                            variant="outlined"
                          />
                        </ListItemButton>
                      </ListItem>
                    ))
                  )}
                </List>
              </Paper>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Alert severity="info" sx={{ mb: 2 }}>
              This message will be sent to all users in the system. Use this
              option for important announcements or system-wide notifications.
            </Alert>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                bgcolor: "grey.50",
                borderRadius: 2,
              }}
            >
              <Group color="primary" />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Broadcasting to All Users
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {users.length} users will receive this message
                </Typography>
              </Box>
            </Box>
          </TabPanel>

          {/* Message Type Selection */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Message Type
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={notificationType}
                onChange={(e) => setNotificationType(e.target.value)}
                row
              >
                {notificationTypes.map((type) => (
                  <FormControlLabel
                    key={type.value}
                    value={type.value}
                    control={<Radio color={type.color} />}
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {type.icon}
                        {type.label}
                      </Box>
                    }
                    disabled={loading}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>

          {/* Message Form */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Message Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a clear and descriptive title"
              required
              disabled={loading}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Message Content"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              multiline
              rows={4}
              required
              disabled={loading}
              helperText={`${message.length} characters`}
            />
          </Box>

          {/* Message Preview */}
          {(title || message) && (
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {selectedNotificationType?.icon}
                  <Typography variant="subtitle1" fontWeight="bold">
                    Message Preview
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Card variant="outlined">
                  <CardContent>
                    {title && (
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                        {title}
                      </Typography>
                    )}
                    {message && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {message}
                      </Typography>
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Chip
                        label={selectedNotificationType?.label}
                        size="small"
                        color={selectedNotificationType?.color}
                        icon={selectedNotificationType?.icon}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Just now
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </AccordionDetails>
            </Accordion>
          )}
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          size="large"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            loading ||
            !title.trim() ||
            !message.trim() ||
            (tabValue === 0 && selectedUsers.length === 0)
          }
          startIcon={loading ? <CircularProgress size={20} /> : <Send />}
          size="large"
          sx={{
            background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
            minWidth: 140,
          }}
        >
          {loading ? "Sending..." : "Send Message"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
