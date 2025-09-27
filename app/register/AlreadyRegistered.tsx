import React from "react";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface AlreadyRegisteredProps {
  onLoginClick?: () => void;
  onSupportClick?: () => void;
}

const AlreadyRegistered: React.FC<AlreadyRegisteredProps> = ({
  onLoginClick,
  onSupportClick,
}) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
      <Card sx={{ maxWidth: 500, p: 3, textAlign: "center", borderRadius: 3 }}>
        <CardContent>
          <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Already Registered
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Your account is already registered with us.
          </Typography>
          <Box display="flex" justifyContent="center" gap={2}>
            <Button
              variant="contained"
              color="primary"
              disabled
              onClick={onLoginClick}
            >
              Go to Mobile App
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onSupportClick}
            >
              Contact Support
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AlreadyRegistered;
