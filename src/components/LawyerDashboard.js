import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Stack,
} from "@mui/material";
import {
  People as PeopleIcon,
  Gavel as GavelIcon,
  HourglassEmpty as PendingIcon,
  CheckCircle as CompletedIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from "@mui/icons-material";
import useAuth from "../hooks/useAuth";

const LawyerDashboard = () => {
  // Static data
  const { userFullName } = useAuth();
  const lawyerName = userFullName || "";

  const lastLogin = "2 hours ago";
  const sessionTime = "3.5 hours";

  // Static statistics data
  const stats = [
    {
      label: "Total Clients",
      value: 48,
      change: "+12%",
      isPositive: true,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: "primary.main",
    },
    {
      label: "Active Cases",
      value: 12,
      change: "+8%",
      isPositive: true,
      icon: <GavelIcon sx={{ fontSize: 40 }} />,
      color: "success.main",
    },
    {
      label: "Pending Cases",
      value: 5,
      change: "-3%",
      isPositive: false,
      icon: <PendingIcon sx={{ fontSize: 40 }} />,
      color: "warning.main",
    },
    {
      label: "Completed Cases",
      value: 28,
      change: "+15%",
      isPositive: true,
      icon: <CompletedIcon sx={{ fontSize: 40 }} />,
      color: "info.main",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" fontWeight="700" gutterBottom>
            Welcome back, {lawyerName}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Here's what's happening with your practice today.
          </Typography>

          {/* Login Info */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            sx={{
              mt: 2,
              pt: 2,
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>🕒</Typography>
              <Typography variant="body2" color="text.secondary">
                Last login: {lastLogin}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>⏱️</Typography>
              <Typography variant="body2" color="text.secondary">
                Today's session: {sessionTime}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography>📊</Typography>
              <Typography variant="body2" color="text.secondary">
                Status: <Chip label="Online" color="success" size="small" />
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: "100%",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 2,
                      bgcolor: `${stat.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>

                  <Box>
                    <Typography
                      variant="h3"
                      fontWeight="700"
                      color={stat.color}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight="600"
                      textTransform="uppercase"
                      letterSpacing={0.5}
                    >
                      {stat.label}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={0.5} alignItems="center">
                    {stat.isPositive ? (
                      <TrendingUpIcon
                        sx={{ fontSize: 16, color: "success.main" }}
                      />
                    ) : (
                      <TrendingDownIcon
                        sx={{ fontSize: 16, color: "error.main" }}
                      />
                    )}
                    <Typography
                      variant="caption"
                      fontWeight="600"
                      color={stat.isPositive ? "success.main" : "error.main"}
                    >
                      {stat.change}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.isPositive ? "from last period" : "from last week"}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LawyerDashboard;
