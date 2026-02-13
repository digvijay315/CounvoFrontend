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
import { Edit as EditIcon, Close as CloseIcon } from "@mui/icons-material";
import Select from "react-select";
import { State, City } from "country-state-city";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import useAuth from "../../hooks/useAuth";
import { getUserDetails } from "../../redux/slices/authSlice";

const ClientProfile = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { user: userData, userId } = useAuth();
  const [showEdit, setShowEdit] = useState(false);

  const [edituserprofile, setedituserprofile] = useState({
    fullName: "",
    email: "",
    gender: "",
    dob: "",
    phone: "",
    residential_address: "",
    state: "",
    city: "",
    pin_code: "",
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

  // Sync city dropdown when edit drawer opens with existing user city
  useEffect(() => {
    if (showEdit && edituserprofile?.city && cityOptions.length > 0) {
      const cityOpt = cityOptions.find((c) => c.label === edituserprofile.city);
      if (cityOpt) setSelectedCity(cityOpt);
    }
  }, [showEdit, edituserprofile?.city, cityOptions]);

  const handleOpenEdit = () => {
    setShowEdit(true);
    // Prefill form from userData; map phone to phone for display
    const u = userData || {};
    const udetails = u.userDetails || {};
    setedituserprofile({
      fullName: u.fullName ?? "",
      email: u.email ?? "",
      gender: udetails.gender ?? "",
      dob:
        udetails.dob ??
        (udetails.dateOfBirth
          ? new Date(udetails.dateOfBirth).toISOString().slice(0, 10)
          : ""),
      phone: u.phone ?? udetails.contact_no ?? "",
      residential_address: udetails.residential_address ?? "",
      state: udetails.state ?? "",
      city: udetails.city ?? "",
      pin_code: udetails.pin_code ?? "",
    });
    const stateOpt = stateOptions.find(
      (o) => o.label === (udetails.state || ""),
    );
    setSelectedState(stateOpt || null);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
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
      const payload = { ...edituserprofile };
      const resp = await api.put(
        `api/user/updateuserprofile/${userId}`,
        payload,
      );
      if (resp.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile has been updated successfully.",
          showConfirmButton: true,
        });
        dispatch(getUserDetails());
        setedituserprofile({});
        handleCloseEdit();
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
                  Customer Account
                </Typography>
                {/* Action Buttons - Simple */}
                <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={handleOpenEdit}
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
                  {userData?.phone || "Not provided"}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {userData?.userDetails?.city && userData?.userDetails?.state
                    ? `${userData?.userDetails?.city}, ${userData?.userDetails?.state}`
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
        open={showEdit}
        onClose={handleCloseEdit}
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
            Edit Profile
          </Typography>
          <IconButton onClick={handleCloseEdit}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3, overflowY: "auto" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                name="fullName"
                value={edituserprofile.fullName ?? ""}
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
                value={edituserprofile.email ?? ""}
                type="text"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                disabled
                helperText="Email cannot be changed"
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
                name="phone"
                value={edituserprofile.phone ?? ""}
                type="tel"
                fullWidth
                size="small"
                variant="outlined"
                onChange={handleChangeedit}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Residential Address"
                name="residential_address"
                value={edituserprofile.residential_address ?? ""}
                type="text"
                fullWidth
                size="small"
                variant="outlined"
                onChange={handleChangeedit}
                placeholder="Street, area, landmark"
              />
            </Grid>

            <Grid item xs={12}>
              <Select
                className="react-select-container"
                classNamePrefix="react-select"
                options={stateOptions}
                value={
                  stateOptions.find(
                    (option) => option.label === edituserprofile?.state,
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
                    (option) => option.label === edituserprofile?.city,
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
                value={edituserprofile.pin_code ?? ""}
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
                <Button variant="outlined" onClick={handleCloseEdit}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={completeedituserprofile}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
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

export default ClientProfile;
