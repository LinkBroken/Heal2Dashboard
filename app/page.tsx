"use client";

import React from "react";
import { Container, Typography, Box, Button, Paper } from "@mui/material";
import Link from "next/link";
import { PersonAdd } from "@mui/icons-material";

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Typography variant="h3" color="white" fontWeight="bold">
              H
            </Typography>
          </Box>

          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            Heal2Gether
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            Welcome to Heal2Gether. Join our network of healthcare professionals today.
          </Typography>

          <Box sx={{ mt: 2, display: "flex", gap: 2, flexDirection: "column", width: "100%" }}>
            <Link href="/register" passHref style={{ width: "100%" }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<PersonAdd />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1.1rem",
                }}
              >
                Register as a Doctor
              </Button>
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
