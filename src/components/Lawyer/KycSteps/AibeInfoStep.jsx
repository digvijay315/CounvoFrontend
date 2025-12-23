import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import FileUpload from '../../shared/FileUpload';

const AibeInfoStep = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleFileChange = (urls) => {
    onChange({
      ...data,
      aibeCertificateUrl: urls,
    });
  };

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Enter your AIBE (All India Bar Examination) details
      </Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <TextField
            label="AIBE Registration Number"
            fullWidth
            size="small"
            value={data.aibeNumber}
            onChange={(e) => handleChange('aibeNumber', e.target.value)}
            placeholder="e.g., AIBE/2015/12345"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="AIBE Year"
            fullWidth
            size="small"
            type="number"
            value={data.aibeYear}
            onChange={(e) => handleChange('aibeYear', e.target.value)}
            placeholder="e.g., 2015"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FileUpload
            label="Upload AIBE Certificate"
            folder="kyc/aibe-certificates"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple={true}
            value={data.aibeCertificateUrl || []}
            onChange={handleFileChange}
            maxFiles={2}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AibeInfoStep;
