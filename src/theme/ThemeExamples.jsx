import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Chip,
  Alert,
  TextField,
  Avatar,
  Paper,
  Grid,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Gavel as GavelIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
} from '@mui/icons-material';

/**
 * Theme Usage Examples for Counvo Lawyer App
 * This component demonstrates how to properly use the theme
 * NOTE: ALL EXAMPLES USE SOLID COLORS - NO GRADIENTS
 */

const ThemeExamples = () => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 4, backgroundColor: theme.palette.background.default }}>
      {/* Section 1: Buttons */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="600">
          Button Examples
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          {/* Primary Button - Yellow/Amber */}
          <Button variant="contained" color="primary" startIcon={<GavelIcon />}>
            Book Consultation
          </Button>

          {/* Secondary Button - Navy Blue */}
          <Button variant="contained" color="secondary">
            View Profile
          </Button>

          {/* Outlined Primary */}
          <Button variant="outlined" color="primary">
            Learn More
          </Button>

          {/* Text Button */}
          <Button variant="text" color="primary">
            Cancel
          </Button>

          {/* Success */}
          <Button variant="contained" color="success" startIcon={<CheckCircleIcon />}>
            Approve
          </Button>

          {/* Error */}
          <Button variant="contained" color="error">
            Reject
          </Button>
        </Stack>
      </Paper>

      {/* Section 2: Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Premium Card - Solid Yellow */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              borderRadius: 3,
              border: `2px solid ${theme.palette.primary.dark}`,
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <StarIcon />
                <Typography variant="h6" fontWeight="700">
                  Premium Lawyer
                </Typography>
              </Stack>
              <Typography variant="body2">
                Top-rated professional with 15+ years of experience
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: theme.palette.secondary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.dark,
                  },
                }}
              >
                Contact Now
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Professional Card - Solid Navy */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.secondary.contrastText,
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="700" gutterBottom>
                Legal Services
              </Typography>
              <Typography variant="body2">
                Comprehensive legal solutions for individuals and businesses
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                Explore Services
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Clean Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="700" gutterBottom>
                Standard Plan
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Essential legal consultation services for your needs
              </Typography>
              <Button variant="outlined" color="primary" fullWidth>
                Get Started
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Section 3: Chips & Status */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="600">
          Status Indicators
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Chip label="Active Case" color="primary" />
          <Chip label="Verified" color="success" icon={<CheckCircleIcon />} />
          <Chip label="Pending" color="warning" />
          <Chip label="Closed" color="error" />
          <Chip label="Premium Member" color="secondary" />
          <Chip
            label="Top Rated"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              fontWeight: 600,
              border: `2px solid ${theme.palette.primary.dark}`,
            }}
            icon={<StarIcon />}
          />
        </Stack>
      </Paper>

      {/* Section 4: Alerts */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="600">
          Alert Messages
        </Typography>
        <Stack spacing={2}>
          <Alert severity="success">
            Your consultation has been successfully booked!
          </Alert>
          <Alert severity="warning">
            Please complete your profile to access all features
          </Alert>
          <Alert severity="error">
            Payment failed. Please try again or contact support
          </Alert>
          <Alert severity="info">
            New lawyer recommendations available based on your case
          </Alert>
        </Stack>
      </Paper>

      {/* Section 5: Form Elements */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="600">
          Form Elements
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Case Description"
              variant="outlined"
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Section 6: Profile Cards */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="600">
          Lawyer Profile Card
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            p: 3,
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            '&:hover': {
              boxShadow: theme.shadows[4],
            },
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              backgroundColor: theme.palette.primary.main,
              fontSize: '2rem',
              fontWeight: 700,
              border: `3px solid ${theme.palette.primary.dark}`,
            }}
          >
            AS
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="700">
              Adv. Arun Sharma
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Criminal Law Specialist • 15 years experience
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Chip
                size="small"
                label="Premium"
                color="primary"
                icon={<StarIcon />}
              />
              <Chip size="small" label="Verified" color="success" />
              <Chip size="small" label="100% Success Rate" />
            </Stack>
          </Box>
          <Button variant="contained" color="primary">
            Consult Now
          </Button>
        </Box>
      </Paper>

      {/* Section 7: Typography Scale */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h1" gutterBottom>
          Heading 1
        </Typography>
        <Typography variant="h2" gutterBottom>
          Heading 2
        </Typography>
        <Typography variant="h3" gutterBottom>
          Heading 3
        </Typography>
        <Typography variant="h4" gutterBottom>
          Heading 4
        </Typography>
        <Typography variant="h5" gutterBottom>
          Heading 5
        </Typography>
        <Typography variant="h6" gutterBottom>
          Heading 6
        </Typography>
        <Typography variant="body1" gutterBottom>
          Body 1: Regular body text with standard weight and size
        </Typography>
        <Typography variant="body2" gutterBottom>
          Body 2: Smaller body text for secondary content
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          Caption: Small text for labels and hints
        </Typography>
        <Typography variant="overline" display="block">
          Overline: Uppercase text for section labels
        </Typography>
      </Paper>
    </Box>
  );
};

export default ThemeExamples;

