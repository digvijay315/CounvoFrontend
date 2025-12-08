import React, { useState, useImperativeHandle, forwardRef } from "react";
import {
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Box, Divider,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useTheme,
  alpha,
  Stack
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Error,
  CheckCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "../../_constants/config";
import useAuth from "../../hooks/useAuth";
import { NAVIGATION_CONSTANTS } from "../../_constants/navigationConstants";

const NavigationHeader = forwardRef(
  ({ onMenuClick, onNotificationClick }, ref) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorElNotifications, setAnchorElNotifications] = useState(null);
    const { user: userData, handleLogout, isVerified } = useAuth();
    const userFullName = userData?.fullName || "User";
    const userEmail = userData?.email || "user@example.com";
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
      {
        id: 2,
        text: "Consultation scheduled",
        time: "1 hour ago",
        unread: true,
      },
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

    const handleProfileClick = () => {
      handleCloseUserMenu();
      navigate(NAVIGATION_CONSTANTS.PROFILE_PATH);
    };

    useImperativeHandle(ref, () => ({
      handleOpenUserMenu,
      handleCloseUserMenu,
      handleOpenNotifications,
      handleCloseNotifications,
      handleProfileClick,
    }));

    return (
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{
          height: APP_CONFIG.NAVIGATION_HEADER_HEIGHT,
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
                pb: 0,
                "& .MuiList-root": { padding: 0 },
              },
            }}
          >
            <Box sx={{ px: 2, py: 2 }}>
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
                  py: 1,
                  backgroundColor: notification.unread
                    ? alpha(theme.palette.primary.main, 0.05)
                    : "transparent",
                  "&:hover": {
                    backgroundColor: notification.unread
                      ? alpha(theme.palette.primary.main, 0.1)
                      : alpha(theme.palette.action.hover, 0.2),
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
            <MenuItem
              onClick={() => {
                handleCloseNotifications();
                if (onNotificationClick) onNotificationClick();
              }}
              sx={{
                justifyContent: "center",
                color: "primary.main",
                p: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
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
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
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
                "& .MuiList-root": { padding: 0 },
              },
            }}
          >
            <Box width="100%" sx={{ px: 2.5, py: 1.5 }}>
              <Stack
                width="100%"
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
                gap={1}
              >
                <Typography
                  display="inline-block"
                  variant="subtitle2"
                  fontWeight="bold"
                >
                  {userFullName}
                </Typography>

                {isVerified ? (
                  <Typography
                    display="inline-block"
                    sx={{
                      backgroundColor: theme.palette.success.main,
                      color: theme.palette.success.contrastText,
                      padding: "2px 8px",
                      borderRadius: "15px",
                      fontSize: 12,
                    }}
                    variant="body2"
                  >
                    Verified
                  </Typography>
                ) : (
                  <Typography
                    display="inline-block"
                    sx={{
                      backgroundColor: theme.palette.error.main,
                      color: theme.palette.error.contrastText,
                      padding: "2px 8px",
                      borderRadius: "15px",
                      fontSize: 12,
                    }}
                    variant="body2"
                  >
                    Unverified
                  </Typography>
                )}
              </Stack>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.5 }}
              >
                {userEmail}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleProfileClick} sx={{ p: 1.5, px: 2.5 }}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>My Profile</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseUserMenu();
                navigate(NAVIGATION_CONSTANTS.MESSAGES_PATH);
              }}
              sx={{ p: 1.5, px: 2.5 }}
            >
              <ListItemIcon>
                <EmailIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Messages</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              sx={{
                color: "error.main",
                p: 1.5,
                px: 2.5,
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Stack>
    );
  }
);

export default NavigationHeader;
