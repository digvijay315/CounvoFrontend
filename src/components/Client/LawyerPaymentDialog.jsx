import React from "react";
import usePayment from "../../hooks/usePayment";
import { useState, useImperativeHandle, forwardRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
  Box,
  Typography,
  Stack,
  Paper,
  Divider,
  Chip,
  Collapse,
} from "@mui/material";
import {
  Receipt as ReceiptIcon,
  AccountBalance as AccountBalanceIcon,
  Payment as PaymentIcon,
  ExpandMore,
} from "@mui/icons-material";
import { toast } from "react-toastify";

let PlatformFee = parseFloat(process.env.REACT_APP_PLATFORM_FEE || 0.15);
let GstPercent = parseFloat(process.env.REACT_APP_GST_PERCENT || 18);
const LawyerPaymentDialog = forwardRef(({ lawyerId }, ref) => {
  const { initializePayment, isLoading: paymentLoading } = usePayment();
  const [showFeeBreakdown, setShowFeeBreakdown] = useState(false);
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
    let value = event.target.value;
    if (value > 0) {
      setPaymentDetails((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    }
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
  useImperativeHandle(ref, () => ({
    handleOpen: handleOpenDialog,
    handleClose: handleCloseDialog,
  }));

  let amountEntered = !Number.isNaN(paymentDetails?.amount) && paymentDetails?.amount > 0;
  return (
    <Dialog
      open={openPaymentDialog}
      onClose={handleCloseDialog}
      maxWidth={amountEntered ? "lg" : "sm"}
      fullWidth
    >
      <DialogTitle>Payment Details</DialogTitle>
      <DialogContent>
        <Stack direction={{ xs: "column", md: amountEntered ? "row" : "column" }} spacing={2}>
          <Box sx={{ minWidth: "60%", pt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
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
          </Box>
          {amountEntered && (
            <Paper
              elevation={0}
              sx={{
                minWidth: "40%",
                bgcolor: "grey.50",
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <ReceiptIcon />
                <Typography variant="h6" fontWeight="600">
                  Payment Summary
                </Typography>
              </Box>

              {/* Payment Details */}
              <Box sx={{ p: 2.5 }}>
                <Stack spacing={1.5}>
                  {/* Consultation Fee */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body2" color="text.secondary">
                      Consultation Fee
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      ₹{Number(paymentDetails.amount).toFixed(2)}
                    </Typography>
                  </Stack>

                  {/* Collapsible Fee Breakdown */}
                  <Box>
                    <Button
                      onClick={() => setShowFeeBreakdown(!showFeeBreakdown)}
                      endIcon={
                        <ExpandMore
                          sx={{
                            transform: showFeeBreakdown ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s',
                          }}
                        />
                      }
                      sx={{
                        justifyContent: 'space-between',
                        textTransform: 'none',
                        color: 'text.secondary',
                        p: 0,
                        '&:hover': {
                          bgcolor: 'transparent',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Fee Breakdown
                      </Typography>
                    </Button>

                    <Collapse in={showFeeBreakdown}>
                      <Stack spacing={1.5} sx={{ mt: 1 }}>
                        {/* Platform Fee */}
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body2" color="text.secondary">
                            Platform Fee
                          </Typography>
                          <Typography variant="body2" fontWeight="600">
                            +₹{(Number(paymentDetails.amount) * PlatformFee).toFixed(2)}
                          </Typography>
                        </Stack>

                        {/* GST */}
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body2" color="text.secondary">
                            GST ({GstPercent.toFixed(0)}%)
                          </Typography>
                          <Typography variant="body2" fontWeight="600">
                            +₹{((Number(paymentDetails.amount) * PlatformFee) * (GstPercent / 100)).toFixed(2)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Collapse>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  {/* Total Amount */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      p: 1.5,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body1" fontWeight="600">
                      Total Payable
                    </Typography>
                    <Typography variant="h5" fontWeight="700">
                      ₹
                      {(
                        Number(paymentDetails.amount) +
                        Number(paymentDetails.amount) * PlatformFee +
                        (Number(paymentDetails.amount) * PlatformFee) * (GstPercent / 100)
                      ).toFixed(2)}
                    </Typography>
                  </Stack>

                  {/* Payment Method */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 1,
                      bgcolor: "info.lighter",
                      borderRadius: 1,
                    }}
                  >
                    <PaymentIcon sx={{ color: "info.main", fontSize: 20 }} />
                    <Typography variant="caption" color="info.dark">
                      Secure payment powered by Razorpay
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    <b>Note:</b> This amount is the professional fee charged by the lawyer. Counvo does not
                    set or control lawyer fees.<br />
                    Counvo charges a platform service fee for providing secure payments, communication tools,
                    and lawyer discovery. This is separate from the lawyer’s fee.
                  </Typography>
                </Stack>
              </Box>
            </Paper>
          )}
        </Stack>
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
  );
});

export default LawyerPaymentDialog;
