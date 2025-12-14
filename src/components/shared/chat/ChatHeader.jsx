import React from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Badge,
  IconButton,
  Stack,
} from "@mui/material";
import {
  Call as CallIcon,
  VideoCall as VideoCallIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";

const ChatHeader = ({ 
  selectedChat, 
  onlineUsers, 
  getAvatarSrc, 
  getParticipantName,
  onCall 
}) => {
  if (!selectedChat) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Badge
          overlap="circular"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          variant="dot"
          sx={{
            "& .MuiBadge-badge": {
              bgcolor: onlineUsers.includes(
                selectedChat.participant?._id
              )
                ? "success.main"
                : "grey.400",
              border: "2px solid white",
            },
          }}
        >
          <Avatar
            src={getAvatarSrc(selectedChat.participant)}
            alt={getParticipantName(
              selectedChat.participant,
              selectedChat.participantModel
            )}
            sx={{ width: 48, height: 48 }}
          />
        </Badge>
        <Box>
          <Typography variant="subtitle1" fontWeight="600">
            {getParticipantName(
              selectedChat.participant,
              selectedChat.participantModel
            )}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {onlineUsers.includes(selectedChat.participant?._id)
              ? "Online"
              : "Offline"}
          </Typography>
        </Box>
      </Box>
      <Stack direction="row" spacing={1}>
        <IconButton onClick={() => onCall("voice")} color="primary">
          <CallIcon />
        </IconButton>
        <IconButton onClick={() => onCall("video")} color="primary">
          <VideoCallIcon />
        </IconButton>
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </Stack>
    </Paper>
  );
};

export default ChatHeader;

