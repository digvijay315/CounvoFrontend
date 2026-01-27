import React, { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Gavel as GavelIcon,
  VerifiedUser as VerifiedUserIcon,
  Work as WorkIcon,
  // Badge as BadgeIcon,
  // Home as HomeIcon,
  AccountBalance as AccountBalanceIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

import PersonalInfoStep from "./KycSteps/PersonalInfoStep";
import EducationStep from "./KycSteps/EducationStep";
import BarCouncilInfoStep from "./KycSteps/BarCouncilInfoStep";
import AibeInfoStep from "./KycSteps/AibeInfoStep";
import ProfessionalInfoStep from "./KycSteps/ProfessionalInfoStep";
// import IdentityProofStep from "./KycSteps/IdentityProofStep";
// import AddressProofStep from "./KycSteps/AddressProofStep";
import BankDetailsStep from "./KycSteps/BankDetailsStep";
import DeclarationsStep from "./KycSteps/DeclarationsStep";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import useAuth from "../../hooks/useAuth";
import api from "../../api";
import { getUserDetails } from "../../redux/slices/authSlice";

const steps = [
  { label: "Personal Information", icon: PersonIcon, key: "personalInfo" },
  { label: "Education", icon: SchoolIcon, key: "education" },
  { label: "Bar Council Info", icon: GavelIcon, key: "barCouncilInfo" },
  { label: "AIBE Info", icon: VerifiedUserIcon, key: "aibeInfo" },
  { label: "Professional Info", icon: WorkIcon, key: "professionalInfo" },
  // { label: "Identity Proof", icon: BadgeIcon, key: "identityProof" },
  // { label: "Address Proof", icon: HomeIcon, key: "addressProof" },
  { label: "Bank Details", icon: AccountBalanceIcon, key: "bankDetails" },
  { label: "Declarations", icon: CheckCircleIcon, key: "declarations" },
];

const LawyerKycWidget = ({ onSuccess }) => {
  const { userId } = useAuth();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [kycData, setKycData] = useState({
    personalInfo: {
      gender: "",
      dateOfBirth: "",
      alternateContact: "",
      residentialAddress: {
        street: "",
        city: "",
        state: "",
        pinCode: "",
        country: "India",
      },
      correspondingAddress: {
        street: "",
        city: "",
        state: "",
        pinCode: "",
        country: "India",
        isSameAsResidential: false,
      },
    },
    education: [
      {
        degree: "",
        university: "",
        yearOfGraduation: "",
        certificateUrl: "",
      },
    ],
    barCouncilInfo: {
      barEnrollmentNumber: "",
      barState: "",
      enrollmentYear: "",
      barCertificateUrl: [],
      barMembership: "",
    },
    aibeInfo: {
      aibeNumber: "",
      aibeCertificateUrl: [],
      aibeYear: "",
    },
    professionalInfo: {
      practiceType: "",
      lawFirmName: "",
      officeAddress: {
        street: "",
        street2: "",
        city: "",
        state: "",
        pinCode: "",
        country: "India",
      },
      specializations: [],
      languages: [],
      practicingCourts: [],
      proofOfPractice: [],
      professionalBio: "",
    },
    // identityProof: {
    //   documentType: "",
    //   documentNumber: "",
    //   documentUrls: [],
    // },
    // addressProof: {
    //   documentType: "",
    //   documentUrls: [],
    // },
    bankDetails: {
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      accountType: "",
      cancelledChequeUrl: [],
    },
    declarations: {
      authenticityDeclaration: false,
      consentForVerification: false,
      termsAndConditionsAccepted: false,
      declarationDate: "",
      ipAddress: "",
    },
  });

  // Validation function for each step
  const validateStep = (stepKey) => {
    switch (stepKey) {
      case "personalInfo": {
        const data = kycData.personalInfo;
        return !!(
          data.gender &&
          data.dateOfBirth &&
          data.residentialAddress?.street &&
          data.residentialAddress?.city &&
          data.residentialAddress?.state &&
          data.residentialAddress?.pinCode
        );
      }
      case "education": {
        const data = kycData.education;
        return (
          data.length > 0 &&
          data.every(
            (edu) =>
              edu.degree &&
              edu.university &&
              edu.yearOfGraduation &&
              edu.certificateUrl
          )
        );
      }
      case "barCouncilInfo": {
        const data = kycData.barCouncilInfo;
        return !!(
          data.barEnrollmentNumber &&
          data.barState &&
          data.enrollmentYear &&
          data.barCertificateUrl?.length > 0
        );
      }
      case "aibeInfo": {
        const data = kycData.aibeInfo;
        // AIBE info is optional, but if provided, certificate is required
        if (data.aibeNumber || data.aibeYear) {
          return !!(
            data.aibeNumber &&
            data.aibeYear &&
            data.aibeCertificateUrl?.length > 0
          );
        }
        return true; // Optional step
      }
      case "professionalInfo": {
        const data = kycData.professionalInfo;
        return !!(
          data.officeAddress.street &&
          data.officeAddress.street2 &&
          data.practiceType &&
          data.specializations?.length > 0 &&
          data.languages?.length > 0
        );
      }
      // case "identityProof": {
      //   const data = kycData.identityProof;
      //   return !!(
      //     data.documentType &&
      //     data.documentNumber &&
      //     data.documentUrls?.length > 0
      //   );
      // }
      // case "addressProof": {
      //   const data = kycData.addressProof;
      //   return !!(data.documentType && data.documentUrls?.length > 0);
      // }
      case "bankDetails": {
        const data = kycData.bankDetails;
        return !!(
          data.accountHolderName &&
          data.bankName &&
          data.accountNumber &&
          data.ifscCode &&
          data.accountType &&
          data.cancelledChequeUrl?.length > 0
        );
      }
      case "declarations": {
        const data = kycData.declarations;
        return !!(
          data.authenticityDeclaration &&
          data.consentForVerification &&
          data.termsAndConditionsAccepted
        );
      }
      default:
        return true;
    }
  };

  const isCurrentStepValid = () => {
    const currentStepKey = steps[activeStep]?.key;
    return validateStep(currentStepKey);
  };

  const handleNext = () => {
    if (!isCurrentStepValid()) {
      toast.warning("Please complete all required fields before continuing");
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const updateKycData = (section, data) => {
    setKycData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const handleSubmit = async () => {
    if (!isCurrentStepValid()) {
      toast.warning("Please complete all required declarations");
      return;
    }
    try {
      let kycDataToSubmit = { ...kycData };
      try {
        let officeAddLine1 = kycData.professionalInfo.officeAddress.street.trim(),
          officeAddLine2 = kycData.professionalInfo.officeAddress.street2.trim();
        kycDataToSubmit.professionalInfo.officeAddress.street = `${officeAddLine1}, ${officeAddLine2}`;
        delete kycDataToSubmit.professionalInfo.officeAddress.street2;
      } catch (error) {
        console.error("Error formatting office address:", error);
      }
      const response = await api.post(`/api/v2/lawyer-kyc/${userId}`, kycDataToSubmit);
      if (response.data.success) {
        toast.success("KYC Submission Successful");
        dispatch(getUserDetails());
        handleReset();
        onSuccess();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("KYC Submission Error:", error);
      toast.error("Failed to submit KYC. Please try again.");
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <PersonalInfoStep
            data={kycData.personalInfo}
            onChange={(data) => updateKycData("personalInfo", data)}
          />
        );
      case 1:
        return (
          <EducationStep
            data={kycData.education}
            onChange={(data) => updateKycData("education", data)}
            onUploadingChange={setUploading}
          />
        );
      case 2:
        return (
          <BarCouncilInfoStep
            data={kycData.barCouncilInfo}
            onChange={(data) => updateKycData("barCouncilInfo", data)}
            onUploadingChange={setUploading}
          />
        );
      case 3:
        return (
          <AibeInfoStep
            data={kycData.aibeInfo}
            onChange={(data) => updateKycData("aibeInfo", data)}
            onUploadingChange={setUploading}
          />
        );
      case 4:
        return (
          <ProfessionalInfoStep
            data={kycData.professionalInfo}
            onChange={(data) => updateKycData("professionalInfo", data)}
            onUploadingChange={setUploading}
          />
        );
      // case 5:
      //   return (
      //     <IdentityProofStep
      //       data={kycData.identityProof}
      //       onChange={(data) => updateKycData("identityProof", data)}
      //       onUploadingChange={setUploading}
      //     />
      //   );
      // case 6:
      //   return (
      //     <AddressProofStep
      //       data={kycData.addressProof}
      //       onChange={(data) => updateKycData("addressProof", data)}
      //       onUploadingChange={setUploading}
      //     />
      //   );
      case 5:
        return (
          <BankDetailsStep
            data={kycData.bankDetails}
            onChange={(data) => updateKycData("bankDetails", data)}
            onUploadingChange={setUploading}
          />
        );
      case 6:
        return (
          <DeclarationsStep
            data={kycData.declarations}
            onChange={(data) => updateKycData("declarations", data)}
          />
        );
      default:
        return null;
    }
  };

  const canContinue = isCurrentStepValid() && !uploading;

  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          return (
            <Step key={step.label}>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor:
                        activeStep === index
                          ? "primary.main"
                          : activeStep > index
                            ? "success.main"
                            : "grey.300",
                      color: activeStep >= index ? "white" : "text.secondary",
                    }}
                  >
                    <StepIcon sx={{ fontSize: 20 }} />
                  </Box>
                )}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={activeStep === index ? 600 : 400}
                  color={
                    activeStep === index ? "text.primary" : "text.secondary"
                  }
                >
                  {step.label}
                </Typography>
              </StepLabel>
              <StepContent>
                <Box sx={{ py: 2 }}>
                  {renderStepContent(index)}
                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={
                        index === steps.length - 1 ? handleSubmit : handleNext
                      }
                      disabled={!canContinue}
                      startIcon={
                        uploading ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : null
                      }
                    >
                      {uploading
                        ? "Uploading..."
                        : index === steps.length - 1
                          ? "Submit KYC"
                          : "Continue"}
                    </Button>
                    <Button
                      disabled={index === 0 || uploading}
                      onClick={handleBack}
                      variant="outlined"
                    >
                      Back
                    </Button>
                    {!isCurrentStepValid() && !uploading && (
                      <Typography variant="caption" color="error">
                        Please complete all required fields
                      </Typography>
                    )}
                  </Box>
                </Box>
              </StepContent>
            </Step>
          );
        })}
      </Stepper>

      {activeStep === steps.length && (
        <Paper elevation={0} sx={{ p: 3, mt: 3, textAlign: "center" }}>
          <CheckCircleIcon
            sx={{ fontSize: 60, color: "success.main", mb: 2 }}
          />
          <Typography variant="h5" fontWeight="600" gutterBottom>
            KYC Submitted Successfully!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Your KYC verification is under review. We'll notify you once it's
            approved.
          </Typography>
          <Button onClick={handleReset} variant="outlined">
            Review Application
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default LawyerKycWidget;
