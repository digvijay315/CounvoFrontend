import React, {
  useMemo,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
  Avatar,
  Tooltip,
  Divider,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { ExitToApp as LogoutIcon } from "@mui/icons-material";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { APP_CONFIG } from "../../_constants/config";
import { GetNavigationMenuItems } from "../../_constants/navigationConstants";
import LogoHorizontal from "../../components/counvoImg/LogoHorizontal.png";
import LogoIcon from "../../components/counvoImg/LogoIcon.jpg";
import useAuth from "../../hooks/useAuth";

const NavigationSidebar = forwardRef(({ mobileOpen, onClose }, ref) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { userRole, user: userData, handleLogout } = useAuth();

  // Mobile always uses full width, desktop uses collapsed/expanded width
  const drawerWidth = isMobile
    ? APP_CONFIG.NAVIGATION_SIDEBAR_WIDTH
    : isCollapsed
    ? APP_CONFIG.SIDE_PANEL_COLLAPSED_WIDTH
    : APP_CONFIG.NAVIGATION_SIDEBAR_WIDTH;

  const userFullName = userData?.fullName || "User";
  const menuItems = useMemo(() => GetNavigationMenuItems(userRole), [userRole]);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
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
          px: isCollapsed ? 2.5 : 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
          height: APP_CONFIG.NAVIGATION_HEADER_HEIGHT,
        }}
      >
        <Box
          component="img"
          src={isCollapsed ? LogoIcon : LogoHorizontal}
          alt="Counvo Logo"
          sx={{
            height: isCollapsed ? "95%" : "100%",
            width: "auto",
            objectFit: "contain",
            transition: "all 0.3s ease",
          }}
        />
      </Box>

      {/* Navigation Menu */}
      <List sx={{ flex: 1, px: isCollapsed ? 1 : 2, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <Tooltip
              title={isCollapsed ? item.label : ""}
              placement="right"
              arrow
            >
              <ListItemButton
                selected={isActivePath(item.path)}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 1,
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  px: isCollapsed ? 1 : 2,
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
                    minWidth: isCollapsed ? "auto" : 40,
                    color: isActivePath(item.path)
                      ? theme.palette.primary.main
                      : "inherit",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!isCollapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActivePath(item.path) ? 600 : 400,
                      fontSize: "0.95rem",
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      {/* User Profile Section */}
      <Box sx={{ borderTop: "1px solid", borderColor: "divider" }}>
        <Tooltip
          title={isCollapsed ? userFullName : ""}
          placement="right"
          arrow
        >
          <Link
            to="/dashboard/profile"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItemButton
              sx={{
                p: 1.5,
                px: isCollapsed ? 1 : 2,
                justifyContent: isCollapsed ? "center" : "flex-start",
                transition: "all 0.2s ease",
                borderRadius: 0,
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
                  mr: isCollapsed ? 0 : 1.5,
                }}
              >
                {userFullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </Avatar>
              {!isCollapsed && (
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
                    {userRole} Account
                  </Typography>
                </Box>
              )}
            </ListItemButton>
          </Link>
        </Tooltip>

        <Divider />

        <Tooltip title={isCollapsed ? "Logout" : ""} placement="right" arrow>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              color: "error.main",
              px: isCollapsed ? 1 : 2,
              py: 1.5,
              justifyContent: isCollapsed ? "center" : "flex-start",
              transition: "all 0.2s ease",
              borderRadius: 0,
              "&:hover": {
                backgroundColor: alpha(theme.palette.error.light, 0.08),
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: isCollapsed ? "auto" : 40,
                color: "error.main",
                justifyContent: "center",
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontSize: "0.95rem",
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  );

  useImperativeHandle(ref, () => ({
    handleLogout,
    handleToggleCollapse,
  }));

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
            width: APP_CONFIG.NAVIGATION_SIDEBAR_WIDTH,
            borderRight: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.paper",
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
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.paper",
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
});

export default NavigationSidebar;
