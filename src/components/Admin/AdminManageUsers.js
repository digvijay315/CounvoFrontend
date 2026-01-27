import { useEffect, useState } from "react";
import api from "../../api";
import { Box, Chip, IconButton, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { Cancel, CheckCircle, MoreVert } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { Delete, Trash } from "lucide-react";
import Swal from "sweetalert2";

const AdminManageUsers = () => {
  const [userRole, setUserRole] = useState('lawyer');
  const [loading, setLoading] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const fetchUsersList = async () => {
    try {
      setLoading(true);
      const resp = await api.get(
        `/api/v2/admin/users/${userRole}`
      );
      if (resp.data.success) {
        setUsersData(resp?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching users list:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);
      const resp = await api.delete(
        `/api/v2/admin/users/${userId}`
      );
      if (resp.data.success) {
        fetchUsersList();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersList();
  }, [userRole]);

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { color: "info", label: "Pending" },
      verified: { color: "success", label: "verified" },
      rejected: { color: "error", label: "rejected" },
    };

    const config = statusConfig[status] || { color: "default", label: status };
    return <Chip size="small" color={config.color} label={config.label} />;
  };

  const columns = [
    {
      field: "fullName",
      headerName: "Full Name",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 130,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => getStatusChip(params.row?.status),
    },
    {
      field: "lastLoggedAt",
      headerName: "Last Logged at",
      width: 150,
      valueGetter: (params) =>
        params.row.lastLoggedAt
          ? new Date(params.row.lastLoggedAt)?.toLocaleString()
          : "N/A",
    },
    {
      field: "isVerified",
      headerName: "ID Verified",
      width: 100,
      renderCell: (params) =>
        params.row.isVerified ? (
          <CheckCircle color="success" fontSize="small" />
        ) : (
          <Cancel color="disabled" fontSize="small" />
        ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <IconButton title="Delete User" color="error" onClick={() => {
          Swal.fire({
            title: 'Are you sure?',
            text: 'This action will permanently delete the user.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
          }).then((result) => {
            if (result.isConfirmed) {
              handleDeleteUser(params.row._id);
            } else {
              // User cancelled the deletion
            }
          });
        }}>
          <Trash />
        </IconButton>
      ),
    }
  ];
  return (
    <Box sx={{ height: "100%", width: "100%", p: 2 }}>
      <Typography variant="h5" fontWeight="600" gutterBottom>
        Manage Users
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage and review users registered on the platform.
      </Typography>

      {/* Status Filter */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={userRole}
          exclusive
          onChange={(e, value) => {
            if (value !== null) {
              setUserRole(value);
            }
          }}
          size="small"
        >
          {[{ label: "Lawyer", value: "lawyer" }, { label: "Customer", value: "customer" }].map((filter) => (
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
        rows={usersData}
        columns={columns}
        getRowId={(row) => row._id}
        loading={loading}
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
    </Box>
  )
}

export default AdminManageUsers;