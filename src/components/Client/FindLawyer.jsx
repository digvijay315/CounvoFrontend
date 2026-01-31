import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../api";
import {
  Box,
  Card,
  CardContent,
  Typography,
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
  LinearProgress,
  Paper,
  alpha,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Shuffle as ShuffleIcon,
  Close as CloseIcon,
  Timer as TimerIcon,
} from "@mui/icons-material";
import useAuth from "../../hooks/useAuth";
import { useSocket } from "../../context/SocketContext";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";
import {
  LawyerLanguages,
  LawyerPracticingCourts,
  LawyerSpecializations,
  LawyerStates,
} from "../../_constants/dataConstants";
import LawyerProfileCard from "../dashboard/LawyerProfileCard";
import { CarFront, IndianRupee, ShieldAlert, WalletCards } from "lucide-react";

// ==================== MAIN COMPONENT ====================
function FindLawyer() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const user = useSelector(selectUser);
  const { onlineLawyers, initiateChatRequest, pendingChatRequest } =
    useSocket();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [specialization, setSpecialization] = useState("");
  const [state, setState] = useState("");
  const [language, setLanguage] = useState("");
  const [practicingCourt, setPracticingCourt] = useState("");
  const [lawyers, setLawyers] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showSuggestionDialog, setShowSuggestionDialog] = useState(false);
  const [suggestedLawyer, setSuggestedLawyer] = useState(null);
  const [usedLawyerIds, setUsedLawyerIds] = useState([]);
  const [isQuickSearch, setIsQuickSearch] = useState(false);
  const [rejectedByLawyers, setRejectedByLawyers] = useState([]);
  const [requestTimer, setRequestTimer] = useState(60);

  // Timer for pending chat request
  const TIMEOUT_SECONDS = 60;
  const isWaitingForResponse =
    isConnecting || pendingChatRequest?.status === "pending";

  useEffect(() => {
    if (!isWaitingForResponse) {
      setRequestTimer(TIMEOUT_SECONDS);
      return;
    }

    const timer = setInterval(() => {
      setRequestTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isWaitingForResponse]);

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

  const fetchRejectedLawyers = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await api.get(`/api/v2/user/byId/${userId}`);
      if (res.data.success && res.data.user?.rejectedByLawyers) {
        setRejectedByLawyers(res.data.user.rejectedByLawyers);
      }
    } catch (error) {
      console.error("Error fetching rejected lawyers:", error);
    }
  }, [userId]);

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

  useEffect(() => {
    fetchRejectedLawyers();
  }, [fetchRejectedLawyers]);

  // Listen for chat request responses
  useEffect(() => {
    const handleChatAccepted = (e) => {
      const { chatGroupId } = e.detail;
      setIsConnecting(false);
      setShowSuggestionDialog(false);
      navigate(`/dashboard/messages?chatId=${chatGroupId}`);
    };

    const handleChatRejected = (e) => {
      const { lawyerId, message } = e.detail;
      setIsConnecting(false);
      // Add to rejected list locally
      setRejectedByLawyers((prev) => [...prev, lawyerId]);
      // Show rejection and offer to find another lawyer
      Swal.fire({
        icon: "info",
        title: "Lawyer Unavailable",
        text:
          message ||
          "This lawyer isn’t available for this request. Let's find you another lawyer!",
        confirmButtonText: "Find Another Lawyer",
        showCancelButton: true,
        cancelButtonText: "Close",
      }).then((result) => {
        if (result.isConfirmed && showSuggestionDialog) {
          handleFindAnotherLawyer();
        }
      });
    };

    const handleChatNotAccepted = (e) => {
      const { message } = e.detail;
      setIsConnecting(false);
      // Show timeout message (lawyer not added to rejected list - can try again)
      Swal.fire({
        icon: "warning",
        title: "Lawyer didn’t respond",
        text:
          message ||
          "The lawyer didn't respond in time. Would you like to try another lawyer?",
        confirmButtonText: "Find Another Lawyer",
        showCancelButton: true,
        cancelButtonText: "Close",
      }).then((result) => {
        if (result.isConfirmed && showSuggestionDialog) {
          handleFindAnotherLawyer();
        }
      });
    };

    window.addEventListener("chatRequestAccepted", handleChatAccepted);
    window.addEventListener("chatRequestRejected", handleChatRejected);
    window.addEventListener("chatRequestNotAccepted", handleChatNotAccepted);

    return () => {
      window.removeEventListener("chatRequestAccepted", handleChatAccepted);
      window.removeEventListener("chatRequestRejected", handleChatRejected);
      window.removeEventListener(
        "chatRequestNotAccepted",
        handleChatNotAccepted,
      );
    };
  }, [navigate, showSuggestionDialog]);

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

      // Check if lawyer is online
      if (!onlineLawyers.includes(lawyer._id)) {
        Swal.fire({
          icon: "info",
          title: "Lawyer Offline",
          text: "This lawyer is currently offline. Please try another lawyer.",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }

      setIsConnecting(true);

      // Send chat request via socket
      const clientInfo = {
        _id: userId,
        fullName: user?.fullName || "User",
        profilepic: user?.profilepic || [],
      };

      const success = initiateChatRequest(lawyer._id, clientInfo);

      if (!success) {
        setIsConnecting(false);
        Swal.fire({
          icon: "error",
          title: "Connection Failed",
          text: "Failed to send chat request. Please try again.",
          timer: 3000,
          showConfirmButton: false,
        });
      }
      // Note: isConnecting will be set to false by the event handlers
    },
    [userId, user, onlineLawyers, initiateChatRequest],
  );

  // ==================== FILTERED DATA ====================
  const filteredLawyers = useMemo(() => {
    return lawyers.filter((lawyer) => {
      // Only show online lawyers
      if (!onlineLawyers.includes(lawyer._id)) return false;

      // Exclude lawyers who have rejected this user
      if (rejectedByLawyers.includes(lawyer._id)) return false;

      let lawyerSpecializations =
          lawyer?.lawyerKycId?.professionalInfo?.specializations || [],
        lawyerLanguages =
          lawyer?.lawyerKycId?.professionalInfo?.languages || [],
        lawyerPracticingCourts =
          lawyer?.lawyerKycId?.professionalInfo?.practicingCourts || [];

      // Filter by specialization
      if (specialization) {
        const hasSpecialization = lawyerSpecializations.includes(
          specialization.toLowerCase(),
        );
        if (!hasSpecialization) return false;
      }

      try {
        // Filter by language
        if (language) {
          const hasLanguage = lawyerLanguages.includes(language.toLowerCase());
          if (!hasLanguage) return false;
        }

        // Filter by practicing court
        if (practicingCourt) {
          const hasPracticingCourt = lawyerPracticingCourts.includes(
            practicingCourt.toLowerCase(),
          );
          if (!hasPracticingCourt) return false;
        }
      } catch (error) {
        console.error("Error filtering lawyers:", error);
        return false;
      }

      return true;
    });
  }, [
    lawyers,
    onlineLawyers,
    specialization,
    state,
    isQuickSearch,
    rejectedByLawyers,
  ]);

  // ==================== SUGGESTION LOGIC ====================
  const getRandomLawyer = useCallback(
    (lawyerPool) => {
      // Filter out already suggested lawyers in this session
      const availableLawyers = lawyerPool.filter(
        (l) => !usedLawyerIds.includes(l._id),
      );

      // If all lawyers have been suggested, reset the pool
      if (availableLawyers.length === 0) {
        setUsedLawyerIds([]);
        return lawyerPool[Math.floor(Math.random() * lawyerPool.length)];
      }

      const randomIndex = Math.floor(Math.random() * availableLawyers.length);
      return availableLawyers[randomIndex];
    },
    [usedLawyerIds],
  );

  const findSuggestedLawyer = useCallback(() => {
    // Priority 1: Lawyers matching user preferences (specialization + language + practicingCourt)
    const preferredLawyers = filteredLawyers;

    // Priority 2: If preferences set and matches found
    if (
      preferredLawyers.length > 0 &&
      (specialization || language || practicingCourt)
    ) {
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
  }, [
    filteredLawyers,
    specialization,
    language,
    practicingCourt,
    getRandomLawyer,
  ]);

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
    const lng = searchCard.metadata.language[0] || "";
    const pCourt = searchCard.metadata.practicingCourts[0] || "";

    setSpecialization(spec);
    setLanguage(lng);
    setPracticingCourt(pCourt);
    setIsQuickSearch(true);

    // Reset used lawyer IDs for new search
    setUsedLawyerIds([]);

    document
      .getElementById("dashboard-content-area")
      ?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFindAnotherLawyer = () => {
    findSuggestedLawyer();
  };

  const handleCloseSuggestion = () => {
    setShowSuggestionDialog(false);
    setSuggestedLawyer(null);
    setUsedLawyerIds([]);
    // Reset filters if it was a quick search
    if (isQuickSearch) {
      setSpecialization("");
      setLanguage("");
      setPracticingCourt("");
      setIsQuickSearch(false);
    }
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
        open={isWaitingForResponse}
        sx={{
          zIndex: 9999,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            maxWidth: 400,
            width: "90%",
            textAlign: "center",
          }}
        >
          {/* Timer Bar */}
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mb: 1,
              }}
            >
              <TimerIcon
                sx={{
                  fontSize: 20,
                  color: requestTimer <= 15 ? "error.main" : "text.secondary",
                  animation: requestTimer <= 15 ? "pulse 1s infinite" : "none",
                  "@keyframes pulse": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.5 },
                  },
                }}
              />
              <Typography
                variant="body2"
                fontWeight="600"
                color={requestTimer <= 15 ? "error.main" : "text.secondary"}
              >
                {requestTimer}s remaining
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(requestTimer / TIMEOUT_SECONDS) * 100}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: "grey.200",
                "& .MuiLinearProgress-bar": {
                  bgcolor: requestTimer <= 15 ? "error.main" : "primary.main",
                  transition: "transform 1s linear",
                },
              }}
            />
          </Box>

          <CircularProgress
            size={60}
            thickness={4}
            color="primary"
            sx={{ mb: 2 }}
          />

          <Typography
            variant="h6"
            fontWeight="600"
            color="primary"
            gutterBottom
          >
            Waiting for lawyer to accept...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The lawyer will respond to your request shortly
          </Typography>
        </Paper>
      </Backdrop>

      {/* Header & Filters */}
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent sx={{ py: 4 }}>
          <Stack
            direction={{ xs: "column" }}
            justifyContent={{ xs: "center", sm: "space-between" }}
            alignItems="center"
            flexWrap={{ xs: "wrap", md: "nowrap" }}
            gap={2}
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
                      value={language || ""}
                      onChange={(e) => setLanguage(e.target.value)}
                      displayEmpty
                      size="medium"
                    >
                      {LawyerLanguages.map((lang) => (
                        <MuiMenuItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </MuiMenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl sx={{ minWidth: 200 }}>
                    <Select
                      value={practicingCourt || ""}
                      onChange={(e) => setPracticingCourt(e.target.value)}
                      displayEmpty
                      size="medium"
                    >
                      {LawyerPracticingCourts.map((court) => (
                        <MuiMenuItem key={court.value} value={court.value}>
                          {court.label}
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
                        px: { xs: 2, md: 3 },
                        py: { xs: 1, md: 1 },
                        borderRadius: 1,
                        width: "100%",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Typography variant="h2" fontWeight="700">
                        {item.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ textAlign: "start", lineHeight: 1.1, fontWeight:700 }}
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
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: alpha("#ffcd01", 0.4),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <Typography variant="h1" color="primary.main">
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
            {specialization || practicingCourt || language
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
            {!suggestedLawyer || filteredLawyers.length <= 1
              ? "No other lawyer available right now."
              : "Find Another Lawyer"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// ==================== PREDEFINED SEARCHES ====================
const PREDEFINED_SEARCHES = [
  {
    label: "Vehicle Challan",
    description: "Get expert help with your challan issue",
    icon: <CarFront />,
    metadata: {
      specialization: ["civil lawyer"],
      language: [],
      practicingCourts: [],
    },
  },
  {
    label: "Cheque Bounce",
    description: "Get expert help with your cheque bounce issue",
    icon: <IndianRupee />,
    metadata: {
      specialization: ["criminal lawyer"],
      language: [],
      practicingCourts: [],
    },
  },
  {
    label: "product/service default",
    description: "Get expert help with your product/service default issue",
    icon: <WalletCards />,
    metadata: {
      specialization: ["consumer lawyer"],
      language: [],
      practicingCourts: [],
    },
  },
  {
    label: "Online Fraud",
    description: "Get expert help with your online fraud issue",
    icon: <ShieldAlert />,
    metadata: {
      specialization: ["cyber lawyer"],
      language: [],
      practicingCourts: [],
    },
  },
];

export default FindLawyer;
