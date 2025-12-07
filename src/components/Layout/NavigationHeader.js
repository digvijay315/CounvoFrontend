import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Box,
  InputBase,
  Divider,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useTheme,
  alpha,
  Stack,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  AccountCircle,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  HelpOutline as HelpIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "../../_constants/config";

const NavigationHeader = ({ onMenuClick, onNotificationClick }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const userData = JSON.parse(localStorage.getItem("userDetails") || "{}");
  const userFullName = userData?.user?.fullName || "User";
  const userEmail = userData?.user?.email || "user@example.com";
  const userInitials = userFullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Notification data
  const notifications = [
    {
      id: 1,
      text: "New message from Adv. Sharma",
      time: "5 min ago",
      unread: true,
    },
    { id: 2, text: "Consultation scheduled", time: "1 hour ago", unread: true },
    {
      id: 3,
      text: "Document uploaded successfully",
      time: "2 hours ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotifications = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("userDetails");
    navigate("/login");
  };

  const handleProfileClick = () => {
    handleCloseUserMenu();
    navigate("/clientprofile");
  };

  const handleSettingsClick = () => {
    handleCloseUserMenu();
    navigate("/settings");
  };

  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      sx={{
        height: APP_CONFIG.NAVIGATION_HEADER_HEIGHT,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        p: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{
            "&:hover": {
              backgroundColor: alpha("#fff", 0.1),
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Right Section - Icons & Profile */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton
            color="inherit"
            onClick={handleOpenNotifications}
            sx={{
              "&:hover": {
                backgroundColor: alpha("#fff", 0.1),
              },
            }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Notifications Menu */}
        <Menu
          anchorEl={anchorElNotifications}
          open={Boolean(anchorElNotifications)}
          onClose={handleCloseNotifications}
          PaperProps={{
            sx: {
              mt: 1.5,
              width: 320,
              maxHeight: 400,
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Notifications
            </Typography>
          </Box>
          <Divider />
          {notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => {
                handleCloseNotifications();
                if (onNotificationClick) onNotificationClick();
              }}
              sx={{
                py: 1.5,
                backgroundColor: notification.unread
                  ? alpha(theme.palette.primary.main, 0.05)
                  : "transparent",
                "&:hover": {
                  backgroundColor: notification.unread
                    ? alpha(theme.palette.primary.main, 0.1)
                    : alpha(theme.palette.action.hover, 0.8),
                },
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  fontWeight={notification.unread ? 600 : 400}
                >
                  {notification.text}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.time}
                </Typography>
              </Box>
            </MenuItem>
          ))}
          <Divider />
          <MenuItem
            onClick={() => {
              handleCloseNotifications();
              if (onNotificationClick) onNotificationClick();
            }}
            sx={{ justifyContent: "center", color: "primary.main" }}
          >
            <Typography variant="body2" fontWeight="600">
              View All Notifications
            </Typography>
          </MenuItem>
        </Menu>

        {/* User Avatar */}
        <Tooltip title="Account settings">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1 }}>
            <Avatar
              sx={{
                background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
                fontWeight: "bold",
                width: 40,
                height: 40,
                border: "2px solid white",
              }}
            >
              {userInitials}
            </Avatar>
          </IconButton>
        </Tooltip>

        {/* User Menu */}
        <Menu
          anchorEl={anchorElUser}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
          PaperProps={{
            sx: {
              mt: 1.5,
              width: 240,
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              {userFullName}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.5 }}
            >
              {userEmail}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleProfileClick}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>My Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleSettingsClick}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleCloseUserMenu();
              navigate("/messages");
            }}
          >
            <ListItemIcon>
              <EmailIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Messages</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </Stack>
  );
};

export default NavigationHeader;
