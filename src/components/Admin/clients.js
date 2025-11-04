import React, { useState, useEffect } from 'react';
import api from '../../api';
import Adminsidebar from './adminsidebar';
import Adminpanelheader from '../adminpanelheader';
import { Visibility, CheckCircle, Cancel } from '@mui/icons-material';
import { Box, Button, IconButton, Typography, Chip, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import { FaEye } from 'react-icons/fa';
import { Offcanvas, } from 'react-bootstrap';
import LawyerProfileTabs from '../viewlawyerinfo';



function Clients() {

      const [lawyers, setLawyers] = useState([]);

      const fetchlawyers=async()=>
        {
            try {
            const resp=await api.get('api/lawyer/getalllawyerprofile')
            setLawyers(resp.data.filter((item)=>(item.status==="verified")))
            } catch (error) {
            console.log(error);
            
            }
        }
        useEffect(() => {
            fetchlawyers();
        }, []);

          const[users,setusers]=useState([])
  const fetchusers=async()=>
  {
    try {
      const resp=await api.get('api/user')
      console.log(resp);
      
      setusers(resp.data)
      
    } catch (error) {
      console.log(error);
      
    }
  }
  useEffect(() => {
    fetchusers();
  }, []);

      const handledeletelawyer = async (id) => {
        try {
          const confirmResult = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
          });

          if (confirmResult.isConfirmed) {
            const resp = await api.delete(`api/lawyer/removelawyer/${id}`);
            if (resp.status === 200) {
              Swal.fire(
                'Deleted!',
                'Lawyer has been deleted.',
                'success'
              );

       
            }
          }
        } catch (error) {
          console.log(error);
          Swal.fire(
            'Error!',
            'Something went wrong while deleting.',
            'error'
          );
        }
      };

        const [show, setShow] = useState(false);
         const [selectedLawyer, setSelectedLawyer] = useState(null);
          const [activeTab1, setActiveTab1] = useState('dashboard');

         const handleShow = (lawyer) => {
    setSelectedLawyer(lawyer);
    setActiveTab1('basic');
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedLawyer(null);
  };

      const handleViewLawyer = async (lawyerid) => {
          try {
            const resp = await api.get(`api/lawyer/getlawyer/${lawyerid}`);
            if (resp.status === 200) {
              handleShow(resp.data);
           
            }
          } catch (error) {
            console.log(error);
          }
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
              field: 'barEnrolment',
              headerName: 'Bar Enrolment',
              width: 130,
            },

            {
              field: 'yearsOfExperience',
              headerName: 'Experience',
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
            width: 120,
            renderCell: (params) => (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <DeleteIcon
                  onClick={() => handledeletelawyer(params.row._id)}
                  style={{ color: '#d32f2f', cursor: 'pointer' }}
                />
                <button
                  className="icon-btn black"
                  onClick={() => handleViewLawyer(params.row._id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <FaEye />
                </button>
      </div>
    ),
  },


          
            
          ];

            const usercolumns = [

            {
              field: 'fullName',
              headerName: 'Name',
              flex: 1,
            },
            {
              field: 'email',
              headerName: 'Email',
              flex: 1,
            },
            {
              field: 'username',
              headerName: 'User Name',
              width: 130,

            },

            {
              field: 'createdAt',
              headerName: 'Reg. Date',
              width: 130,
              valueGetter: (params) => new Date(params.row.createdAt).toLocaleString(),
            },
          
            
          ];

  //   const [paginationModel, setPaginationModel] = useState({
  //   page: 0,
  //   pageSize: 2, // default value
  // });

  return (
    <div>
       <style>{`
        @media (max-width: 480px) 
        {
          main
          {
            margin-left:5px !important;
            width:115% !important;
          }
            .tablename
            {
              font-size:16px !important;
            }
        }
           `}</style>
        <Adminsidebar/>
        {/* <Adminpanelheader/> */}
        <main style={{marginLeft:"15%",marginTop:"1%"}}>
             <div style={{padding:"50px"}}>
            <Box sx={{ height: 500, width: '100%', p: 2 }}>
              <Typography variant="h5" gutterBottom className='tablename'>
                🕵️‍♂️ All Verified Lawyers
              </Typography>
               <DataGrid
                rows={lawyers}
                columns={columns}
                getRowId={(row) => row._id}
                // pagination
                // paginationModel={paginationModel}
                // onPaginationModelChange={setPaginationModel}
                // pageSizeOptions={[2]} // ✅ only 2 allowed
                disableRowSelectionOnClick
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

               <div style={{padding:"50px"}}>
            <Box sx={{ height: 500, width: '100%', p: 2 }}>
              <Typography variant="h5" gutterBottom className='tablename'>
                🕵️‍♂️ All Verified Users
              </Typography>
               <DataGrid
                rows={users}
                columns={usercolumns}
                getRowId={(row) => row._id}
                // pagination
                // paginationModel={paginationModel}
                // onPaginationModelChange={setPaginationModel}
                // pageSizeOptions={[2]} // ✅ only 2 allowed
                disableRowSelectionOnClick
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
{/* 
             <Box sx={{ height: 500, width: '100%', p: 2 }}>
                  <Typography variant="h5" gutterBottom>
                    🕵️‍♂️ All Users
                  </Typography>
                  <DataGrid
                    rows={lawyers}
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
                </Box> */}

            </div>

             <Offcanvas show={show} onHide={handleClose} placement="end" className="lawyer-offcanvas">
                    <Offcanvas.Header closeButton>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                      {selectedLawyer && <LawyerProfileTabs selectedLawyer={selectedLawyer} />}
                    </Offcanvas.Body>
                  </Offcanvas>

        </main>
      
    </div>
  )
}

export default Clients
