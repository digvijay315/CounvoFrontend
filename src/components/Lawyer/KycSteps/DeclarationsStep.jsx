import React from 'react';
import {
  Box,
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
  Paper,
} from '@mui/material';
import {
  VerifiedUser as VerifiedUserIcon,
  Security as SecurityIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

const DeclarationsStep = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
      declarationDate: value ? new Date().toISOString() : '',
    });
  };

  const declarations = [
    {
      field: 'authenticityDeclaration',
      icon: VerifiedUserIcon,
      title: 'Authenticity Declaration',
      description:
        'I hereby declare that all the information provided in this KYC application is true, correct, and complete to the best of my knowledge and belief. I understand that providing false or misleading information may result in rejection of my application and/or legal action.',
    },
    {
      field: 'consentForVerification',
      icon: SecurityIcon,
      title: 'Consent for Verification',
      description:
        'I authorize Counvo and its authorized representatives to verify the information provided herein, including but not limited to my educational qualifications, bar council registration, professional credentials, and background verification through appropriate channels.',
    },
    {
      field: 'termsAndConditionsAccepted',
      icon: DescriptionIcon,
      title: 'Terms & Conditions',
      description:
        'I have read, understood, and agree to abide by the Terms of Service, Privacy Policy, and Professional Code of Conduct of Counvo. I understand that violation of these terms may result in suspension or termination of my account.',
    },
  ];

  const allAccepted =
    data.authenticityDeclaration &&
    data.consentForVerification &&
    data.termsAndConditionsAccepted;

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Please review and accept the following declarations
      </Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {declarations.map((declaration) => {
          const Icon = declaration.icon;
          return (
            <Grid item xs={12} key={declaration.field}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderColor: data[declaration.field] ? 'primary.main' : 'divider',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: data[declaration.field]
                        ? 'primary.main'
                        : 'grey.100',
                      flexShrink: 0,
                    }}
                  >
                    <Icon
                      sx={{
                        fontSize: 20,
                        color: data[declaration.field] ? 'white' : 'grey.500',
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={data[declaration.field] || false}
                          onChange={(e) =>
                            handleChange(declaration.field, e.target.checked)
                          }
                          color="primary"
                        />
                      }
                      label={
                        <Typography variant="subtitle2" fontWeight="600">
                          {declaration.title}
                        </Typography>
                      }
                      sx={{ mb: 0.5 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>
                      {declaration.description}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          );
        })}

        {allAccepted && (
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                backgroundColor: 'success.light',
                border: '1px solid',
                borderColor: 'success.main',
              }}
            >
              <Typography variant="body2" color="success.dark" fontWeight="500">
                ✓ All declarations accepted. You can now submit your KYC application.
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DeclarationsStep;

