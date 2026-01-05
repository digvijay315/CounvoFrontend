import React from 'react';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Typography,
} from '@mui/material';
import FileUpload from '../../shared/FileUpload';

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

  const handleFileChange = (urls) => {
    onChange({
      ...data,
      documentUrls: urls,
    });
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
          <FileUpload
            label="Upload Document (Front & Back)"
            folder="kyc/identity-proof"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple={true}
            value={data.documentUrls || []}
            onChange={handleFileChange}
            maxFiles={2}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Please upload both front and back side of your document
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default IdentityProofStep;
