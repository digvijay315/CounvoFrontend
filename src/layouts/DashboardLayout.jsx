import React, { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import NavigationSidebar from "../components/Layout/NavigationSidebar";
import NavigationHeader from "../components/Layout/NavigationHeader";
import DashboardNote from "../components/Layout/DashboardNote";
import { SocketProvider } from "../context/SocketContext";
import useNotification from "../hooks/useNotification";
import NotificationRequestWindow from "../components/shared/NotificationRequestWindow";

const DashboardLayout = () => {
  const theme = useTheme();
  const { pathname } = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarRef = useRef(null);
  const headerRef = useRef(null);
  const { isSupported, verifyPermission, requestNotificationPermission } =
    useNotification();

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

  const [showNotificationPermission, setShowNotificationPermission] =
    useState(false);

  const handleDeclineRequestPermission = () => {
    setShowNotificationPermission(false);
    // Set to local storage to avoid repeated prompts
    localStorage.setItem("notification-permission-declined", "true");
  };
  const handleAcceptRequestPermission = async () => {
    const permission = await requestNotificationPermission();
    if (permission === "granted") {
      setShowNotificationPermission(false);
    }
  };
  useEffect(() => {
    const checkAndRequestNotificationPermission = async () => {
      if (!isSupported()) return;
      const declined = localStorage.getItem("notification-permission-declined");
      if (declined === "true") return;
      const permission = await verifyPermission();
      if (
        permission !== "granted" &&
        permission !== "denied" &&
        permission !== "unsupported"
      ) {
        setShowNotificationPermission(true);
      }
    };
    const t = setTimeout(checkAndRequestNotificationPermission, 1500);
    return () => clearTimeout(t);
  }, []);

  const hidePadding = pathname === "/dashboard/messages";
  return (
    <SocketProvider>
      <Box sx={{ display: "flex", height: "100dvh", overflow: "hidden" }}>
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
            minHeight: "100dvh",
            backgroundColor: "#f8fafc",
            overflow: "hidden",
          }}
        >
          {/* Navigation Header */}
          <NavigationHeader
            ref={headerRef}
            onMenuClick={handleDrawerToggle}
            onNotificationClick={() => { }}
          />
          <DashboardNote />
          <NotificationRequestWindow open={showNotificationPermission} onClose={() => setShowNotificationPermission(false)} onAccept={handleAcceptRequestPermission} onDecline={handleDeclineRequestPermission} />
          {/* Page Content */}
          <Box
            id="dashboard-content-area"
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              overflowX: "hidden",
              p: hidePadding ? 0 : 2,
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </SocketProvider>
  );
};

export default DashboardLayout;
