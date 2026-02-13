import { useState } from "react";
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
  Grid, IconButton
} from "@mui/material";
import {
  Receipt, CurrencyRupee,
  FileDownload
} from "@mui/icons-material";
import useLawyerEarnings from "../../hooks/useLawyerEarnings";
import { generateInvoicePDF } from "../../utils";

let PlatformFee = parseFloat(process.env.REACT_APP_PLATFORM_FEE || 0.05);
let GstPercent = parseFloat(process.env.REACT_APP_GST_PERCENT || 18);

const LawyerEarnings = () => {
  const [page, setPage] = useState(1);
  const { payments, pagination, statistics, isLoading, error } =
    useLawyerEarnings(page, 10);

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
        day: "numeric",
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
      gstPercent: GstPercent,
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="600" gutterBottom>
        My Earnings
      </Typography>

      {/* Statistics Cards */}
      {statistics && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card elevation={0} variant="outlined">
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <CurrencyRupee color="primary" fontSize="large" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Earnings
                    </Typography>
                    <Typography variant="h5" fontWeight="600">
                      {formatAmount(statistics.totalEarnings)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={0} variant="outlined">
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Receipt color="primary" fontSize="large" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Transactions
                    </Typography>
                    <Typography variant="h5" fontWeight="600">
                      {statistics.totalTransactions}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Payments Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: "1px solid #e0e0e0" }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ "& .MuiTableCell-head": { minWidth: 200 } }}>
              <TableCell>
                <strong>Invoice No.</strong>
              </TableCell>
              <TableCell>
                <strong>Client Name</strong>
              </TableCell>
              <TableCell>
                <strong>Client Email</strong>
              </TableCell>
              <TableCell>
                <strong>Consultation Type</strong>
              </TableCell>
              <TableCell>
                <strong>Consultation Fee</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Date</strong>
              </TableCell>
              <TableCell>
                <strong>Receipt</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary" py={4}>
                    No earnings data found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment._id} hover>
                  <TableCell>
                    <Typography
                      variant="caption"
                      sx={{ fontFamily: "monospace" }}
                    >
                      {payment.orderId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {payment.clientId?.fullName || "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {payment.clientId?.email || ""}
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
                    <Typography fontWeight="600" color="primary">
                      {formatAmount(payment.transferAmount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={payment.status}
                      color={getStatusColor(payment.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(payment.createdAt)}</TableCell>
                  <TableCell>
                    <IconButton
                      disabled={payment.status !== "paid"}
                      onClick={() => {
                        handleDownloadInvoice(payment);
                      }}
                    >
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

export default LawyerEarnings;

