import React, { useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useLawyer from "../../hooks/useLawyer";
import {
  Button,
  CircularProgress,
  Container,
  Box,
  Typography,
  Paper,
  Avatar,
  Divider,
  Chip,
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
import { getLawyerFormattedData } from "../dashboard/LawyerProfileCard";
import LawyerPaymentDialog from "./LawyerPaymentDialog";

const LawyerProfilePage = () => {
  const { lawyerId } = useParams();
  const navigate = useNavigate();
  const { lawyer, isLoading: lawyerLoading } = useLawyer(lawyerId);
  const lawyerData = useMemo(() => getLawyerFormattedData(lawyer), [lawyer]);
  const paymentDialogRef = useRef(null);

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
                    <Chip label="Verified" color="success" size="small" />
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
              onClick={() => paymentDialogRef.current.handleOpen()}
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

      <LawyerPaymentDialog
        ref={paymentDialogRef}
        lawyerId={lawyerData.lawyerId}
      />
    </>
  );
};

export default LawyerProfilePage;
