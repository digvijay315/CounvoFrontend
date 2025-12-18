import React from "react";
import { Box, Typography } from "@mui/material";
import useAuth from "../../hooks/useAuth";

const DashboardContent = () => {
  const { userFullName, userId } = useAuth();
  return (
    <Box>
      <Box>
        <Typography variant="h6">Welcome, {userFullName}</Typography>
        <Typography variant="body1">Your ID: {userId}</Typography>
      </Box>
    </Box>
  );
};

export default DashboardContent;
