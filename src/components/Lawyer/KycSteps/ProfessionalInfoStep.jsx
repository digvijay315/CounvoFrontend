import React from 'react';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import FileUpload from '../../shared/FileUpload';
import {
  LawyerLanguages,
  LawyerPracticingCourts,
  LawyerSpecializations,
} from "../../../_constants/dataConstants";

const practiceTypes = [
  { value: "individual", label: "Individual Practice" },
  { value: "law_firm", label: "Law Firm" },
  { value: "corporate", label: "Corporate Counsel" },
  { value: "government", label: "Government Advocate" },
];

const ProfessionalInfoStep = ({ data, onChange, onUploadingChange }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleAddressChange = (field, value) => {
    onChange({
      ...data,
      officeAddress: {
        ...data.officeAddress,
        [field]: value,
      },
    });
  };

  const handleArrayToggle = (field, item) => {
    const currentArray = data[field] || [];
    const newArray = currentArray.includes(item)
      ? currentArray.filter((i) => i !== item)
      : [...currentArray, item];
    handleChange(field, newArray);
  };

  const handleFileChange = (urls) => {
    onChange({
      ...data,
      proofOfPractice: urls,
    });
  };

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Provide your professional practice details
      </Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Practice Type"
            fullWidth
            size="small"
            value={data.practiceType}
            onChange={(e) => handleChange("practiceType", e.target.value)}
          >
            {practiceTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {data.practiceType === "law_firm" && (
          <Grid item xs={12} sm={6}>
            <TextField
              label="Law Firm Name"
              fullWidth
              size="small"
              value={data.lawFirmName}
              onChange={(e) => handleChange("lawFirmName", e.target.value)}
              placeholder="Enter law firm name"
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="subtitle2"
            fontWeight="600"
            sx={{ mt: 2, mb: 1 }}
          >
            Office Address
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Street Address"
            fullWidth
            size="small"
            value={data.officeAddress?.street}
            onChange={(e) => handleAddressChange("street", e.target.value)}
            placeholder="Enter office address line 1"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Street Address Line 2"
            fullWidth
            size="small"
            value={data.officeAddress?.street}
            onChange={(e) => handleAddressChange("street2", e.target.value)}
            placeholder="Enter office address line 2"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="City"
            fullWidth
            size="small"
            value={data.officeAddress?.city}
            onChange={(e) => handleAddressChange("city", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="State"
            fullWidth
            size="small"
            value={data.officeAddress?.state}
            onChange={(e) => handleAddressChange("state", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="PIN Code"
            fullWidth
            size="small"
            inputProps={{ maxLength: 6 }}
            value={data.officeAddress?.pinCode}
            onChange={(e) => handleAddressChange("pinCode", e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="subtitle2"
            fontWeight="600"
            sx={{ mt: 2, mb: 1 }}
          >
            Specializations
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {LawyerSpecializations.map((spec) => (
              <Chip
                key={spec.value}
                label={spec.label}
                size="small"
                onClick={() => handleArrayToggle("specializations", spec.value)}
                color={
                  data.specializations?.includes(spec.value)
                    ? "primary"
                    : "default"
                }
                variant={
                  data.specializations?.includes(spec.value)
                    ? "filled"
                    : "outlined"
                }
                sx={{ cursor: "pointer" }}
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="subtitle2"
            fontWeight="600"
            sx={{ mt: 2, mb: 1 }}
          >
            Languages
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {LawyerLanguages.map((lang) => (
              <Chip
                key={lang.value}
                label={lang.label}
                size="small"
                onClick={() => handleArrayToggle("languages", lang.value)}
                color={
                  data.languages?.includes(lang.value) ? "primary" : "default"
                }
                variant={
                  data.languages?.includes(lang.value) ? "filled" : "outlined"
                }
                sx={{ cursor: "pointer" }}
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="subtitle2"
            fontWeight="600"
            sx={{ mt: 2, mb: 1 }}
          >
            Practicing Courts
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {LawyerPracticingCourts.map((court) => (
              <Chip
                key={court.value}
                label={court.label}
                size="small"
                onClick={() =>
                  handleArrayToggle("practicingCourts", court.value)
                }
                color={
                  data.practicingCourts?.includes(court.value)
                    ? "primary"
                    : "default"
                }
                variant={
                  data.practicingCourts?.includes(court.value)
                    ? "filled"
                    : "outlined"
                }
                sx={{ cursor: "pointer" }}
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="subtitle2"
            fontWeight="600"
            sx={{ mt: 2, mb: 1 }}
          >
            Professional Bio
          </Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            size="small"
            value={data.professionalBio}
            onChange={(e) => handleChange("professionalBio", e.target.value)}
            placeholder="Write a brief professional bio (experience, achievements, areas of expertise)"
          />
        </Grid>

        <Grid item xs={12}>
          <FileUpload
            label="Upload Proof of Practice"
            folder="kyc/proof-of-practice"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple={true}
            value={data.proofOfPractice || []}
            onChange={handleFileChange}
            onUploadingChange={onUploadingChange}
            maxFiles={5}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfessionalInfoStep;
