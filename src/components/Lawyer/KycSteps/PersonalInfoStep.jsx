import React from 'react';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Typography,
  FormControlLabel,
  Checkbox,
  Divider,
} from '@mui/material';

const PersonalInfoStep = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleAddressChange = (addressType, field, value) => {
    onChange({
      ...data,
      [addressType]: {
        ...data[addressType],
        [field]: value,
      },
    });
  };

  const handleSameAsResidential = (checked) => {
    if (checked) {
      onChange({
        ...data,
        correspondingAddress: {
          ...data.residentialAddress,
          isSameAsResidential: true,
        },
      });
    } else {
      onChange({
        ...data,
        correspondingAddress: {
          street: '',
          city: '',
          state: '',
          pinCode: '',
          country: 'India',
          isSameAsResidential: false,
        },
      });
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Please provide your personal details
      </Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Gender"
            fullWidth
            size="small"
            value={data.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Date of Birth"
            type="date"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            value={data.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Alternate Contact Number"
            fullWidth
            size="small"
            value={data.alternateContact}
            onChange={(e) => handleChange('alternateContact', e.target.value)}
            placeholder="Enter alternate phone number"
          />
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" fontWeight="600" sx={{ mt: 2, mb: 1 }}>
            Residential Address
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Street Address"
            fullWidth
            size="small"
            value={data.residentialAddress?.street}
            onChange={(e) =>
              handleAddressChange('residentialAddress', 'street', e.target.value)
            }
            placeholder="Enter street address, apartment, building"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="City"
            fullWidth
            size="small"
            value={data.residentialAddress?.city}
            onChange={(e) =>
              handleAddressChange('residentialAddress', 'city', e.target.value)
            }
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="State"
            fullWidth
            size="small"
            value={data.residentialAddress?.state}
            onChange={(e) =>
              handleAddressChange('residentialAddress', 'state', e.target.value)
            }
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="PIN Code"
            fullWidth
            size="small"
            inputProps={{ maxLength: 6 }}
            value={data.residentialAddress?.pinCode}
            onChange={(e) =>
              handleAddressChange('residentialAddress', 'pinCode', e.target.value)
            }
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Country"
            fullWidth
            size="small"
            value={data.residentialAddress?.country}
            onChange={(e) =>
              handleAddressChange('residentialAddress', 'country', e.target.value)
            }
          />
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
            <Typography variant="subtitle2" fontWeight="600">
              Corresponding Address
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={data.correspondingAddress?.isSameAsResidential}
                  onChange={(e) => handleSameAsResidential(e.target.checked)}
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  Same as residential
                </Typography>
              }
            />
          </Box>
        </Grid>

        {!data.correspondingAddress?.isSameAsResidential && (
          <>
            <Grid item xs={12}>
              <TextField
                label="Street Address"
                fullWidth
                size="small"
                value={data.correspondingAddress?.street}
                onChange={(e) =>
                  handleAddressChange('correspondingAddress', 'street', e.target.value)
                }
                placeholder="Enter street address, apartment, building"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="City"
                fullWidth
                size="small"
                value={data.correspondingAddress?.city}
                onChange={(e) =>
                  handleAddressChange('correspondingAddress', 'city', e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="State"
                fullWidth
                size="small"
                value={data.correspondingAddress?.state}
                onChange={(e) =>
                  handleAddressChange('correspondingAddress', 'state', e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="PIN Code"
                fullWidth
                size="small"
                inputProps={{ maxLength: 6 }}
                value={data.correspondingAddress?.pinCode}
                onChange={(e) =>
                  handleAddressChange('correspondingAddress', 'pinCode', e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Country"
                fullWidth
                size="small"
                value={data.correspondingAddress?.country}
                onChange={(e) =>
                  handleAddressChange('correspondingAddress', 'country', e.target.value)
                }
              />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default PersonalInfoStep;

