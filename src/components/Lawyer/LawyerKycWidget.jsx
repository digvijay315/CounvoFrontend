import React, { useState } from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Typography,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Gavel as GavelIcon,
  VerifiedUser as VerifiedUserIcon,
  Work as WorkIcon,
  Badge as BadgeIcon,
  Home as HomeIcon,
  AccountBalance as AccountBalanceIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

import PersonalInfoStep from './KycSteps/PersonalInfoStep';
import EducationStep from './KycSteps/EducationStep';
import BarCouncilInfoStep from './KycSteps/BarCouncilInfoStep';
import AibeInfoStep from './KycSteps/AibeInfoStep';
import ProfessionalInfoStep from './KycSteps/ProfessionalInfoStep';
import IdentityProofStep from './KycSteps/IdentityProofStep';
import AddressProofStep from './KycSteps/AddressProofStep';
import BankDetailsStep from './KycSteps/BankDetailsStep';
import DeclarationsStep from './KycSteps/DeclarationsStep';
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import useAuth from "../../hooks/useAuth";
import api from "../../api";
import { getUserDetails } from "../../redux/slices/authSlice";

const steps = [
  { label: "Personal Information", icon: PersonIcon },
  { label: "Education", icon: SchoolIcon },
  { label: "Bar Council Info", icon: GavelIcon },
  { label: "AIBE Info", icon: VerifiedUserIcon },
  { label: "Professional Info", icon: WorkIcon },
  { label: "Identity Proof", icon: BadgeIcon },
  { label: "Address Proof", icon: HomeIcon },
  { label: "Bank Details", icon: AccountBalanceIcon },
  { label: "Declarations", icon: CheckCircleIcon },
];

const LawyerKycWidget = ({ onSuccess }) => {
  const { userId } = useAuth();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
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
    identityProof: {
      documentType: "",
      documentNumber: "",
      documentUrls: [],
    },
    addressProof: {
      documentType: "",
      documentUrls: [],
    },
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

  const handleNext = () => {
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
    console.log("Submitting KYC Data:", kycData);
    try {
      const response = await api.post(`/api/v2/lawyer-kyc/${userId}`, kycData);
      console.log("KYC Submission Response:", response.data);
      if (response.data.success) {
        toast.success("KYC Submission Successful");
        // Refresh user state to get updated KYC status
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
          />
        );
      case 2:
        return (
          <BarCouncilInfoStep
            data={kycData.barCouncilInfo}
            onChange={(data) => updateKycData("barCouncilInfo", data)}
          />
        );
      case 3:
        return (
          <AibeInfoStep
            data={kycData.aibeInfo}
            onChange={(data) => updateKycData("aibeInfo", data)}
          />
        );
      case 4:
        return (
          <ProfessionalInfoStep
            data={kycData.professionalInfo}
            onChange={(data) => updateKycData("professionalInfo", data)}
          />
        );
      case 5:
        return (
          <IdentityProofStep
            data={kycData.identityProof}
            onChange={(data) => updateKycData("identityProof", data)}
          />
        );
      case 6:
        return (
          <AddressProofStep
            data={kycData.addressProof}
            onChange={(data) => updateKycData("addressProof", data)}
          />
        );
      case 7:
        return (
          <BankDetailsStep
            data={kycData.bankDetails}
            onChange={(data) => updateKycData("bankDetails", data)}
          />
        );
      case 8:
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
                  <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={
                        index === steps.length - 1 ? handleSubmit : handleNext
                      }
                    >
                      {index === steps.length - 1 ? "Submit KYC" : "Continue"}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      variant="outlined"
                    >
                      Back
                    </Button>
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
