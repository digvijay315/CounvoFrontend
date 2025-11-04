import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, Typography, Chip, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Visibility, CheckCircle, Cancel } from '@mui/icons-material';
import api from '../../api';
import Adminsidebar from './adminsidebar';
import Adminpanelheader from '../adminpanelheader';
import Swal from 'sweetalert2';

const PendingLawyersTable = () => {
  const [pendingLawyers, setPendingLawyers] = useState([]);

  const fetchLawyers = async () => {
    try {
      const resp = await api.get('api/lawyer/getalllawyerprofile');
      const filtered = resp.data.filter((item) => item.status !== 'verified');
      setPendingLawyers(filtered);
    } catch (error) {
      console.error(error);
    }
  };

    const [lawyers, setLawyers] = useState([]);
  
 const handleApprove = async (lawyer) => {
  const confirmResult = await Swal.fire({
    title: 'Are you sure?',
    text: `Do you want to approve ${lawyer.firstName} ${lawyer.lastName}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#28a745',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, approve',
    cancelButtonText: 'Cancel',
  });

  if (confirmResult.isConfirmed) {
    try {
      const resp = await api.put(`api/lawyer/approvedlawyer/${lawyer._id}`, { status: "verified" });

      if (resp.status === 200) {
        setLawyers(prev => [...prev]); // optional UI update logic
        Swal.fire({
          icon: 'success',
          title: 'Approved!',
          text: 'Lawyer approved successfully.',
          showConfirmButton: true,
        }).then(() => {
          window.location.reload();
        });
      }

    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong while approving the lawyer.',
      });
    }
  }
};


  const handleReject = async (id) => {
    // Add your API call here
    console.log('Rejected:', id);
  };

  const handleView = (row) => {
    console.log('View:', row);
    // You can open a modal or offcanvas here
  };

  const columns = [

    {
      field: 'fullName',
      headerName: 'Name',
      flex: 1,
      valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 130,
    },

     {
      field: 'createdAt',
      headerName: 'Reg. Date',
      width: 130,
      valueGetter: (params) => new Date(params.row.createdAt).toLocaleString(),
    },
  
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            color="success"
            title="Approve"
            onClick={() => handleApprove(params.row)}
          >
            <CheckCircle />
          </IconButton>
          <IconButton
            color="error"
            title="Reject"
            onClick={() => handleReject(params.row.id)}
          >
            <Cancel />
          </IconButton>
          <IconButton
            color="primary"
            title="View"
            onClick={() => handleView(params.row)}
          >
            <Visibility />
          </IconButton>
        </Stack>
      ),
    },
  ];

  useEffect(() => {
    fetchLawyers();
  }, []);

  return (
    <div>
        <Adminsidebar/>
        {/* <Adminpanelheader/> */}
        <div style={{marginLeft:"15%",marginTop:"5%",padding:"50px"}}>
    <Box sx={{ height: 500, width: '100%', p: 2 }}>
      <Typography variant="h5" gutterBottom>
        🕵️‍♂️ Pending Lawyers
      </Typography>
      <DataGrid
        rows={pendingLawyers}
        columns={columns}
        getRowId={(row) => row._id} // Or replace with `_id` if MongoDB
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f0f0f0',
            fontWeight: 'bold',
          },
          '& .MuiDataGrid-cell': {
            py: 1,
          },
        }}
      />
    </Box>
    </div>
    </div>
  );
};

export default PendingLawyersTable;
