import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useLawyer from "../../hooks/useLawyer";
import {
  Button,
  CircularProgress,
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Stack,
} from "@mui/material";
import {
  Email,
  Phone,
  LocationOn,
  Gavel,
  ArrowBack,
  Payment,
} from "@mui/icons-material";
import usePayment from "../../hooks/usePayment";
import { getLawyerFormattedData } from "../dashboard/LawyerProfileCard";
import { toast } from "react-toastify";

const LawyerProfilePage = () => {
  const { lawyerId } = useParams();
  const navigate = useNavigate();
  const { lawyer, isLoading: lawyerLoading } = useLawyer(lawyerId);
  const lawyerData = useMemo(() => getLawyerFormattedData(lawyer), [lawyer]);
  const { initializePayment, isLoading: paymentLoading } = usePayment();

  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    amount: "",
    consultationType: "online",
    notes: "",
  });

  const handleOpenDialog = () => {
    setOpenPaymentDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenPaymentDialog(false);
    setPaymentDetails({
      amount: "",
      consultationType: "online",
      notes: "",
    });
  };

  const handlePaymentDetailsChange = (field) => (event) => {
    setPaymentDetails((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handlePayment = async () => {
    // Validate amount
    if (!paymentDetails.amount || paymentDetails.amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      // Convert amount to paise (multiply by 100)
      const amountInPaise = Math.round(parseFloat(paymentDetails.amount) * 100);
      await initializePayment(lawyerId, amountInPaise, {
        consultation: paymentDetails.consultationType,
        consultationType: paymentDetails.consultationType,
        additionalNotes: paymentDetails.notes,
      });
      handleCloseDialog();
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  if (lawyerLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!lawyer) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h6">Lawyer not found</Typography>
        <Button onClick={() => navigate(-1)} startIcon={<ArrowBack />}>
          Go Back
        </Button>
      </Container>
    );
  }

  const lawyerKyc = lawyer.lawyerKycId;

  return (
    <>
      <Paper elevation={0} sx={{ p: 4, border: "1px solid #e0e0e0" }}>
        <Stack direction="row" spacing={4}>
          {/* Profile Header */}
          <Box sx={{ textAlign: "center" }}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="flex-start"
              justifyContent="center"
            >
              <Avatar
                sx={{
                  width: 150,
                  height: 150,
                  mx: "auto",
                  mb: 2,
                  bgcolor: "primary.main",
                  fontSize: "3rem",
                }}
              >
                {lawyer.fullName?.charAt(0) || "L"}
              </Avatar>
              <Box>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Typography variant="h5" fontWeight="600" gutterBottom>
                    {lawyer.fullName || "N/A"}
                  </Typography>
                  {lawyer.status === "verified" && (
                    <Chip
                      label="Verified"
                      color="success"
                      size="small"
                    />
                  )}
                </Box>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Email fontSize="small" color="action" />
                  <Typography>{lawyer.email || "N/A"}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Phone fontSize="small" color="action" />
                  <Typography>{lawyer.phone || "N/A"}</Typography>
                </Box>
              </Box>
            </Stack>
            <Button
              startIcon={<Payment />}
              variant="contained"
              fullWidth
              size="large"
              onClick={handleOpenDialog}
              disabled={paymentLoading}
              sx={{ mt: 2 }}
            >
              Pay for Consultation
            </Button>
          </Box>

          {/* Profile Details */}
          <Box sx={{ flex: 1, width: "100%" }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Professional Details
            </Typography>
            <Box sx={{ mb: 3 }}>
              {lawyerData?.barCouncilInfo && (
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Gavel fontSize="small" color="action" />
                  <Typography>
                    <strong>Bar Council Number:</strong>{" "}
                    {lawyerData?.barCouncilInfo.barEnrollmentNumber}
                  </Typography>
                </Box>
              )}
              {lawyerData?.lawyerSpecialization &&
                lawyerData?.lawyerSpecialization.length > 0 && (
                  <Box mb={1}>
                    <Typography fontWeight="600" gutterBottom>
                      Specialization:
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {lawyerData?.lawyerSpecialization.map((spec, index) => (
                        <Chip key={index} label={spec} size="small" />
                      ))}
                    </Box>
                  </Box>
                )}
            </Box>

            {lawyerData.professionalBio && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  About
                </Typography>
                <Typography color="text.secondary">
                  {lawyerData.professionalBio}
                </Typography>
                {lawyerKyc?.address && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography>{lawyerKyc.address}</Typography>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Stack>
      </Paper>

      {/* Payment Dialog */}
      <Dialog
        open={openPaymentDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Payment Details</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Amount"
              type="number"
              fullWidth
              required
              value={paymentDetails.amount}
              onChange={handlePaymentDetailsChange("amount")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
              helperText="Enter consultation fee amount"
            />
            <TextField
              label="Consultation Type"
              select
              fullWidth
              required
              value={paymentDetails.consultationType}
              onChange={handlePaymentDetailsChange("consultationType")}
              SelectProps={{
                native: true,
              }}
            >
              <option value="online">Online</option>
              <option value="in-person">In-Person</option>
              <option value="phone">Phone</option>
            </TextField>
            <TextField
              label="Additional Notes"
              multiline
              rows={4}
              fullWidth
              value={paymentDetails.notes}
              onChange={handlePaymentDetailsChange("notes")}
              placeholder="Add any additional information about your consultation..."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} disabled={paymentLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePayment}
            disabled={paymentLoading}
          >
            {paymentLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Proceed to Payment"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LawyerProfilePage;
