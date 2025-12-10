import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Button,
  MenuItem as MuiMenuItem,
  IconButton,
  Chip,
  Backdrop,
  Select,
  FormControl,
  Container,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Favorite,
  FavoriteBorder,
  Search as SearchIcon,
  Circle as CircleIcon,
} from "@mui/icons-material";
import useAuth from "../../hooks/useAuth";
import { useSocket } from "../../context/SocketContext";
import LawyerProfile from "../Lawyer/LawyerProfile";
import LawyerProfileCard from "../dashboard/LawyerProfileCard";

// ==================== CONSTANTS ====================
const SPECIALIZATIONS = [
  { value: "", label: "All Specializations" },
  { value: "property lawyer", label: "Property Lawyer" },
  { value: "family lawyer", label: "Family Lawyer" },
  { value: "civil lawyer", label: "Civil Lawyer" },
  { value: "cyber lawyer", label: "Cyber Lawyer" },
  { value: "criminal lawyer", label: "Criminal Lawyer" },
  { value: "consumer lawyer", label: "Consumer Lawyer" },
  { value: "labour lawyer", label: "Labour Lawyer" },
  { value: "legal notice drafting", label: "Legal Notice Drafting" },
  {
    value: "company law & corporate compliance",
    label: "Company Law & Corporate Compliance",
  },
];

const STATES = [
  { value: "", label: "All States" },
  { value: "maharashtra", label: "Maharashtra" },
  { value: "karnataka", label: "Karnataka" },
  { value: "delhi", label: "Delhi" },
  { value: "tamilnadu", label: "Tamil Nadu" },
];

// ==================== MAIN COMPONENT ====================
function FindLawyer() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { onlineLawyers } = useSocket();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [specialization, setSpecialization] = useState("");
  const [state, setState] = useState("");
  const [lawyers, setLawyers] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // ==================== DATA FETCHING ====================
  const fetchLawyers = useCallback(async () => {
    setIsLoading(true);
    try {
      const resp = await api.get("api/v2/lawyer/allprofiles");
      setLawyers(resp.data.filter((item) => item.status === "verified"));
    } catch (error) {
      console.error("Error fetching lawyers:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchFavorites = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await api.get(`api/user/get-favorite/${userId}`);
      const favIds = res.data.map((f) => f.lawyerId._id);
      setFavorites(favIds);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchLawyers();
  }, [fetchLawyers]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // ==================== ACTIONS ====================
  const handleStartChat = useCallback(
    async (lawyer) => {
      if (!userId) {
        Swal.fire({
          icon: "warning",
          title: "Please Login",
          text: "You need to login to chat with a lawyer.",
          showConfirmButton: true,
        });
        return;
      }

      setIsConnecting(true);

      try {
        // Create or get chat group
        const res = await api.post("/api/v2/chat/group", {
          fromUserId: userId,
          fromUserModel: "User",
          toUserId: lawyer._id,
          toUserModel: "Lawyer",
        });

        const chatGroupId = res.data._id;

        // Navigate to chat page with the lawyer's chat selected
        navigate(
          `/dashboard/messages?chatId=${chatGroupId}&lawyerId=${lawyer._id}`
        );
      } catch (error) {
        console.error("Error creating chat:", error);
        Swal.fire({
          icon: "error",
          title: "Connection Failed",
          text: "Failed to connect with the lawyer. Please try again.",
          timer: 3000,
          showConfirmButton: false,
        });
      } finally {
        setIsConnecting(false);
      }
    },
    [userId, navigate]
  );

  const handleToggleFavorite = useCallback(
    async (lawyerId) => {
      if (!userId) {
        Swal.fire({
          icon: "warning",
          title: "Please Login",
          text: "You need to login to add favorites.",
          showConfirmButton: true,
        });
        return;
      }

      try {
        const res = await api.post("api/user/add-to-favorite", {
          userId,
          lawyerId,
        });

        if (res.data.isFavorite) {
          setFavorites((prev) => [...prev, lawyerId]);
          Swal.fire({
            icon: "success",
            title: "Added to Favorites ❤️",
            text: "This lawyer has been added to your favorites list.",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          setFavorites((prev) => prev.filter((id) => id !== lawyerId));
          Swal.fire({
            icon: "info",
            title: "Removed from Favorites",
            text: "This lawyer has been removed from your favorites list.",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
        Swal.fire({
          icon: "error",
          title: "Something went wrong!",
          text: "Unable to update favorite. Please try again later.",
          confirmButtonColor: "#3b82f6",
        });
      }
    },
    [userId]
  );

  // ==================== FILTERED DATA ====================
  const filteredLawyers = lawyers.filter((lawyer) => {
    // Only show online lawyers
    if (!onlineLawyers.includes(lawyer._id)) return false;

    // Filter by specialization
    if (specialization) {
      const hasSpecialization = Array.isArray(lawyer.specializations)
        ? lawyer.specializations.some((spec) =>
            spec.label?.toLowerCase().includes(specialization.toLowerCase())
          )
        : (lawyer.specializations?.label || lawyer.specializations || "")
            .toLowerCase()
            .includes(specialization.toLowerCase());
      if (!hasSpecialization) return false;
    }

    // Filter by state
    if (state) {
      if (!lawyer.state?.toLowerCase().includes(state.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  const offlineLawyers = lawyers.filter(
    (lawyer) => !onlineLawyers.includes(lawyer._id)
  );

  // ==================== RENDER ====================
  return (
    <>
      {/* Connecting Backdrop */}
      <Backdrop
        open={isConnecting}
        sx={{
          zIndex: 9999,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress size={60} thickness={4} color="primary" />
          <Typography variant="h6" fontWeight="600" color="primary">
            Connecting you to the lawyer...
          </Typography>
        </Box>
      </Backdrop>

      {/* Header & Filters */}
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent sx={{ py: 4 }}>
          <Container maxWidth="md">
            <Typography
              variant="h3"
              gutterBottom
              fontWeight="700"
              textAlign="center"
              sx={{ mb: 1 }}
            >
              Find a Lawyer
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
              sx={{ mb: 3 }}
            >
              Connect instantly with verified lawyers who are online right now
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <FormControl sx={{ minWidth: 200 }}>
                <Select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  displayEmpty
                  size="medium"
                >
                  {SPECIALIZATIONS.map((spec) => (
                    <MuiMenuItem key={spec.value} value={spec.value}>
                      {spec.label}
                    </MuiMenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 200 }}>
                <Select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  displayEmpty
                  size="medium"
                >
                  {STATES.map((st) => (
                    <MuiMenuItem key={st.value} value={st.value}>
                      {st.label}
                    </MuiMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Container>
        </CardContent>
      </Card>

      {/* Online Lawyers Section */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 3,
          }}
        >
          <CircleIcon sx={{ color: "success.main", fontSize: 12 }} />
          <Typography variant="h5" fontWeight="600">
            Live Lawyers ({filteredLawyers.length})
          </Typography>
        </Box>

        {isLoading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <LawyerCardSkeleton />
              </Grid>
            ))}
          </Grid>
        ) : filteredLawyers.length === 0 ? (
          <Card variant="outlined" sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No lawyers are currently online
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {specialization || state
                ? "Try adjusting your filters or check back later."
                : "Please check back later when lawyers are available."}
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filteredLawyers.map((lawyer) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={lawyer._id}>
                <LawyerProfileCard
                  lawyer={lawyer}
                  isOnline={true}
                  isFavorite={favorites.includes(lawyer._id)}
                  onToggleFavorite={() => handleToggleFavorite(lawyer._id)}
                  onStartChat={() => handleStartChat(lawyer)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Offline Lawyers Section (Optional - Show a few) */}
      {!isLoading && offlineLawyers.length > 0 && (
        <Box sx={{ mb: 4, opacity: 0.7 }}>
          <Typography
            variant="h6"
            fontWeight="600"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Other Lawyers (Currently Offline)
          </Typography>
          <Grid container spacing={3}>
            {offlineLawyers.slice(0, 4).map((lawyer) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={lawyer._id}>
                <LawyerProfileCard
                  lawyer={lawyer}
                  isOnline={false}
                  isFavorite={favorites.includes(lawyer._id)}
                  onToggleFavorite={() => handleToggleFavorite(lawyer._id)}
                  onStartChat={() =>
                    Swal.fire({
                      icon: "info",
                      title: "Lawyer Offline",
                      text: "This lawyer is currently offline. Please try again later or choose an online lawyer.",
                      showConfirmButton: true,
                    })
                  }
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </>
  );
}

// ==================== SUB-COMPONENTS ====================

const LawyerCard = ({
  lawyer,
  isOnline,
  isFavorite,
  onToggleFavorite,
  onStartChat,
}) => {
  const getSpecializationText = () => {
    if (Array.isArray(lawyer.specializations)) {
      return lawyer.specializations.map((spec) => spec.label).join(", ");
    }
    return lawyer.specializations?.label || lawyer.specializations || "N/A";
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "all 0.3s ease",
        opacity: isOnline ? 1 : 0.6,
        "&:hover": {
          transform: isOnline ? "translateY(-4px)" : "none",
          boxShadow: isOnline ? 6 : 1,
        },
      }}
    >
      {/* Online Indicator */}
      {isOnline && (
        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            bgcolor: "success.main",
            color: "white",
            px: 1,
            py: 0.25,
            borderRadius: 1,
            fontSize: "0.7rem",
            fontWeight: 600,
          }}
        >
          <CircleIcon sx={{ fontSize: 8 }} />
          LIVE
        </Box>
      )}

      {/* Favorite Button */}
      <IconButton
        onClick={onToggleFavorite}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          bgcolor: "background.paper",
          boxShadow: 1,
          "&:hover": { bgcolor: "background.paper" },
        }}
        size="small"
      >
        {isFavorite ? (
          <Favorite color="error" fontSize="small" />
        ) : (
          <FavoriteBorder fontSize="small" />
        )}
      </IconButton>

      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          pt: 5,
        }}
      >
        <Avatar
          src={
            Array.isArray(lawyer.profilepic)
              ? lawyer.profilepic[0]
              : lawyer.profilepic
          }
          alt={`${lawyer.firstName} ${lawyer.lastName}`}
          sx={{
            width: 80,
            height: 80,
            mx: "auto",
            mb: 2,
            border: 3,
            borderColor: isOnline ? "success.main" : "grey.300",
          }}
        />

        <Typography variant="h6" fontWeight="600" gutterBottom noWrap>
          Adv. {lawyer.firstName} {lawyer.lastName}
        </Typography>

        <Box sx={{ mb: 2, flex: 1 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 0.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {getSpecializationText()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {lawyer.yearsOfExperience} years experience
          </Typography>
          {lawyer.state && (
            <Typography variant="caption" color="text.secondary">
              {lawyer.city ? `${lawyer.city}, ` : ""}
              {lawyer.state}
            </Typography>
          )}
        </Box>

        <Button
          variant={isOnline ? "contained" : "outlined"}
          color="primary"
          startIcon={<ChatIcon />}
          onClick={onStartChat}
          fullWidth
          disabled={!isOnline}
          sx={{
            mt: "auto",
            fontWeight: 600,
          }}
        >
          {isOnline ? "Start Chat" : "Offline"}
        </Button>
      </CardContent>
    </Card>
  );
};

const LawyerCardSkeleton = () => (
  <Card sx={{ height: "100%" }}>
    <CardContent sx={{ textAlign: "center", pt: 5 }}>
      <Skeleton
        variant="circular"
        width={80}
        height={80}
        sx={{ mx: "auto", mb: 2 }}
      />
      <Skeleton variant="text" width="70%" sx={{ mx: "auto", mb: 1 }} />
      <Skeleton variant="text" width="90%" sx={{ mx: "auto", mb: 0.5 }} />
      <Skeleton variant="text" width="60%" sx={{ mx: "auto", mb: 2 }} />
      <Skeleton variant="rectangular" height={36} sx={{ borderRadius: 1 }} />
    </CardContent>
  </Card>
);

export default FindLawyer;
