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
  { value: 'utility_bill', label: 'Utility Bill (Electricity/Water/Gas)' },
  { value: 'bank_statement', label: 'Bank Statement' },
  { value: 'rent_agreement', label: 'Rent Agreement' },
  { value: 'property_tax', label: 'Property Tax Receipt' },
  { value: 'passport', label: 'Passport' },
  { value: 'voter_id', label: 'Voter ID' },
  { value: 'aadhaar', label: 'Aadhaar Card' },
];

const AddressProofStep = ({ data, onChange }) => {
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

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Upload your address proof document
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
          <input
            type="file"
            id="address-docs"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handleFileUpload(e.target.files)}
          />
          <label htmlFor="address-docs">
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
              Upload Address Proof Document
            </Button>
          </label>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Document should not be older than 3 months (for utility bills/bank statements)
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

export default AddressProofStep;

