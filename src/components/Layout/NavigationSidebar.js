import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
  Avatar,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Dashboard as DashboardIcon,
  Gavel as GavelIcon,
  Person as PersonIcon,
  HelpOutline as HelpIcon,
  ExitToApp as LogoutIcon,
  Chat,
} from "@mui/icons-material";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { APP_CONFIG } from "../../_constants/config";

const NavigationSidebar = ({ mobileOpen, onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const drawerWidth = APP_CONFIG.NAVIGATION_SIDEBAR_WIDTH || 260;

  const userData = JSON.parse(localStorage.getItem("userDetails") || "{}");
  const userFullName = userData?.user?.fullName || "User";

  const menuItems = [
    {
      label: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      label: "Find Lawyer",
      icon: <GavelIcon />,
      path: "/dashboard/findlawyer",
    },
    {
      label: "History",
      icon: <Chat />,
      path: "/dashboard/history",
    },
    {
      label: "Support",
      icon: <HelpIcon />,
      path: "/dashboard/supports",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userDetails");
    navigate("/login");
  };

  const isActivePath = (path) => {
    return (
      location.pathname === path ||
      (location.pathname.includes(path) && path !== "/dashboard")
    );
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo and Brand Section */}
      <Box
        sx={{
          p: 0.5,
          px: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderBottom: "1px solid #e5e7eb",
          height: APP_CONFIG.NAVIGATION_HEADER_HEIGHT,
        }}
      >
        <Box
          component="img"
          src={require("../../components/counvoImg/LogoHorizontal.png")}
          alt="Counvo Logo"
          sx={{
            height: "100%",
            width: "auto",
            objectFit: "contain",
          }}
        />
      </Box>

      {/* Navigation Menu */}
      <List sx={{ flex: 1, px: 2, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={isActivePath(item.path)}
              onClick={() => handleNavigation(item.path)}
              sx={{
                transition: "all 0.2s ease",
                "&.Mui-selected": {
                  backgroundColor: alpha(theme.palette.primary.light, 0.15),
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.light, 0.25),
                  },
                  "& .MuiListItemIcon-root": {
                    color: theme.palette.primary.main,
                  },
                },
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.light, 0.08),
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isActivePath(item.path)
                    ? theme.palette.primary.main
                    : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActivePath(item.path) ? 600 : 400,
                  fontSize: "0.95rem",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* User Profile Section */}
      <Box sx={{ borderTop: "1px solid #e5e7eb" }}>
        <Link
          to="/dashboard/profile"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItemButton
            sx={{
              p: 1.5,
              px: 2,
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                backgroundColor: theme.palette.primary.main,
                fontWeight: "bold",
                mr: 1.5,
              }}
            >
              {userFullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                fontWeight="600"
                noWrap
                sx={{ lineHeight: 1.2, mb: 0.3 }}
              >
                {userFullName}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                Client Account
              </Typography>
            </Box>
          </ListItemButton>
        </Link>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            color: "error.main",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: alpha(theme.palette.error.light, 0.08),
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: "error.main" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontSize: "0.95rem",
            }}
          />
        </ListItemButton>
      </Box>
      {/* Logout Section */}
      <Box sx={{ p: 1, pb: 0.5 }}></Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "1px solid #e5e7eb",
            background: "#ffffff",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "1px solid #e5e7eb",
            background: "#ffffff",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default NavigationSidebar;
