import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Chat as ChatIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import useAuth from "../hooks/useAuth";
import api from "../api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const LawyerClients = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch clients list
  const fetchClients = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const response = await api.get(`/api/v2/lawyer/getClientsList/${userId}`);

      if (response.data.success) {
        if (
          Array.isArray(response?.data?.data) &&
          response?.data?.data?.length > 0
        ) {
          let data = response?.data?.data.map((item) => ({
            chatId: item?._id,
            clientUserId: item?.fromUser?._id,
            fullName: item?.fromUser?.fullName,
            email: item?.fromUser?.email,
            phone: item?.fromUser?.phone,
            createdAt: item?.timestamp || new Date(),
          }));
          setClients(data);
          setFilteredClients(data);
        } else {
          setClients([]);
          setFilteredClients([]);
        }
      } else {
        throw new Error(response.data.message || "Failed to fetch clients");
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Load Clients",
        text:
          error.response?.data?.message ||
          "Unable to fetch clients list. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [userId]);

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredClients(clients);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = clients.filter((client) => {
      const fullName = `${client.fullName || ""}`.toLowerCase();
      const email = `${client.email || ""}`.toLowerCase();
      const mobile = `${client.mobile || ""}`.toLowerCase();

      return (
        fullName.includes(query) ||
        email.includes(query) ||
        mobile.includes(query)
      );
    });

    setFilteredClients(filtered);
  }, [searchQuery, clients]);

  const handleChatWithClient = async (chatId, client) => {
    try {
      // Navigate to messages with chatId
      navigate(`/dashboard/messages?chatId=${chatId}`);
    } catch (error) {
      console.error("Error creating chat:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Start Chat",
        text: "Unable to start chat with client. Please try again.",
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h4" fontWeight="700" gutterBottom>
              My Clients
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage and view all your clients in one place
            </Typography>
          </Box>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchClients} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Search Bar */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search by name, email, or mobile..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 500 }}
        />
      </Box>

      {/* Statistics */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h4" fontWeight="700" color="primary.main">
              {clients.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Clients
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h4" fontWeight="700" color="success.main">
              {filteredClients.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Filtered Results
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* Clients Table */}
      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="600">
                    Client
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="600">
                    Contact
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="600">
                    Joined Date
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle2" fontWeight="600">
                    Actions
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Typography variant="body1" color="text.secondary">
                      {searchQuery
                        ? "No clients found matching your search"
                        : "No clients yet"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow
                    key={client._id}
                    sx={{
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    {/* Client Info */}
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          src={client.profilePic || ""}
                          alt={client.fullName}
                          sx={{ width: 40, height: 40 }}
                        >
                          {client.fullName?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="600">
                            {client.fullName || "N/A"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {client.clientUserId?.slice(-6) + "..."}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Contact */}
                    <TableCell>
                      <Stack spacing={0.5}>
                        {client.email && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <EmailIcon
                              sx={{ fontSize: 14, color: "text.secondary" }}
                            />
                            <Typography variant="caption" noWrap>
                              {client.email}
                            </Typography>
                          </Box>
                        )}
                        {client.mobile && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <PhoneIcon
                              sx={{ fontSize: 14, color: "text.secondary" }}
                            />
                            <Typography variant="caption">
                              {client.mobile}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </TableCell>

                    {/* Joined Date */}
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(client.createdAt)}
                      </Typography>
                    </TableCell>
                    {/* Actions */}
                    <TableCell align="center">
                      <Tooltip title="Chat with Client">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() =>
                            handleChatWithClient(client?.chatId, client)
                          }
                        >
                          <ChatIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default LawyerClients;
