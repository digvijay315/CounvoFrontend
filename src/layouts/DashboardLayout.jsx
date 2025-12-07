import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import NavigationSidebar from "../components/Layout/NavigationSidebar";
import NavigationHeader from "../components/Layout/NavigationHeader";

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Left Navigation Sidebar */}
      <NavigationSidebar mobileOpen={mobileOpen} onClose={handleDrawerToggle} />
      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#f8fafc",
          overflow: "hidden",
        }}
      >
        {/* Navigation Header */}
        <NavigationHeader
          onMenuClick={handleDrawerToggle}
          onNotificationClick={() => {}}
        />
        {/* Page Content */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            overflowX: "hidden",
            p:2
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
