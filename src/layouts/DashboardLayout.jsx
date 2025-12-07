import React, { useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import NavigationSidebar from "../components/Layout/NavigationSidebar";
import NavigationHeader from "../components/Layout/NavigationHeader";

const DashboardLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarRef = useRef(null);
  const headerRef = useRef(null);

  const handleDrawerToggle = () => {
    if (isMobile) {
      // Mobile: Toggle drawer open/closed
      setMobileOpen(!mobileOpen);
    } else {
      // Desktop: Toggle collapse state
      if (sidebarRef.current) {
        sidebarRef.current.handleToggleCollapse();
      }
    }
  };

  const handleMobileDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Left Navigation Sidebar */}
      <NavigationSidebar
        ref={sidebarRef}
        mobileOpen={mobileOpen}
        onClose={handleMobileDrawerClose}
      />
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
          ref={headerRef}
          onMenuClick={handleDrawerToggle}
          onNotificationClick={() => {}}
        />
        {/* Page Content */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            overflowX: "hidden",
            p: 2,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
