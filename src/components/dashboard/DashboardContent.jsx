import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import useLawyerData from "../../hooks/useLawyerData";
import LawyerProfileCard from "./LawyerProfileCard";

const DashboardContent = () => {
  const { userFullName, userId } = useAuth();
  const { lawyerList, isLoading, error } = useLawyerData();
  return (
    <Box>
      <Box>
        <Typography variant="h6">Welcome, {userFullName}</Typography>
        <Typography variant="body1">Your ID: {userId}</Typography>
      </Box>
      <Box>
        <Typography variant="h6">Lawyer List</Typography>
        <Typography variant="body1">
          Total Lawyers: {lawyerList.length}
        </Typography>
        <Grid container spacing={2}>
          {lawyerList.map((lawyer) => (
            <Grid item xs={12} md={6} lg={4} key={lawyer._id}>
              <LawyerProfileCard lawyer={lawyer} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardContent;
