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

  const handleFileChange = (urls) => {
    onChange({
      ...data,
      documentUrls: urls,
    });
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
          <FileUpload
            label="Upload Address Proof Document"
            folder="kyc/address-proof"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple={true}
            value={data.documentUrls || []}
            onChange={handleFileChange}
            maxFiles={2}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Document should not be older than 3 months (for utility bills/bank statements)
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddressProofStep;
