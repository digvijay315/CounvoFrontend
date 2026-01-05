import React, { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
  Divider,
  Stack,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Gavel as GavelIcon,
  VerifiedUser as VerifiedUserIcon,
  Work as WorkIcon,
  Badge as BadgeIcon,
  Home as HomeIcon,
  AccountBalance as AccountBalanceIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import DocumentViewer from "../shared/DocumentViewer";

const kycCategories = [
  { key: "personalInfo", label: "Personal Information", icon: PersonIcon },
  { key: "education", label: "Education", icon: SchoolIcon },
  { key: "barCouncilInfo", label: "Bar Council Info", icon: GavelIcon },
  { key: "aibeInfo", label: "AIBE Info", icon: VerifiedUserIcon },
  { key: "professionalInfo", label: "Professional Info", icon: WorkIcon },
  { key: "identityProof", label: "Identity Proof", icon: BadgeIcon },
  { key: "addressProof", label: "Address Proof", icon: HomeIcon },
  { key: "bankDetails", label: "Bank Details", icon: AccountBalanceIcon },
  { key: "declarations", label: "Declarations", icon: CheckCircleIcon },
];

// Helper component for displaying a single field
const FieldDisplay = ({ label, value }) => {
  if (!value && value !== false && value !== 0) return null;
  
  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
      </Typography>
    </Box>
  );
};

// Helper component for displaying address
const AddressDisplay = ({ label, address }) => {
  if (!address) return null;
  
  const addressString = [
    address.street,
    address.city,
    address.state,
    address.pinCode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");

  if (!addressString) return null;

  return <FieldDisplay label={label} value={addressString} />;
};


// Category content renderers
const renderPersonalInfo = (data) => {
  if (!data) return <Typography color="text.secondary">No data available</Typography>;
  
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <FieldDisplay label="Gender" value={data.gender?.charAt(0).toUpperCase() + data.gender?.slice(1)} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FieldDisplay 
          label="Date of Birth" 
          value={data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString() : null} 
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FieldDisplay label="Alternate Contact" value={data.alternateContact} />
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Residential Address
        </Typography>
        <AddressDisplay label="" address={data.residentialAddress} />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Corresponding Address
        </Typography>
        {data.correspondingAddress?.isSameAsResidential ? (
          <Chip label="Same as Residential" size="small" />
        ) : (
          <AddressDisplay label="" address={data.correspondingAddress} />
        )}
      </Grid>
    </Grid>
  );
};

const renderEducation = (data) => {
  if (!data || data.length === 0) return <Typography color="text.secondary">No data available</Typography>;
  
  return (
    <Stack spacing={2}>
      {data.map((edu, index) => (
        <Box key={index} sx={{ pb: index < data.length - 1 ? 2 : 0, borderBottom: index < data.length - 1 ? 1 : 0, borderColor: "divider" }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            Qualification {data.length > 1 ? index + 1 : ""}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FieldDisplay label="Degree" value={edu.degree} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FieldDisplay label="University" value={edu.university} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FieldDisplay label="Year of Graduation" value={edu.yearOfGraduation} />
            </Grid>
            <Grid item xs={12}>
              <DocumentViewer label="Certificate" urls={edu.certificateUrl} />
            </Grid>
          </Grid>
        </Box>
      ))}
    </Stack>
  );
};

const renderBarCouncilInfo = (data) => {
  if (!data) return <Typography color="text.secondary">No data available</Typography>;
  
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <FieldDisplay label="Bar Enrollment Number" value={data.barEnrollmentNumber} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FieldDisplay label="Bar State" value={data.barState} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FieldDisplay label="Enrollment Year" value={data.enrollmentYear} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FieldDisplay label="Bar Membership" value={data.barMembership} />
      </Grid>
      <Grid item xs={12}>
        <DocumentViewer label="Bar Certificate" urls={data.barCertificateUrl} />
      </Grid>
    </Grid>
  );
};

const renderAibeInfo = (data) => {
  if (!data) return <Typography color="text.secondary">No data available</Typography>;
  
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <FieldDisplay label="AIBE Number" value={data.aibeNumber} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FieldDisplay label="AIBE Year" value={data.aibeYear} />
      </Grid>
      <Grid item xs={12}>
        <DocumentViewer label="AIBE Certificate" urls={data.aibeCertificateUrl} />
      </Grid>
    </Grid>
  );
};

const renderProfessionalInfo = (data) => {
  if (!data) return <Typography color="text.secondary">No data available</Typography>;
  
  const practiceTypeLabels = {
    individual: "Individual",
    firm: "Law Firm",
    associate: "Associate",
    partner: "Partner",
  };
  
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <FieldDisplay label="Practice Type" value={practiceTypeLabels[data.practiceType] || data.practiceType} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FieldDisplay label="Law Firm Name" value={data.lawFirmName} />
      </Grid>
      <Grid item xs={12}>
        <AddressDisplay label="Office Address" address={data.officeAddress} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Specializations
          </Typography>
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
            {data.specializations?.length > 0 ? (
              data.specializations.map((spec, i) => (
                <Chip key={i} label={spec} size="small" sx={{ mt: 0.5 }} />
              ))
            ) : (
              <Typography variant="body2">-</Typography>
            )}
          </Stack>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Languages
          </Typography>
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
            {data.languages?.length > 0 ? (
              data.languages.map((lang, i) => (
                <Chip key={i} label={lang} size="small" sx={{ mt: 0.5 }} />
              ))
            ) : (
              <Typography variant="body2">-</Typography>
            )}
          </Stack>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Practicing Courts
          </Typography>
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
            {data.practicingCourts?.length > 0 ? (
              data.practicingCourts.map((court, i) => (
                <Chip key={i} label={court} size="small" sx={{ mt: 0.5 }} />
              ))
            ) : (
              <Typography variant="body2">-</Typography>
            )}
          </Stack>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <FieldDisplay label="Professional Bio" value={data.professionalBio} />
      </Grid>
      <Grid item xs={12}>
        <DocumentViewer label="Proof of Practice" urls={data.proofOfPractice} />
      </Grid>
    </Grid>
  );
};

const renderIdentityProof = (data) => {
  if (!data) return <Typography color="text.secondary">No data available</Typography>;
  
  const docTypeLabels = {
    aadhaar: "Aadhaar Card",
    pan: "PAN Card",
    passport: "Passport",
    voter_id: "Voter ID",
    driving_license: "Driving License",
  };
  
  const statusColors = {
    pending: "warning",
    verified: "success",
    rejected: "error",
  };
  
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <FieldDisplay label="Document Type" value={docTypeLabels[data.documentType] || data.documentType} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FieldDisplay label="Document Number" value={data.documentNumber} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Verification Status
          </Typography>
          <Chip 
            label={data.verificationStatus?.charAt(0).toUpperCase() + data.verificationStatus?.slice(1) || "Pending"} 
            size="small" 
            color={statusColors[data.verificationStatus] || "default"} 
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <DocumentViewer label="Document Images" urls={data.documentUrls} />
      </Grid>
    </Grid>
  );
};

const renderAddressProof = (data) => {
  if (!data) return <Typography color="text.secondary">No data available</Typography>;
  
  const docTypeLabels = {
    aadhaar: "Aadhaar Card",
    passport: "Passport",
    voter_id: "Voter ID",
    driving_license: "Driving License",
    utility_bill: "Utility Bill",
    bank_statement: "Bank Statement",
  };
  
  const statusColors = {
    pending: "warning",
    verified: "success",
    rejected: "error",
  };
  
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <FieldDisplay label="Document Type" value={docTypeLabels[data.documentType] || data.documentType} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Verification Status
          </Typography>
          <Chip 
            label={data.verificationStatus?.charAt(0).toUpperCase() + data.verificationStatus?.slice(1) || "Pending"} 
            size="small" 
            color={statusColors[data.verificationStatus] || "default"} 
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <DocumentViewer label="Document Images" urls={data.documentUrls} />
      </Grid>
    </Grid>
  );
};

const renderBankDetails = (data) => {
  if (!data) return <Typography color="text.secondary">No data available</Typography>;
  
  const statusColors = {
    pending: "warning",
    verified: "success",
    rejected: "error",
  };
  
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <FieldDisplay label="Account Holder Name" value={data.accountHolderName} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FieldDisplay label="Bank Name" value={data.bankName} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FieldDisplay label="Account Number" value={data.accountNumber} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FieldDisplay label="IFSC Code" value={data.ifscCode} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FieldDisplay label="Account Type" value={data.accountType?.charAt(0).toUpperCase() + data.accountType?.slice(1)} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Verification Status
          </Typography>
          <Chip 
            label={data.verificationStatus?.charAt(0).toUpperCase() + data.verificationStatus?.slice(1) || "Pending"} 
            size="small" 
            color={statusColors[data.verificationStatus] || "default"} 
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <DocumentViewer label="Cancelled Cheque" urls={data.cancelledChequeUrl} />
      </Grid>
    </Grid>
  );
};

const renderDeclarations = (data) => {
  if (!data) return <Typography color="text.secondary">No data available</Typography>;
  
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Chip 
            label={data.authenticityDeclaration ? "Accepted" : "Not Accepted"} 
            size="small" 
            color={data.authenticityDeclaration ? "success" : "default"} 
          />
          <Typography variant="body2">Authenticity Declaration</Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Chip 
            label={data.consentForVerification ? "Accepted" : "Not Accepted"} 
            size="small" 
            color={data.consentForVerification ? "success" : "default"} 
          />
          <Typography variant="body2">Consent for Verification</Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Chip 
            label={data.termsAndConditionsAccepted ? "Accepted" : "Not Accepted"} 
            size="small" 
            color={data.termsAndConditionsAccepted ? "success" : "default"} 
          />
          <Typography variant="body2">Terms and Conditions</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FieldDisplay 
          label="Declaration Date" 
          value={data.declarationDate ? new Date(data.declarationDate).toLocaleString() : null} 
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FieldDisplay label="IP Address" value={data.ipAddress} />
      </Grid>
    </Grid>
  );
};

const renderCategoryContent = (key, data) => {
  switch (key) {
    case "personalInfo":
      return renderPersonalInfo(data);
    case "education":
      return renderEducation(data);
    case "barCouncilInfo":
      return renderBarCouncilInfo(data);
    case "aibeInfo":
      return renderAibeInfo(data);
    case "professionalInfo":
      return renderProfessionalInfo(data);
    case "identityProof":
      return renderIdentityProof(data);
    case "addressProof":
      return renderAddressProof(data);
    case "bankDetails":
      return renderBankDetails(data);
    case "declarations":
      return renderDeclarations(data);
    default:
      return <Typography color="text.secondary">No data available</Typography>;
  }
};

const KycDetailsView = ({ kycDetails }) => {
  const [expanded, setExpanded] = useState("personalInfo");

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (!kycDetails) {
    return (
      <Typography color="text.secondary" sx={{ p: 2 }}>
        No KYC details available
      </Typography>
    );
  }

  // Check if category has data
  const hasData = (key) => {
    const data = kycDetails[key];
    if (!data) return false;
    if (Array.isArray(data)) return data.length > 0;
    if (typeof data === "object") return Object.values(data).some((v) => v);
    return Boolean(data);
  };

  return (
    <Box>
      {/* Header with Status */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h6" fontWeight={600}>
            {kycDetails.lawyerId?.fullName || "Lawyer KYC Details"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Submitted: {kycDetails.kycSubmittedAt ? new Date(kycDetails.kycSubmittedAt).toLocaleString() : "N/A"}
          </Typography>
        </Box>
        <Chip
          label={kycDetails.kycStatus?.replace("_", " ").toUpperCase() || "PENDING"}
          color={
            kycDetails.kycStatus === "approved"
              ? "success"
              : kycDetails.kycStatus === "rejected"
              ? "error"
              : kycDetails.kycStatus === "in_review"
              ? "warning"
              : "default"
          }
        />
      </Box>

      {/* KYC Categories Accordion */}
      {kycCategories.map((category) => {
        const Icon = category.icon;
        const categoryHasData = hasData(category.key);

        return (
          <Accordion
            key={category.key}
            expanded={expanded === category.key}
            onChange={handleChange(category.key)}
            disableGutters
            sx={{
              "&:before": { display: "none" },
              boxShadow: "none",
              border: 1,
              borderColor: "divider",
              mb: 1,
              "&:first-of-type": { borderRadius: "8px 8px 0 0" },
              "&:last-of-type": { borderRadius: "0 0 8px 8px" },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                minHeight: 56,
                "& .MuiAccordionSummary-content": {
                  alignItems: "center",
                  gap: 1.5,
                },
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: categoryHasData ? "primary.main" : "grey.300",
                  color: categoryHasData ? "primary.contrastText" : "text.secondary",
                }}
              >
                <Icon sx={{ fontSize: 18 }} />
              </Box>
              <Typography fontWeight={expanded === category.key ? 600 : 400}>
                {category.label}
              </Typography>
              {!categoryHasData && (
                <Chip label="Not Provided" size="small" sx={{ ml: "auto", mr: 1 }} />
              )}
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, px: 3, pb: 2 }}>
              <Divider sx={{ mb: 2 }} />
              {renderCategoryContent(category.key, kycDetails[category.key])}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default KycDetailsView;

