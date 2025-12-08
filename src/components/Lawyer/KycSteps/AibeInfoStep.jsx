import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

const AibeInfoStep = ({ data, onChange }) => {
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
        aibeCertificateUrl: [...(data.aibeCertificateUrl || []), ...fileNames],
      });
    }
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
          <input
            type="file"
            id="aibe-certificate"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handleFileUpload(e.target.files)}
          />
          <label htmlFor="aibe-certificate">
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
              Upload AIBE Certificate
            </Button>
          </label>
        </Grid>

        {data.aibeCertificateUrl?.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Uploaded: {data.aibeCertificateUrl.join(', ')}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AibeInfoStep;

