import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

interface RegistrationSuccessModalProps {
  open: boolean;
  onClose: () => void;
  onGoToLogin?: () => void;
}

const RegistrationSuccessModal: React.FC<RegistrationSuccessModalProps> = ({
  open,
  onClose,
  onGoToLogin,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 2, textAlign: "center" },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <CheckCircleIcon color="success" sx={{ fontSize: 70, mb: 2 }} />
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Registration Successful!
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Your doctor account has been created successfully. You need to wait
          for the approval of the admin.
        </Typography>
        <Box display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" color="primary" onClick={onGoToLogin}>
            Congratulations
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationSuccessModal;
