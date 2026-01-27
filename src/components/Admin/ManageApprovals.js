import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Stack,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  MoreVert as MoreVertIcon,
  CheckCircle,
  Cancel,
  VerifiedUser,
  NoteAdd,
  Visibility,
} from "@mui/icons-material";
import api from "../../api";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import KycDetailsView from "./KycDetailsView";

const statusFilters = [
  { value: "in_review", label: "In Review" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const ManageApprovals = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("in_review");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState(0);
  const [kycDetails, setKycDetails] = useState(null);
  const [kycDetailsDialogOpen, setKycDetailsDialogOpen] = useState(false);
  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // Internal Note Dialog state
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [internalNote, setInternalNote] = useState("");

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const resp = await api.get(
        `/api/v2/admin/lawyerkyc/submissions?status=${statusFilter}&page=${paginationModel.page + 1
        }&limit=${paginationModel.pageSize}`
      );
      if (resp.data.success) {
        setSubmissions(resp.data.submissions || []);
        setTotalRows(resp.data.pagination?.total || 0);
      }
    } catch (error) {
      console.error("Error fetching KYC submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter, paginationModel]);

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleApproveKyc = async () => {
    handleMenuClose();
    if (!selectedRow) return;

    const confirmResult = await Swal.fire({
      title: "Approve KYC?",
      text: `Are you sure you want to approve KYC for ${selectedRow.lawyerName || selectedRow.lawyer?.fullName || "this lawyer"
        }?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#059669",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
    });

    if (confirmResult.isConfirmed) {
      try {
        let lawyerId = selectedRow.lawyerId._id;
        const resp = await api.put(
          `/api/v2/admin/lawyerkyc/${lawyerId}/approve`
        );
        if (resp.data.success) {
          toast.success("KYC has been approved successfully.");
          fetchSubmissions();
        }
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to approve KYC.");
      }
    }
  };

  const handleRejectKyc = async () => {
    handleMenuClose();
    if (!selectedRow) return;

    const { value: reason } = await Swal.fire({
      title: "Reject KYC",
      input: "textarea",
      inputLabel: "Reason for rejection",
      inputPlaceholder: "Enter the reason for rejecting this KYC...",
      inputAttributes: {
        "aria-label": "Rejection reason",
      },
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      confirmButtonText: "Reject KYC",
      inputValidator: (value) => {
        if (!value) {
          return "Please provide a reason for rejection";
        }
      },
    });

    if (reason) {
      try {
        let lawyerId = selectedRow.lawyerId._id;
        const resp = await api.put(
          `/api/v2/admin/lawyerkyc/${lawyerId}/reject`,
          { reason }
        );
        if (resp.data.success) {
          toast.success("KYC has been rejected successfully.");
          fetchSubmissions();
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to reject KYC.",
        });
      }
    }
  };

  const handleVerifyIdentity = async () => {
    handleMenuClose();
    if (!selectedRow) return;

    const confirmResult = await Swal.fire({
      title: "Verify Identity Document?",
      text: "This will mark the identity document as verified.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#F59E0B",
      confirmButtonText: "Verify Document",
    });

    if (confirmResult.isConfirmed) {
      try {
        let lawyerId = selectedRow.lawyerId._id;
        const resp = await api.put(
          `/api/v2/admin/lawyerkyc/${lawyerId}/verify-identity`
        );
        if (resp.data.success) {
          toast.success("Identity document has been verified successfully.");
          fetchSubmissions();
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to verify identity.",
        });
      }
    }
  };

  const handleAddNoteClick = () => {
    handleMenuClose();
    setInternalNote("");
    setNoteDialogOpen(true);
  };

  const handleAddNote = async () => {
    if (!selectedRow || !internalNote.trim()) return;

    try {
      let lawyerId = selectedRow.lawyerId._id;
      const resp = await api.post(`/api/v2/admin/lawyerkyc/${lawyerId}/notes`, {
        note: internalNote,
      });
      if (resp.data.success) {
        toast.success("Internal note has been added successfully.");
        setNoteDialogOpen(false);
        setInternalNote("");
        fetchSubmissions();
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to add note.",
      });
    }
  };

  const handleViewDetails = async () => {
    handleMenuClose();
    if (!selectedRow) return;
    // Navigate to details page or open modal
    console.log("View details:", selectedRow);
    const resp = await api.get(
      `/api/v2/admin/lawyerkyc/submissions/${selectedRow._id}`
    );
    if (resp.data.success) {
      console.log("KYC details:", resp.data.kyc);
      setKycDetails(resp.data.kyc);
      setKycDetailsDialogOpen(true);
    } else {
      console.error("Error fetching KYC details:", resp.data.error);
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      in_review: { color: "warning", label: "In Review" },
      pending: { color: "info", label: "Pending" },
      approved: { color: "success", label: "Approved" },
      rejected: { color: "error", label: "Rejected" },
      verified: { color: "success", label: "Verified" },
    };

    const config = statusConfig[status] || { color: "default", label: status };
    return <Chip size="small" color={config.color} label={config.label} />;
  };

  const columns = [
    {
      field: "lawyerName",
      headerName: "Lawyer Name",
      flex: 1,
      valueGetter: (params) => params.row.lawyerId?.fullName || "N/A",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      valueGetter: (params) => params.row.lawyerId?.email || "N/A",
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 130,
      valueGetter: (params) => params.row.lawyerId?.phone || "N/A",
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => getStatusChip(params.row?.kycStatus),
    },
    {
      field: "submittedAt",
      headerName: "Submitted",
      width: 150,
      valueGetter: (params) =>
        params.row.kycSubmittedAt
          ? new Date(params.row.kycSubmittedAt)?.toLocaleString()
          : "N/A",
    },
    {
      field: "kycStatus",
      headerName: "ID Verified",
      width: 100,
      renderCell: (params) =>
        params.row.kycStatus === "approved" ? (
          <CheckCircle color="success" fontSize="small" />
        ) : (
          <Cancel color="disabled" fontSize="small" />
        ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <IconButton size="small" onClick={(e) => handleMenuOpen(e, params.row)}>
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  const isReviewTabs = ["in_review", "pending"].includes(statusFilter);

  return (
    <Box sx={{ height: "100%", width: "100%", p: 2 }}>
      <Typography variant="h5" fontWeight="600" gutterBottom>
        Manage KYC Approvals
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Review and manage lawyer KYC submissions
      </Typography>

      {/* Status Filter */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={statusFilter}
          exclusive
          onChange={(e, value) => {
            if (value !== null) {
              setStatusFilter(value);
              setPaginationModel({ ...paginationModel, page: 0 });
            }
          }}
          size="small"
        >
          {statusFilters.map((filter) => (
            <ToggleButton
              key={filter.value}
              value={filter.value}
              sx={{
                textTransform: "none",
                px: 2,
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                },
              }}
            >
              {filter.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>

      {/* Data Grid */}
      <DataGrid
        rows={submissions}
        columns={columns}
        getRowId={(row) => row._id}
        loading={loading}
        paginationMode="server"
        rowCount={totalRows}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20, 50]}
        disableRowSelectionOnClick
        autoHeight
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f9fafb",
            fontWeight: 600,
          },
          "& .MuiDataGrid-cell": {
            py: 1,
          },
        }}
      />

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleViewDetails}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        {isReviewTabs || statusFilter == "approved" ? (
          <MenuItem onClick={handleApproveKyc}>
            <ListItemIcon>
              <CheckCircle fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>{isReviewTabs ? "Approve" : "Reverify Approve"} KYC</ListItemText>
          </MenuItem>
        ) : null}
        {isReviewTabs && <MenuItem onClick={handleRejectKyc}>
          <ListItemIcon>
            <Cancel fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Reject KYC</ListItemText>
        </MenuItem>}
      </Menu>

      {/* Add Note Dialog */}
      <Dialog
        open={noteDialogOpen}
        onClose={() => setNoteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Internal Note</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Note"
            fullWidth
            multiline
            rows={4}
            value={internalNote}
            onChange={(e) => setInternalNote(e.target.value)}
            placeholder="Enter your internal note here..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleAddNote}
            variant="contained"
            disabled={!internalNote.trim()}
          >
            Add Note
          </Button>
        </DialogActions>
      </Dialog>

      {/* KYC Details Dialog */}
      <Dialog
        open={kycDetailsDialogOpen}
        onClose={() => setKycDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { maxHeight: "90vh" },
        }}
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: "divider" }}>
          KYC Details
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <KycDetailsView kycDetails={kycDetails} />
        </DialogContent>
        <DialogActions
          sx={{ borderTop: 1, borderColor: "divider", px: 3, py: 2 }}
        >
          <Button
            onClick={() => setKycDetailsDialogOpen(false)}
            variant="outlined"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageApprovals;
