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
} from "@mui/material";
import {
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
} from "@mui/icons-material";
import Select from "react-select";
import { State, City } from "country-state-city";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const LawyerProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user: userData, userId } = useAuth();

  const [show, setShow] = useState(false);

  const handleShow = () => {
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
        `api/user/updateuserprofile/${userId}`,
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
    setedituserprofile(userData);
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
        `api/user/updateuserprofile/${userId}`,
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
                  Client Account
                </Typography>
                {/* Action Buttons - Simple */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "center",
                  }}
                >
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={handleShow1}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    startIcon={<CheckCircleIcon />}
                    onClick={handleShow}
                  >
                    Complete Profile
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
                  {userData?.contact_no || "Not provided"}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {userData?.city && userData?.state
                    ? `${userData?.city}, ${userData?.state}`
                    : "Not provided"}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
        </CardContent>
      </Card>

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
        {/* Header - Simple */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" fontWeight="600">
            Complete Your Profile
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3, overflowY: "auto" }}>
          <Grid container spacing={2}>
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
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button variant="outlined" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={completeuserprofile}
                >
                  Save Changes
                </Button>
              </Box>
            </Grid>
          </Grid>
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
        {/* Header - Simple */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" fontWeight="600">
            Edit Your Profile
          </Typography>
          <IconButton onClick={handleClose1}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3, overflowY: "auto" }}>
          <Grid container spacing={2}>
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
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button variant="outlined" onClick={handleClose1}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={completeedituserprofile}
                >
                  Save Changes
                </Button>
              </Box>
            </Grid>
          </Grid>
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
