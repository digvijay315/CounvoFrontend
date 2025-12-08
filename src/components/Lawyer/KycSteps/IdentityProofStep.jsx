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

const documentTypes = [
  { value: 'aadhaar', label: 'Aadhaar Card' },
  { value: 'pan', label: 'PAN Card' },
  { value: 'passport', label: 'Passport' },
  { value: 'voter_id', label: 'Voter ID' },
  { value: 'driving_license', label: 'Driving License' },
];

const IdentityProofStep = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleFileUpload = (files) => {
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map((file) => file.name);
      onChange({
        ...data,
        documentUrls: [...(data.documentUrls || []), ...fileNames],
      });
    }
  };

  const getPlaceholder = () => {
    switch (data.documentType) {
      case 'aadhaar':
        return 'XXXX-XXXX-XXXX';
      case 'pan':
        return 'ABCDE1234F';
      case 'passport':
        return 'A1234567';
      case 'voter_id':
        return 'ABC1234567';
      case 'driving_license':
        return 'DL-0420110012345';
      default:
        return 'Enter document number';
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Upload your identity proof document
      </Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <TextField
            select
            label="Document Type"
            fullWidth
            size="small"
            value={data.documentType}
            onChange={(e) => handleChange('documentType', e.target.value)}
          >
            {documentTypes.map((doc) => (
              <MenuItem key={doc.value} value={doc.value}>
                {doc.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Document Number"
            fullWidth
            size="small"
            value={data.documentNumber}
            onChange={(e) => handleChange('documentNumber', e.target.value)}
            placeholder={getPlaceholder()}
          />
        </Grid>

        <Grid item xs={12}>
          <input
            type="file"
            id="identity-docs"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handleFileUpload(e.target.files)}
          />
          <label htmlFor="identity-docs">
            <Button
              component="span"
              variant="outlined"
              fullWidth
              startIcon={<CloudUploadIcon />}
              sx={{
                py: 1.5,
                borderStyle: 'dashed',
                textTransform: 'none',
              }}
            >
              Upload Document (Front & Back)
            </Button>
          </label>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Please upload both front and back side of your document
          </Typography>
        </Grid>

        {data.documentUrls?.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Uploaded: {data.documentUrls.join(', ')}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default IdentityProofStep;

