import { React, useState, useEffect } from "react";
import api from "../../api";
import {
  TextField,
  MenuItem,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Avatar,
  Button,
  Drawer,
  IconButton,
  CircularProgress,
  Divider,
  Stack,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Edit as EditIcon,
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Gavel as GavelIcon,
  VerifiedUser as VerifiedUserIcon,
  Work as WorkIcon,
  AccountBalance as AccountBalanceIcon,
} from "@mui/icons-material";
import Select from "react-select";
import { State, City } from "country-state-city";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import useAuth from "../../hooks/useAuth";
import { getUserDetails } from "../../redux/slices/authSlice";
import PersonalInfoStep from "./KycSteps/PersonalInfoStep";
import EducationStep from "./KycSteps/EducationStep";
import BarCouncilInfoStep from "./KycSteps/BarCouncilInfoStep";
import AibeInfoStep from "./KycSteps/AibeInfoStep";
import ProfessionalInfoStep from "./KycSteps/ProfessionalInfoStep";
import BankDetailsStep from "./KycSteps/BankDetailsStep";

const kycTabs = [
  { label: "Basic", key: "basic" },
  { label: "Personal", key: "personalInfo" },
  { label: "Education", key: "education" },
  { label: "Bar Council", key: "barCouncilInfo" },
  { label: "AIBE", key: "aibeInfo" },
  { label: "Professional", key: "professionalInfo" },
  { label: "Bank", key: "bankDetails" },
  { label: "Declarations", key: "declarations" },
];
const kycSteps = [
  { label: "Personal Information", icon: PersonIcon, key: "personalInfo" },
  { label: "Education", icon: SchoolIcon, key: "education" },
  { label: "Bar Council Info", icon: GavelIcon, key: "barCouncilInfo" },
  { label: "AIBE Info", icon: VerifiedUserIcon, key: "aibeInfo" },
  { label: "Professional Info", icon: WorkIcon, key: "professionalInfo" },
  { label: "Bank Details", icon: AccountBalanceIcon, key: "bankDetails" },
];

const defaultKycData = {
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
    { degree: "", university: "", yearOfGraduation: "", certificateUrl: "" },
  ],
  barCouncilInfo: {
    barEnrollmentNumber: "",
    barState: "",
    enrollmentYear: "",
    barCertificateUrl: [],
    barMembership: "",
  },
  aibeInfo: { aibeNumber: "", aibeCertificateUrl: [], aibeYear: "" },
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
};

const LawyerProfile = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [kycLoading, setKycLoading] = useState(true);
  const [kycData, setKycData] = useState(defaultKycData);
  const { user: userData, userId } = useAuth();

  const [show1, setShow1] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [uploading, setUploading] = useState(false);

  const [editBasic, setEditBasic] = useState({
    fullName: "",
    phone: "",
    profilepic: [],
  });

  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  useEffect(() => {
    const indiaStates = State.getStatesOfCountry("IN");
    const mappedStates = indiaStates.map((state) => ({
      value: state.isoCode,
      label: state.name,
    }));
    setStateOptions(mappedStates);
  }, []);

  useEffect(() => {
    if (selectedState) {
      const cities = City.getCitiesOfState("IN", selectedState.value);
      const mappedCities = cities.map((city) => ({
        value: city.name,
        label: city.name,
      }));
      setCityOptions(mappedCities);
      setSelectedCity(null);
    }
  }, [selectedState]);

  useEffect(() => {
    if (!userId || userData?.role !== "lawyer") {
      setKycLoading(false);
      return;
    }
    const fetchKyc = async () => {
      try {
        const res = await api.get(`/api/v2/lawyer-kyc/${userId}`);
        if (res.data?.success && res.data?.kyc) {
          const k = res.data.kyc;
          setKycData({
            personalInfo: k.personalInfo || defaultKycData.personalInfo,
            education:
              Array.isArray(k.education) && k.education.length
                ? k.education
                : defaultKycData.education,
            barCouncilInfo: k.barCouncilInfo || defaultKycData.barCouncilInfo,
            aibeInfo: k.aibeInfo || defaultKycData.aibeInfo,
            professionalInfo: (() => {
              const p = k.professionalInfo || defaultKycData.professionalInfo;
              const addr = p?.officeAddress || {};
              const streetParts = (addr.street || "").split(", ");
              return {
                ...p,
                officeAddress: {
                  ...addr,
                  street: streetParts[0] || "",
                  street2: streetParts[1] || "",
                  city: addr.city || "",
                  state: addr.state || "",
                  pinCode: addr.pinCode || "",
                  country: addr.country || "India",
                },
              };
            })(),
            bankDetails: k.bankDetails || defaultKycData.bankDetails,
            declarations: k.declarations || defaultKycData.declarations,
          });
        }
      } catch (err) {
        if (err.response?.status !== 404) console.error(err);
      } finally {
        setKycLoading(false);
      }
    };
    fetchKyc();
  }, [userId, userData?.role]);

  const handleShow1 = () => {
    setShow1(true);
    setActiveTab(0);
    setEditBasic({
      fullName: userData?.fullName ?? "",
      phone: userData?.phone ?? "",
      profilepic: [],
    });
  };

  const handleClose1 = () => {
    setShow1(false);
  };

  const updateKycData = (section, data) => {
    setKycData((prev) => ({ ...prev, [section]: data }));
  };

  const validateKycStep = (stepKey) => {
    switch (stepKey) {
      case "personalInfo": {
        const d = kycData.personalInfo;
        return !!(
          d?.gender &&
          d?.dateOfBirth &&
          d?.residentialAddress?.street &&
          d?.residentialAddress?.city &&
          d?.residentialAddress?.state &&
          d?.residentialAddress?.pinCode
        );
      }
      case "education":
        return (
          kycData.education?.length > 0 &&
          kycData.education.every(
            (e) =>
              e.degree && e.university && e.yearOfGraduation && e.certificateUrl
          )
        );
      case "barCouncilInfo": {
        const d = kycData.barCouncilInfo;
        return !!(
          d?.barEnrollmentNumber &&
          d?.barState &&
          d?.enrollmentYear &&
          d?.barCertificateUrl?.length > 0
        );
      }
      case "aibeInfo":
        if (kycData.aibeInfo?.aibeNumber || kycData.aibeInfo?.aibeYear) {
          return !!(
            kycData.aibeInfo?.aibeNumber &&
            kycData.aibeInfo?.aibeYear &&
            kycData.aibeInfo?.aibeCertificateUrl?.length > 0
          );
        }
        return true;
      case "professionalInfo": {
        const d = kycData.professionalInfo;
        return !!(
          d?.officeAddress?.street &&
          d?.practiceType &&
          d?.specializations?.length > 0 &&
          d?.languages?.length > 0
        );
      }
      case "bankDetails": {
        const d = kycData.bankDetails;
        return !!(
          d?.accountHolderName &&
          d?.bankName &&
          d?.accountNumber &&
          d?.ifscCode &&
          d?.accountType &&
          d?.cancelledChequeUrl?.length > 0
        );
      }
      case "declarations": {
        const d = kycData.declarations;
        return !!(
          d?.authenticityDeclaration &&
          d?.consentForVerification &&
          d?.termsAndConditionsAccepted
        );
      }
      default:
        return true;
    }
  };

  const renderKycStepContent = (index) => {
    switch (index) {
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
      case 5:
        return (
          <BankDetailsStep
            data={kycData.bankDetails}
            onChange={(data) => updateKycData("bankDetails", data)}
            onUploadingChange={setUploading}
            readOnly
          />
        );
      default:
        return null;
    }
  };

  const completeeditlawyerprofile = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("fullName", editBasic.fullName ?? "");
      formData.append("phone", editBasic.phone ?? "");
      const pics = Array.isArray(editBasic.profilepic)
        ? editBasic.profilepic
        : [];
      pics
        .filter((f) => f instanceof File)
        .forEach((f) => formData.append("profilepic", f));
      await api.put(`api/user/updateuserprofile/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      let kycPayload = { ...kycData };
      try {
        const oa = kycPayload.professionalInfo?.officeAddress;
        if (oa?.street2) {
          kycPayload.professionalInfo.officeAddress.street = [
            oa.street,
            oa.street2,
          ]
            .filter(Boolean)
            .join(", ");
          delete kycPayload.professionalInfo.officeAddress.street2;
        }
      } catch (_) {}
      const kycRes = await api.post(`/api/v2/lawyer-kyc/${userId}`, kycPayload);
      if (kycRes.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile and KYC have been updated successfully.",
          showConfirmButton: true,
        });
        dispatch(getUserDetails());
        handleClose1();
      } else {
        toast.error(kycRes.data?.message || "KYC update failed.");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text:
          error.response?.data?.message ||
          "Could not update profile. Please try again.",
        showConfirmButton: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Profile Card - Simple & Clean */}
      <Card elevation={0} variant="outlined">
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Typography variant="h4" fontWeight="600" gutterBottom>
            My Profile
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Manage your personal information
          </Typography>
          <Stack direction="row" alignItems="flex-start" spacing={2}>
            {/* Avatar Section */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                mb: 4,
                gap: 2,
              }}
            >
              <Avatar
                src={userData?.profilepic?.[0]}
                alt="Profile"
                sx={{
                  width: 100,
                  height: 100,
                  mb: 2,
                }}
              />
              <Stack direction="column" spacing={1}>
                <Typography variant="h6" fontWeight="600">
                  {userData?.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lawyer Account
                </Typography>
                <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={handleShow1}
                  >
                    Edit Profile
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Profile Info Grid - Simple */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Full Name
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {userData?.fullName || "Not provided"}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Email Address
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {userData?.email || "Not provided"}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Contact Number
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {userData?.phone || userData?.contact_no || "Not provided"}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {kycData?.personalInfo?.residentialAddress?.city &&
                  kycData?.personalInfo?.residentialAddress?.state
                    ? `${kycData.personalInfo.residentialAddress.city}, ${kycData.personalInfo.residentialAddress.state}`
                    : userData?.city && userData?.state
                    ? `${userData.city}, ${userData.state}`
                    : "Not provided"}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
        </CardContent>
      </Card>

      {/* Edit Profile Drawer */}
      <Drawer
        anchor="right"
        open={show1}
        onClose={handleClose1}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 560 },
            maxWidth: "100%",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" fontWeight="600">
            Edit Profile & KYC
          </Typography>
          <IconButton onClick={handleClose1}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 60px)",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              minHeight: 48,
              flexShrink: 0,
            }}
          >
            {kycTabs.map((tab, idx) => (
              <Tab
                key={tab.key}
                label={tab.label}
                id={`edit-tab-${idx}`}
                aria-controls={`edit-tabpanel-${idx}`}
              />
            ))}
          </Tabs>
          <Box
            sx={{ p: 2, overflowY: "auto", flex: 1 }}
            role="tabpanel"
            id={`edit-tabpanel-${activeTab}`}
            aria-labelledby={`edit-tab-${activeTab}`}
          >
            {activeTab === 0 && (
              <>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Basic info (name, phone, photo)
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12}>
                    <Typography variant="body2" fontWeight="500" gutterBottom>
                      Profile Picture
                    </Typography>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      id="profilepic-lawyer-edit"
                      style={{ display: "none" }}
                      onChange={(e) =>
                        setEditBasic((prev) => ({
                          ...prev,
                          profilepic: Array.from(e.target.files || []),
                        }))
                      }
                    />
                    <label htmlFor="profilepic-lawyer-edit">
                      <Button
                        component="span"
                        variant="outlined"
                        startIcon={<PhotoCameraIcon />}
                        fullWidth
                        sx={{
                          py: 1.5,
                          borderStyle: "dashed",
                          textTransform: "none",
                        }}
                      >
                        Upload Profile Picture
                      </Button>
                    </label>
                    {editBasic.profilepic?.length > 0 &&
                      editBasic.profilepic[0] instanceof File && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mt: 1 }}
                        >
                          Selected: {editBasic.profilepic[0].name}
                        </Typography>
                      )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Full Name"
                      value={editBasic.fullName ?? ""}
                      fullWidth
                      size="small"
                      variant="outlined"
                      onChange={(e) =>
                        setEditBasic((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone"
                      value={editBasic.phone ?? ""}
                      fullWidth
                      size="small"
                      variant="outlined"
                      onChange={(e) =>
                        setEditBasic((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                </Grid>
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={completeeditlawyerprofile}
                    disabled={uploading || isLoading}
                    startIcon={
                      isLoading ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : null
                    }
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </Button>
                  <Button variant="outlined" onClick={handleClose1}>
                    Cancel
                  </Button>
                </Box>
              </>
            )}
            {activeTab >= 1 && activeTab <= 6 && (
              <>
                {renderKycStepContent(activeTab - 1)}
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={completeeditlawyerprofile}
                    disabled={uploading || isLoading}
                    startIcon={
                      uploading || isLoading ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : null
                    }
                  >
                    {uploading
                      ? "Uploading..."
                      : isLoading
                      ? "Saving..."
                      : "Save"}
                  </Button>
                  <Button variant="outlined" onClick={handleClose1}>
                    Cancel
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* Loading Overlay - Simple */}
      {isLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress color="primary" />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Updating Profile...
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
};

export default LawyerProfile;
