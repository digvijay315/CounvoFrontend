import React from 'react';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Typography,
} from '@mui/material';
import FileUpload from '../../shared/FileUpload';

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

  const handleFileChange = (urls) => {
    onChange({
      ...data,
      cancelledChequeUrl: urls,
    });
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
          <FileUpload
            label="Upload Cancelled Cheque / Bank Statement"
            folder="kyc/bank-documents"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple={false}
            value={data.cancelledChequeUrl || []}
            onChange={handleFileChange}
            maxFiles={2}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            This helps us verify your bank account details
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BankDetailsStep;
