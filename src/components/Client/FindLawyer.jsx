import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  MenuItem as MuiMenuItem,
  IconButton,
  Backdrop,
  Select,
  FormControl,
  Container,
  CircularProgress,
  Stack,
  Dialog,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Favorite,
  FavoriteBorder,
  Circle as CircleIcon,
  Shuffle as ShuffleIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import useAuth from "../../hooks/useAuth";
import { useSocket } from "../../context/SocketContext";
import {
  LawyerSpecializations,
  LawyerStates,
} from "../../_constants/dataConstants";
import LawyerProfileCard from "../dashboard/LawyerProfileCard";

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
  const [showSuggestionDialog, setShowSuggestionDialog] = useState(false);
  const [suggestedLawyer, setSuggestedLawyer] = useState(null);
  const [usedLawyerIds, setUsedLawyerIds] = useState([]);
  const [isQuickSearch, setIsQuickSearch] = useState(false);

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
        navigate(`/dashboard/messages?chatId=${chatGroupId}`);
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

  // ==================== FILTERED DATA ====================
  const filteredLawyers = useMemo(() => {
    return lawyers.filter((lawyer) => {
      // Only show online lawyers
      if (!onlineLawyers.includes(lawyer._id)) return false;

      // Filter by specialization
      if (specialization) {
        const hasSpecialization = Array.isArray(lawyer.specializations)
          ? lawyer.specializations.some((spec) => {
              // Strict matching for quick search, fuzzy for manual search
              if (isQuickSearch) {
                return (
                  spec.label?.toLowerCase() === specialization.toLowerCase()
                );
              }
              return spec.label
                ?.toLowerCase()
                .includes(specialization.toLowerCase());
            })
          : isQuickSearch
          ? (
              lawyer.specializations?.label ||
              lawyer.specializations ||
              ""
            ).toLowerCase() === specialization.toLowerCase()
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
  }, [lawyers, onlineLawyers, specialization, state, isQuickSearch]);

  // ==================== SUGGESTION LOGIC ====================
  const getRandomLawyer = useCallback(
    (lawyerPool) => {
      // Filter out already suggested lawyers in this session
      const availableLawyers = lawyerPool.filter(
        (l) => !usedLawyerIds.includes(l._id)
      );

      // If all lawyers have been suggested, reset the pool
      if (availableLawyers.length === 0) {
        setUsedLawyerIds([]);
        return lawyerPool[Math.floor(Math.random() * lawyerPool.length)];
      }

      const randomIndex = Math.floor(Math.random() * availableLawyers.length);
      return availableLawyers[randomIndex];
    },
    [usedLawyerIds]
  );

  const findSuggestedLawyer = useCallback(() => {
    // Priority 1: Lawyers matching user preferences (specialization + state)
    const preferredLawyers = filteredLawyers.filter((lawyer) => {
      if (specialization && state) {
        // Both filters applied
        return true; // Already filtered by filteredLawyers
      }
      return true;
    });

    // Priority 2: If preferences set and matches found
    if (preferredLawyers.length > 0 && (specialization || state)) {
      const lawyer = getRandomLawyer(preferredLawyers);
      setSuggestedLawyer(lawyer);
      setUsedLawyerIds((prev) => [...prev, lawyer._id]);
      return;
    }

    // Priority 3: Any available online lawyer
    if (filteredLawyers.length > 0) {
      const lawyer = getRandomLawyer(filteredLawyers);
      setSuggestedLawyer(lawyer);
      setUsedLawyerIds((prev) => [...prev, lawyer._id]);
      return;
    }

    // No lawyers available
    Swal.fire({
      icon: "info",
      title: "No Lawyers Available",
      text: "No lawyers are currently online matching your criteria. Please try adjusting your filters or check back later.",
      showConfirmButton: true,
    });
  }, [filteredLawyers, specialization, state, getRandomLawyer]);

  const handleFindLawyer = () => {
    if (filteredLawyers.length === 0) {
      const message =
        isQuickSearch && specialization
          ? `No lawyers with specialization "${specialization}" are currently online. Please try another category or check back later.`
          : "No lawyers are currently online. Please check back later.";

      Swal.fire({
        icon: "info",
        title: "No Lawyers Available",
        text: message,
        showConfirmButton: true,
      });
      return;
    }

    findSuggestedLawyer();
    setShowSuggestionDialog(true);
  };

  const handleQuickSearch = (searchCard) => {
    // Set filters from predefined card
    const spec = searchCard.metadata.specialization[0] || "";
    const st = searchCard.metadata.state[0] || "";

    setSpecialization(spec);
    setState(st);
    setIsQuickSearch(true);

    // Reset used lawyer IDs for new search
    setUsedLawyerIds([]);

    // Trigger search after a brief delay to allow state updates
    setTimeout(() => {
      handleFindLawyer();
    }, 100);
  };

  const handleFindAnotherLawyer = () => {
    findSuggestedLawyer();
  };

  const handleCloseSuggestion = () => {
    setShowSuggestionDialog(false);
    setSuggestedLawyer(null);
    setUsedLawyerIds([]);
  };

  const handleConnectWithSuggested = () => {
    if (suggestedLawyer) {
      handleStartChat(suggestedLawyer);
      setShowSuggestionDialog(false);
    }
  };

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
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
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

              <Stack
                direction="column"
                spacing={2}
                justifyContent="center"
                alignItems={"center"}
              >
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
                      {LawyerSpecializations.map((spec) => (
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
                      {LawyerStates.map((st) => (
                        <MuiMenuItem key={st.value} value={st.value}>
                          {st.label}
                        </MuiMenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => {
                    setIsQuickSearch(false);
                    handleFindLawyer();
                  }}
                  disabled={isLoading}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    boxShadow: 3,
                    "&:hover": {
                      boxShadow: 6,
                    },
                  }}
                >
                  {isLoading ? "Loading..." : "Find a Lawyer"}
                </Button>
              </Stack>
            </Container>
            <Stack
              direction={{ xs: "row", md: "column" }}
              spacing={{ xs: 2, md: 4 }}
              justifyContent="center"
              alignItems="center"
            >
              {[
                { label: "Online<br/>Lawyers", value: filteredLawyers.length },
                { label: "Total<br/>Lawyers", value: lawyers.length },
              ]
                .filter((item) => item.value > 0)
                .map((item) => (
                  <React.Fragment key={item.label}>
                    <Box
                      sx={{
                        color: "primary.dark",
                        border: "1px solid",
                        borderColor: "primary.dark",
                        px: { xs: 2, md: 5 },
                        py: { xs: 1, md: 3 },
                        borderRadius: 1,
                        width: "100%",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Typography variant="h1" fontWeight="700">
                        {item.value}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ textAlign: "start", lineHeight: 1.1 }}
                        dangerouslySetInnerHTML={{ __html: item.label }}
                      />
                    </Box>
                  </React.Fragment>
                ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      {/* Quick Search Cards */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="600" sx={{ textAlign: "start" }}>
          Quick Search Categories
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3, textAlign: "start" }}
        >
          Choose a category to find specialized lawyers instantly
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          justifyContent="center"
          alignItems="stretch"
        >
          {PREDEFINED_SEARCHES.map((searchCard, index) => (
            <Card
              key={index}
              sx={{
                flex: 1,
                maxWidth: { xs: "100%", sm: 400 },
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "2px solid transparent",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                  borderColor: "primary.main",
                },
              }}
              onClick={() => handleQuickSearch(searchCard)}
            >
              <CardContent sx={{ p: 3, textAlign: "center" }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    bgcolor: "primary.light",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <Typography variant="h4" color="primary.main">
                    {searchCard.icon || "⚖️"}
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  {searchCard.label}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {searchCard.description}
                </Typography>
                <Chip
                  label={searchCard.metadata.specialization[0]}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* Suggestion Dialog */}
      <Dialog
        open={showSuggestionDialog}
        onClose={handleCloseSuggestion}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: 500,
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            bgcolor: "primary.main",
            color: "white",
            py: 2,
            px: 3,
          }}
        >
          <Typography variant="h5" fontWeight="600" textAlign="center">
            {specialization || state
              ? "Suggested Lawyer (Based on Your Preferences)"
              : "Suggested Lawyer"}
          </Typography>
          <IconButton
            onClick={handleCloseSuggestion}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ pt: 3, pb: 2 }}>
          {suggestedLawyer ? (
            <LawyerProfileCard
              lawyer={suggestedLawyer}
              isOnline={true}
              showActions={false}
            />
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            pt: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            startIcon={<ChatIcon />}
            onClick={handleConnectWithSuggested}
            disabled={!suggestedLawyer}
            sx={{
              py: 1.5,
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            Connect with This Lawyer
          </Button>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            size="large"
            startIcon={<ShuffleIcon />}
            onClick={handleFindAnotherLawyer}
            disabled={!suggestedLawyer || filteredLawyers.length <= 1}
            sx={{
              py: 1.5,
              fontWeight: 600,
            }}
          >
            Find Another Lawyer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// ==================== PREDEFINED SEARCHES ====================
const PREDEFINED_SEARCHES = [
  {
    label: "Financial Advice",
    description: "Get expert financial advice from a qualified lawyer",
    icon: "💰",
    metadata: {
      specialization: ["civil lawyer"],
      state: [],
      practicingCourts: [],
    },
  },
  {
    label: "Challan Issue",
    description: "Get expert help with your challan issue",
    icon: "🚗",
    metadata: {
      specialization: ["civil lawyer"],
      state: [],
      practicingCourts: [],
    },
  },
  {
    label: "Property Disputes",
    description: "Resolve property and real estate legal matters",
    icon: "🏠",
    metadata: {
      specialization: ["civil lawyer"],
      state: [],
      practicingCourts: [],
    },
  },
  {
    label: "Family Law",
    description: "Get assistance with family and matrimonial issues",
    icon: "👨‍👩‍👧",
    metadata: {
      specialization: ["civil lawyer"],
      state: [],
      practicingCourts: [],
    },
  },
];

export default FindLawyer;
