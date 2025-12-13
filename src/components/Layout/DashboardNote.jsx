import { Button, Dialog, DialogTitle, DialogContent, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import LawyerKycWidget from "../Lawyer/LawyerKycWidget";

const DashboardNote = () => {
  const { user: userData } = useAuth();
  const isKycSubmitted = userData?.lawyerKycId;
  const kycStatus = userData?.lawyerKycId?.kycStatus;

  const [dashboardNote, setDashboardNote] = useState([]);
  const [openKycDialog, setOpenKycDialog] = useState(false);
  useEffect(() => {
    if (userData?.role === "lawyer" && !isKycSubmitted) {
      setDashboardNote([
        "Please complete your account KYC to start using the platform",
      ]);
    }else{
      setDashboardNote([]);
    }
  }, [isKycSubmitted, kycStatus]);
  const handleOpenKycDialog = () => {
    setOpenKycDialog(true);
  };
  const handleCloseKycDialog = () => {
    setOpenKycDialog(false);
  };
  return (
    <>
      {dashboardNote.map((note) => (
        <Stack
          direction={"row"}
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          py={1}
          px={4}
          backgroundColor="success.light"
          border="1px solid #e0e0e0"
        >
          <Typography fontWeight={600} variant="body1">
            Note: {note}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleOpenKycDialog}
            disabled={isKycSubmitted}
          >
            Complete KYC
          </Button>
        </Stack>
      ))}
      <Dialog
        maxWidth="md"
        fullWidth
        open={openKycDialog}
        onClose={handleCloseKycDialog}
      >
        <DialogTitle>
          <Typography variant="h4" fontWeight="600" gutterBottom>
            Lawyer KYC Verification
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete your KYC verification to start practicing on our platform
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ width: "100%" }}>
          <LawyerKycWidget onSuccess={handleCloseKycDialog} />
        </DialogContent>
      </Dialog>
    </>
  );
};
export default DashboardNote;
