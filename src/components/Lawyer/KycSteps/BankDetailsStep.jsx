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

const accountTypes = [
  { value: 'savings', label: 'Savings Account' },
  { value: 'current', label: 'Current Account' },
];

const BankDetailsStep = ({ data, onChange }) => {
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
        cancelledChequeUrl: [...(data.cancelledChequeUrl || []), ...fileNames],
      });
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Enter your bank account details for receiving payments
      </Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <TextField
            label="Account Holder Name"
            fullWidth
            size="small"
            value={data.accountHolderName}
            onChange={(e) => handleChange('accountHolderName', e.target.value)}
            placeholder="Enter name as per bank records"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Bank Name"
            fullWidth
            size="small"
            value={data.bankName}
            onChange={(e) => handleChange('bankName', e.target.value)}
            placeholder="e.g., HDFC Bank"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Account Type"
            fullWidth
            size="small"
            value={data.accountType}
            onChange={(e) => handleChange('accountType', e.target.value)}
          >
            {accountTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Account Number"
            fullWidth
            size="small"
            value={data.accountNumber}
            onChange={(e) => handleChange('accountNumber', e.target.value)}
            placeholder="Enter account number"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="IFSC Code"
            fullWidth
            size="small"
            value={data.ifscCode}
            onChange={(e) => handleChange('ifscCode', e.target.value.toUpperCase())}
            placeholder="e.g., HDFC0001234"
          />
        </Grid>

        <Grid item xs={12}>
          <input
            type="file"
            id="cancelled-cheque"
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: 'none' }}
            onChange={(e) => handleFileUpload(e.target.files)}
          />
          <label htmlFor="cancelled-cheque">
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
              Upload Cancelled Cheque / Bank Statement
            </Button>
          </label>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            This helps us verify your bank account details
          </Typography>
        </Grid>

        {data.cancelledChequeUrl?.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              Uploaded: {data.cancelledChequeUrl.join(', ')}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default BankDetailsStep;

