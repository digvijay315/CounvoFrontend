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
  Tabs,
  Tab,
  Divider,
  Paper,
  Container,
} from "@mui/material";
import {
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
} from "@mui/icons-material";
import Select from "react-select";
import { State, City } from "country-state-city";
import Swal from "sweetalert2";

const ClientProfileModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userDetails"));

  const [show, setShow] = useState(false);
  const [activeTab1, setActiveTab1] = useState(0);

  const handleShow = () => {
    setActiveTab1(0);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  const [clientprofile, setclientprofile] = useState({
    profilepic: [],
    gender: "",
    dob: "",
    contact_no: "",
    residential_address: "",
    state: "",
    city: "",
    pin_code: "",
    corrosponding_address: "",
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
      setSelectedCity(null); // reset city when state changes
    }
  }, [selectedState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setclientprofile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const completeuserprofile = async () => {
    try {
      setIsLoading(true);
      const resp = await api.put(
        `api/user/updateuserprofile/${userData.user._id}`,
        clientprofile,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (resp.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your Profile Completed Successfully",
          showConfirmButton: "true",
        });
        setclientprofile([]);
        handleClose();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  //================================== edit profile start=========================================================

  const [edituserprofile, setedituserprofile] = useState({
    fullName: "",
    email: "",
    username: "",
    profilepic: [],
    gender: "",
    dob: "",
    contact_no: "",
    residential_address: "",
    state: "",
    city: "",
    pin_code: "",
    corrosponding_address: "",
  });

  const [show1, setShow1] = useState(false);
  const [activeTab2, setActiveTab2] = useState(0);

  const handleShow1 = () => {
    setActiveTab2(0);
    setShow1(true);
    setedituserprofile(userData.user);
  };

  const handleClose1 = () => {
    setShow1(false);
  };

  const handleChangeedit = (e) => {
    const { name, value } = e.target;
    setedituserprofile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const completeedituserprofile = async () => {
    try {
      setIsLoading(true);
      const resp = await api.put(
        `api/user/updateuserprofile/${userData.user._id}`,
        edituserprofile,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (resp.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your Profile Completed Successfully",
          showConfirmButton: "true",
        });
        setedituserprofile([]);
        handleClose1();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Card */}
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Box sx={{ p: 4, textAlign: "center", color: "white" }}>
          <Typography variant="h4" fontWeight="700" gutterBottom>
            My Profile
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Manage your personal information
          </Typography>
        </Box>

        <Card
          sx={{
            m: 3,
            mt: -2,
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Avatar Section */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Avatar
                src={userData?.user?.profilepic?.[0]}
                alt="Profile"
                sx={{
                  width: 120,
                  height: 120,
                  border: "4px solid",
                  borderColor: "#667eea",
                  boxShadow: "0 4px 20px rgba(102,126,234,0.3)",
                  mb: 2,
                }}
              />
              <Typography variant="h5" fontWeight="600" gutterBottom>
                {userData?.user?.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Client Account
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Profile Info Grid */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: "#667eea15",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PersonIcon sx={{ color: "#667eea" }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {userData?.user?.fullName || "Not provided"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: "#667eea15",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <EmailIcon sx={{ color: "#667eea" }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Email Address
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {userData?.user?.email || "Not provided"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: "#667eea15",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PhoneIcon sx={{ color: "#667eea" }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Contact Number
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {userData?.user?.contact_no || "Not provided"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: "#667eea15",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LocationOnIcon sx={{ color: "#667eea" }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {userData?.user?.city && userData?.user?.state
                        ? `${userData?.user?.city}, ${userData?.user?.state}`
                        : "Not provided"}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleShow1}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  boxShadow: "0 4px 15px rgba(102,126,234,0.4)",
                  "&:hover": {
                    boxShadow: "0 6px 20px rgba(102,126,234,0.6)",
                  },
                }}
              >
                Edit Profile
              </Button>
              <Button
                variant="outlined"
                startIcon={<CheckCircleIcon />}
                onClick={handleShow}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: "#667eea",
                  color: "#667eea",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "#764ba2",
                    background: "#667eea10",
                  },
                }}
              >
                Complete Profile
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Paper>

      {/* Complete Profile Drawer */}
      <Drawer
        anchor="right"
        open={show}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 500 },
            maxWidth: "100%",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #e5e7eb",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <Typography variant="h6" fontWeight="600">
            Complete Your Profile
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab1}
          onChange={(e, newValue) => setActiveTab1(newValue)}
          sx={{
            borderBottom: "1px solid #e5e7eb",
            px: 2,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
            },
          }}
        >
          <Tab label="Personal Details" />
        </Tabs>

        {/* Content */}
        <Box sx={{ p: 3, overflowY: "auto" }}>
          {activeTab1 === 0 && (
            <>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Personal Details
              </Typography>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="body2" fontWeight="500" gutterBottom>
                    Profile Picture
                  </Typography>
                  <input
                    name="profilepic"
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    id="profilepic-complete"
                    style={{ display: "none" }}
                    onChange={(e) =>
                      setclientprofile({
                        ...clientprofile,
                        profilepic: Array.from(e.target.files),
                      })
                    }
                  />
                  <label htmlFor="profilepic-complete">
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

                  {clientprofile.profilepic?.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Selected: {clientprofile.profilepic[0].name}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Gender"
                    name="gender"
                    fullWidth
                    size="small"
                    variant="outlined"
                    onChange={handleChange}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Contact Number"
                    name="contact_no"
                    type="tel"
                    fullWidth
                    size="small"
                    variant="outlined"
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Select
                    className="react-select-container"
                    classNamePrefix="react-select"
                    options={stateOptions}
                    value={selectedState}
                    onChange={(value) => {
                      setSelectedState(value);
                      setclientprofile((prev) => ({
                        ...prev,
                        state: value.label,
                      }));
                    }}
                    name="state"
                    placeholder="Select State"
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Select
                    className="react-select-container"
                    classNamePrefix="react-select"
                    options={cityOptions}
                    value={selectedCity}
                    onChange={(value) => {
                      setSelectedCity(value);
                      setclientprofile((prev) => ({
                        ...prev,
                        city: value.label, // stores the state's name like "Maharashtra"
                      }));
                    }}
                    name="city"
                    placeholder="Select City"
                    isDisabled={!selectedState}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="PIN Code"
                    name="pin_code"
                    type="text"
                    inputProps={{ maxLength: 6 }}
                    fullWidth
                    size="small"
                    variant="outlined"
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleClose}
                      sx={{ textTransform: "none" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={completeuserprofile}
                      sx={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        textTransform: "none",
                      }}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </Drawer>

      {/* Edit Profile Drawer */}
      <Drawer
        anchor="right"
        open={show1}
        onClose={handleClose1}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 500 },
            maxWidth: "100%",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #e5e7eb",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <Typography variant="h6" fontWeight="600">
            Edit Your Profile
          </Typography>
          <IconButton onClick={handleClose1} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab2}
          onChange={(e, newValue) => setActiveTab2(newValue)}
          sx={{
            borderBottom: "1px solid #e5e7eb",
            px: 2,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
            },
          }}
        >
          <Tab label="Personal Details" />
        </Tabs>

        {/* Content */}
        <Box sx={{ p: 3, overflowY: "auto" }}>
          {activeTab2 === 0 && (
            <>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Personal Details
              </Typography>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="body2" fontWeight="500" gutterBottom>
                    Profile Picture
                  </Typography>
                  <input
                    name="profilepic"
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    id="profilepic-edit"
                    style={{ display: "none" }}
                    onChange={(e) =>
                      setedituserprofile({
                        ...edituserprofile,
                        profilepic: Array.from(e.target.files),
                      })
                    }
                  />
                  <label htmlFor="profilepic-edit">
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

                  {edituserprofile.profilepic?.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Selected: {edituserprofile.profilepic[0].name}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Full Name"
                    name="fullName"
                    defaultValue={edituserprofile.fullName}
                    type="text"
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    onChange={handleChangeedit}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    name="email"
                    defaultValue={edituserprofile.email}
                    type="text"
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    onChange={handleChangeedit}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="User Name"
                    name="username"
                    defaultValue={edituserprofile.username}
                    type="text"
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    onChange={handleChangeedit}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Gender"
                    name="gender"
                    fullWidth
                    size="small"
                    value={edituserprofile.gender}
                    variant="outlined"
                    onChange={handleChangeedit}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Date of Birth"
                    name="dob"
                    value={edituserprofile.dob}
                    type="date"
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    onChange={handleChangeedit}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Contact Number"
                    name="contact_no"
                    type="tel"
                    fullWidth
                    size="small"
                    variant="outlined"
                    onChange={handleChangeedit}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Select
                    className="react-select-container"
                    classNamePrefix="react-select"
                    options={stateOptions}
                    value={
                      stateOptions.find(
                        (option) => option.label === edituserprofile?.state
                      ) || selectedState
                    }
                    onChange={(value) => {
                      setSelectedState(value);
                      setedituserprofile((prev) => ({
                        ...prev,
                        state: value.label, // Store only the state's name
                      }));
                    }}
                    name="state"
                    placeholder="Select State"
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Select
                    className="react-select-container"
                    classNamePrefix="react-select"
                    options={cityOptions}
                    value={
                      cityOptions.find(
                        (option) => option.label === edituserprofile?.city
                      ) || selectedCity
                    }
                    onChange={(value) => {
                      setSelectedCity(value);
                      setedituserprofile((prev) => ({
                        ...prev,
                        city: value.label, // Store only the city's name
                      }));
                    }}
                    name="city"
                    placeholder="Select City"
                    isDisabled={!selectedState?.label} // Disable if state is not selected
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="PIN Code"
                    name="pin_code"
                    value={edituserprofile.pin_code}
                    type="text"
                    inputProps={{ maxLength: 6 }}
                    fullWidth
                    size="small"
                    variant="outlined"
                    onChange={handleChangeedit}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleClose1}
                      sx={{ textTransform: "none" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={completeedituserprofile}
                      sx={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        textTransform: "none",
                      }}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </Drawer>

      {/* Loading Overlay */}
      {isLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backdropFilter: "blur(10px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" fontWeight="600" color="primary">
              Updating Profile...
            </Typography>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default ClientProfileModal;
