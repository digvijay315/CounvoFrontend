import {
  Box,
  Paper,
  Typography,
  Avatar,
  Badge,
  IconButton,
  Stack
} from "@mui/material";
import {
  Call as CallIcon,
  VideoCall as VideoCallIcon, ArrowBackIosNew
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

const ChatHeader = ({
  selectedChat,
  onlineUsers,
  getAvatarSrc,
  getParticipantName,
  onCall,
  goBack
}) => {
  const navigate = useNavigate();
  const {pathname} = useLocation();
  if (!selectedChat) return null;
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        pl: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: 1,
        borderColor: "divider",
        borderRadius:0
      }}
    >
      <Stack direction={"row"} alignItems={'center'}>
        <IconButton
          size="small"
          color="primary"
           onClick={()=>{
            navigate(pathname);
            goBack();
           }}
        >
          <ArrowBackIosNew />
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            variant="dot"
            sx={{
              "& .MuiBadge-badge": {
                bgcolor: onlineUsers.includes(selectedChat.participant?._id)
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
                selectedChat.participantModel,
              )}
              sx={{ width: "2.4rem", height: "2.4rem" }}
            />
          </Badge>
          <Stack gap={0.2}>
            <Typography
              variant="subtitle1"
              fontWeight="600"
              fontSize={"0.8rem"}
              lineHeight={"0.9rem"}
              className="clamp-2"
            >
              {getParticipantName(
                selectedChat.participant,
                selectedChat.participantModel,
              )}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {onlineUsers.includes(selectedChat.participant?._id)
                ? "Online"
                : "Offline"}
            </Typography>
          </Stack>
        </Box>
      </Stack>
      <Stack direction="row" spacing={1}>
        <IconButton onClick={() => onCall("voice")} color="primary">
          <CallIcon />
        </IconButton>
        <IconButton onClick={() => onCall("video")} color="primary">
          <VideoCallIcon />
        </IconButton>
      </Stack>
    </Paper>
  );
};

export default ChatHeader;
