import React from 'react';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Button,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

const indianStates = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

const membershipStatuses = ['Active', 'Inactive', 'Suspended', 'Pending'];

const BarCouncilInfoStep = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleFileUpload = (files) => {
    if (files && files.length > 0) {
      // In a real implementation, you would upload the files and get the URLs
      const fileNames = Array.from(files).map((file) => file.name);
      onChange({
        ...data,
        barCertificateUrl: [...(data.barCertificateUrl || []), ...fileNames],
      });
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Enter your Bar Council registration details
      </Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <TextField
            label="Bar Enrollment Number"
            fullWidth
            size="small"
            value={data.barEnrollmentNumber}
            onChange={(e) => handleChange('barEnrollmentNumber', e.target.value)}
            placeholder="e.g., MH/12345/2015"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Bar Council State"
            fullWidth
            size="small"
            value={data.barState}
            onChange={(e) => handleChange('barState', e.target.value)}
          >
            {indianStates.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Enrollment Year"
            fullWidth
            size="small"
            type="number"
            value={data.enrollmentYear}
            onChange={(e) => handleChange('enrollmentYear', e.target.value)}
            placeholder="e.g., 2015"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Membership Status"
            fullWidth
            size="small"
            value={data.barMembership}
            onChange={(e) => handleChange('barMembership', e.target.value)}
          >
            {membershipStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <input
            type="file"
            id="bar-certificate"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handleFileUpload(e.target.files)}
          />
          <label htmlFor="bar-certificate">
            <Button
              component="span"
              variant="outlined"
              fullWidth
              startIcon={<CloudUploadIcon />}
              sx={{
                height: 40,
                borderStyle: 'dashed',
                textTransform: 'none',
              }}
            >
              Upload Bar Certificate
            </Button>
          </label>
        </Grid>

        {data.barCertificateUrl?.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Uploaded: {data.barCertificateUrl.join(', ')}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default BarCouncilInfoStep;

