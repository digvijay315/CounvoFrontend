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
  Divider,
} from "@mui/material";
import {
  AttachMoney,
  TrendingUp,
  Receipt,
  AccountBalance,
  CurrencyRupee,
} from "@mui/icons-material";
import useLawyerEarnings from "../../hooks/useLawyerEarnings";

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

      {/* Earnings by Type */}
      {statistics?.earningsByType && statistics.earningsByType.length > 0 && (
        <Card elevation={0} variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Earnings by Consultation Type
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              {statistics.earningsByType.map((type) => (
                <Grid item xs={12} md={4} key={type._id}>
                  <Box
                    sx={{
                      p: 2,
                      border: "1px solid #e0e0e0",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {type._id.charAt(0).toUpperCase() + type._id.slice(1)}
                    </Typography>
                    <Typography variant="h6" fontWeight="600">
                      {formatAmount(type.amount)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {type.count} consultations
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Payments Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: "1px solid #e0e0e0" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Date</strong>
              </TableCell>
              <TableCell>
                <strong>Client</strong>
              </TableCell>
              <TableCell>
                <strong>Consultation Type</strong>
              </TableCell>
              <TableCell>
                <strong>Consultation Fee</strong>
              </TableCell>
              <TableCell>
                <strong>Platform Fee</strong>
              </TableCell>
              <TableCell>
                <strong>Gross Amount</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
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
                  <TableCell>{formatDate(payment.createdAt)}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {payment.clientId?.fullName || "N/A"}
                    </Typography>
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
                    <Typography variant="body2" color="text.secondary">
                      {formatAmount(payment.platformCommission)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{formatAmount(payment.totalAmount)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={payment.status}
                      color={getStatusColor(payment.status)}
                      size="small"
                    />
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

