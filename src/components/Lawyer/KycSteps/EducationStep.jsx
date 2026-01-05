import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  IconButton,
  Paper,
  CircularProgress,
  Chip,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { uploadResource } from '../../../utils';
import { toast } from 'react-toastify';

const EducationStep = ({ data, onChange, onUploadingChange }) => {
  const [uploading, setUploading] = useState({});

  // Notify parent when any upload state changes
  const updateUploading = (newUploading) => {
    setUploading(newUploading);
    const isAnyUploading = Object.values(newUploading).some(Boolean);
    onUploadingChange?.(isAnyUploading);
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...data];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };
    onChange(updatedEducation);
  };

  const addEducation = () => {
    onChange([
      ...data,
      {
        degree: '',
        university: '',
        yearOfGraduation: '',
        certificateUrl: '',
      },
    ]);
  };

  const removeEducation = (index) => {
    if (data.length > 1) {
      const updatedEducation = data.filter((_, i) => i !== index);
      onChange(updatedEducation);
    }
  };

  const handleFileUpload = async (index, files) => {
    if (files && files[0]) {
      updateUploading({ ...uploading, [index]: true });
      try {
        const file = files[0];
        const result = await uploadResource(file, file.name, 'kyc/education-certificates');
        if (result.success && result.publicUrl) {
          handleEducationChange(index, 'certificateUrl', result.publicUrl);
          toast.success('Certificate uploaded successfully');
        } else {
          toast.error('Failed to upload certificate');
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Upload failed. Please try again.');
      } finally {
        updateUploading({ ...uploading, [index]: false });
      }
    }
  };

  const handleRemoveCertificate = (index) => {
    handleEducationChange(index, 'certificateUrl', '');
  };

  const getFileName = (url) => {
    if (!url) return '';
    const urlWithoutParams = url.split('?')[0];
    const parts = urlWithoutParams.split('/');
    return parts[parts.length - 1] || 'Certificate';
  };

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Add your educational qualifications
      </Typography>

      {data.map((education, index) => (
        <Paper
          key={index}
          variant="outlined"
          sx={{ p: 2, mt: 2, position: 'relative' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="600">
              Education #{index + 1}
            </Typography>
            {data.length > 1 && (
              <IconButton
                size="small"
                color="error"
                onClick={() => removeEducation(index)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Degree"
                fullWidth
                size="small"
                value={education.degree}
                onChange={(e) =>
                  handleEducationChange(index, 'degree', e.target.value)
                }
                placeholder="e.g., LLB, LLM"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="University"
                fullWidth
                size="small"
                value={education.university}
                onChange={(e) =>
                  handleEducationChange(index, 'university', e.target.value)
                }
                placeholder="Enter university name"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Year of Graduation"
                fullWidth
                size="small"
                type="number"
                value={education.yearOfGraduation}
                onChange={(e) =>
                  handleEducationChange(index, 'yearOfGraduation', e.target.value)
                }
                placeholder="e.g., 2020"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              {education.certificateUrl ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={getFileName(education.certificateUrl).substring(0, 20) + '...'}
                    size="small"
                    onDelete={() => handleRemoveCertificate(index)}
                    sx={{ maxWidth: '100%' }}
                  />
                </Stack>
              ) : (
                <>
                  <input
                    type="file"
                    id={`certificate-${index}`}
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileUpload(index, e.target.files)}
                    disabled={uploading[index]}
                  />
                  <label htmlFor={`certificate-${index}`}>
                    <Button
                      component="span"
                      variant="outlined"
                      fullWidth
                      disabled={uploading[index]}
                      startIcon={
                        uploading[index] ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : (
                          <CloudUploadIcon />
                        )
                      }
                      sx={{
                        height: 40,
                        borderStyle: 'dashed',
                        textTransform: 'none',
                      }}
                    >
                      {uploading[index] ? 'Uploading...' : 'Upload Certificate'}
                    </Button>
                  </label>
                </>
              )}
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Button
        variant="text"
        startIcon={<AddIcon />}
        onClick={addEducation}
        sx={{ mt: 2 }}
      >
        Add Another Education
      </Button>
    </Box>
  );
};

export default EducationStep;
