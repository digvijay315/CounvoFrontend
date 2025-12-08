import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';

const EducationStep = ({ data, onChange }) => {
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

  const handleFileUpload = (index, files) => {
    if (files && files[0]) {
      // In a real implementation, you would upload the file and get the URL
      const fileName = files[0].name;
      handleEducationChange(index, 'certificateUrl', fileName);
    }
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
              <input
                type="file"
                id={`certificate-${index}`}
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
                onChange={(e) => handleFileUpload(index, e.target.files)}
              />
              <label htmlFor={`certificate-${index}`}>
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
                  {education.certificateUrl || 'Upload Certificate'}
                </Button>
              </label>
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

