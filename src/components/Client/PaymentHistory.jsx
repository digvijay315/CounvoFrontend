import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Pagination,
  Card,
  CardContent,
  Grid,
  IconButton,
} from "@mui/material";
import { Payment, CheckCircle, Cancel, Pending, FileDownload } from "@mui/icons-material";
import usePaymentHistory from "../../hooks/usePaymentHistory";
import { generateInvoicePDF } from "../../utils";

let PlatformFee = parseFloat(process.env.REACT_APP_PLATFORM_FEE || 0.05);
let GstPercent = parseFloat(process.env.REACT_APP_GST_PERCENT || 18);

const PaymentHistory = () => {
  const [page, setPage] = useState(1);
  const { payments, pagination, statistics, isLoading, error } =
    usePaymentHistory(page, 10);

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "success";
      case "failed":
        return "error";
      case "created":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return <CheckCircle fontSize="small" />;
      case "failed":
        return <Cancel fontSize="small" />;
      default:
        return <Pending fontSize="small" />;
    }
  };

  const formatAmount = (amount) => {
    return `₹${(amount / 100).toFixed(2)}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }


  const handleDownloadInvoice = (payment) => {
    // Assuming payment.invoiceUrl contains the URL to download the invoice
    let lawyerName = payment?.lawyerId?.fullName,
      lawyerEmail = payment?.lawyerId?.email,
      clientName = payment?.clientId?.fullName,
      clientEmail = payment?.clientId?.email,
      invoiceNo = payment?.orderId,
      orderId = invoiceNo.replace("order_", "");
    generateInvoicePDF({
      invoiceNo: invoiceNo,
      date: new Date(payment?.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }),
      billedTo: {
        name: clientName,
        email: clientEmail,
      },
      transactionId: orderId,
      paymentMode: "Razorpay",
      paymentStatus: "Successful",
      consultationFee: payment.transferAmount,
      recipientName: lawyerName,
      platformFee: PlatformFee,
      gstPercent: GstPercent
    })
  }

  return (
    <Box sx={{ p: 0.5 }}>
      <Typography variant="h5" fontWeight="600" gutterBottom>
        Payment History
      </Typography>

      {/* Statistics Cards */}
      {statistics && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Payment color="primary" fontSize="large" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Spent
                    </Typography>
                    <Typography variant="h5" fontWeight="600">
                      {formatAmount(statistics.totalSpent)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Payments Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e0e0e0" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ '& .MuiTableCell-head': { minWidth: 180 } }}>
              <TableCell>
                <strong>Invoice No</strong>
              </TableCell>
              <TableCell>
                <strong>Date</strong>
              </TableCell>
              <TableCell>
                <strong>Lawyer Name</strong>
              </TableCell>
              <TableCell>
                <strong>Lawyer Email</strong>
              </TableCell>
              <TableCell>
                <strong>Consultation Type</strong>
              </TableCell>
              <TableCell>
                <strong>Amount</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>

              <TableCell>
                <strong>Receipt</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary" py={4}>
                    No payment history found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment._id} hover>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                      {payment.orderId}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(payment.createdAt)}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {payment.lawyerId?.fullName || "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {payment.lawyerId?.email || ""}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={payment.consultationType}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="600">
                      {formatAmount(payment.totalAmount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(payment.status)}
                      label={payment.status === "created" ? "Cancelled" : payment.status}
                      color={getStatusColor(payment.status)}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <IconButton disabled={payment.status !== "paid"} onClick={() => { handleDownloadInvoice(payment) }}>
                      <FileDownload />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={pagination.totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default PaymentHistory;

