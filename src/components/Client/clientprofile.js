import {React,useState,useEffect} from 'react';
import api from '../../api'; // adjust the path as needed
import '../../css/lawyerprofile.css'
import { Offcanvas, Button, Tab, Tabs } from 'react-bootstrap';
import { TextField, MenuItem, Card, CardContent, Typography, Grid, FormControlLabel, FormGroup,FormControl, FormLabel, RadioGroup,  Radio, OutlinedInput, Checkbox, ListItemText } from '@mui/material';
import Select from 'react-select';
import { Country, State, City } from 'country-state-city';
import { IconButton, Tooltip } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import Lottie from "lottie-react";
import Swal from 'sweetalert2';
import Header from '../Layout/header';



const ClientProfileModal = () => {

     const [isLoading, setIsLoading] = useState(false);
    const [animationData, setAnimationData] = useState(null);
      useEffect(() => {
      fetch("https://assets6.lottiefiles.com/packages/lf20_usmfx6bp.json")
        .then((res) => res.json())
        .then((data) => setAnimationData(data));
    }, []);
    
    const userData = JSON.parse(localStorage.getItem('userDetails'));

        const [show, setShow] = useState(false);
        const [activeTab1, setActiveTab1] = useState('');

         const handleShow = () => {
            setActiveTab1('personal');
            setShow(true);
        };

        const handleClose = () => {
            setShow(false);
        };

const[clientprofile,setclientprofile]=useState({profilepic:[],gender:"",dob:"",contact_no:"",residential_address:"",state:"",city:"",
                                        pin_code:"",corrosponding_address:"",})

  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  useEffect(() => {
    const indiaStates = State.getStatesOfCountry('IN');
    const mappedStates = indiaStates.map(state => ({
      value: state.isoCode,
      label: state.name
    }));
    setStateOptions(mappedStates);

  }, []);

  useEffect(() => {
    if (selectedState) {
      const cities = City.getCitiesOfState('IN', selectedState.value);
      const mappedCities = cities.map(city => ({
        value: city.name,
        label: city.name
      }));
      setCityOptions(mappedCities);
      setSelectedCity(null); // reset city when state changes
    }
  }, [selectedState]);


const handleChange = (e) => {
  const { name, value } = e.target;
  setclientprofile((prev) => ({
    ...prev,
    [name]: value,
  }));
};


const completeuserprofile=async()=>
{
  try {
    setIsLoading(true)
    const resp=await api.put(`api/user/updateuserprofile/${userData.user._id}`,clientprofile, {headers: {
    "Content-Type": "multipart/form-data",
  }},)
    if(resp.status===200)
    {
      Swal.fire({
        icon:"success",
        title:"Profile Updated",
        text:"Your Profile Completed Successfully",
        showConfirmButton:"true"
      })
      setclientprofile([])
       handleClose()
    }
   
    
  } catch (error) {
    console.log(error);
    
  }finally
  {
    setIsLoading(false)
  }
}



//================================== edit profile start=========================================================

const[edituserprofile,setedituserprofile]=useState({fullName:"",email:"",username:"",profilepic:[],gender:"",dob:"",contact_no:"",residential_address:"",state:"",city:"",
                                        pin_code:"",corrosponding_address:"",})


    const [show1, setShow1] = useState(false);
        const [activeTab2, setActiveTab2] = useState('');  


         const handleShow1 = () => {
            setActiveTab2('personal');
            setShow1(true);
            setedituserprofile(userData.user)
        };

        const handleClose1 = () => {
            setShow1(false);
        };

const handleChangeedit = (e) => {
  const { name, value } = e.target;
  setedituserprofile((prev) => ({
    ...prev,
    [name]: value,
  }));
};

        const completeedituserprofile=async()=>
          {
            try {
              setIsLoading(true)
              const resp=await api.put(`api/user/updateuserprofile/${userData.user._id}`,edituserprofile, {headers: {
              "Content-Type": "multipart/form-data",
            }},)
              if(resp.status===200)
              {
                Swal.fire({
                  icon:"success",
                  title:"Profile Updated",
                  text:"Your Profile Completed Successfully",
                  showConfirmButton:"true"
                })
                setedituserprofile([])
                handleClose1()

              }
            
              
            } catch (error) {
              console.log(error);
              
            }finally
            {
              setIsLoading(false)
            }
          }

return (  

  <div>
      <Header/>

   <div className="profile-container">
  {/* <Clientsidebar /> */}
     <style>{`
  
.profile-container {

  display: flex;
  flex-direction: row;
  min-height: 100vh;
  background-color: #f5f7fa;
  font-family: 'Segoe UI', sans-serif;
}

/* Main section */
.main11 {
  flex: 1;
  margin-left: 160px;
  padding: 10px 10px 10px 10px;
  display: flex;
  background: linear-gradient(to right, #f0f4ff, #e8f0ff);
  font-family: 'Poppins', 'Segoe UI', sans-serif;
}

/* Profile card */
.profile-card {
  background: #fff;
  border-radius: 16px;
  padding: 30px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}
.profile-card:hover {
  transform: translateY(-5px);
}
.profile-card h2 {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 20px;
}

.profile-image {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid #4c8bf5;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}
.profile-image:hover {
  transform: scale(1.05);
}

.profile-info h4 {
  margin: 12px 0;
  color: #34495e;
  font-size: 18px;
  font-weight: 500;
}

.profile-buttons {
  display: flex;
  gap: 20px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.profile-buttons button {
  padding: 10px 25px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease, transform 0.3s ease;
}


.edit-btn {
  background-color: #007bff;
  color: #fff;
}

.complete-btn {
  background-color: #28a745;
  color: #fff;
}

.profile-buttons button:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

/* Mobile Responsive */
@media (max-width: 600px) {
  .main11 {
    padding: 20px;
    margin-left:-15px;
  }

  .profile-card {
    padding: 25px;
  }

  .profile-buttons {
    flex-direction: column;
    gap: 15px;
  }

  .profile-buttons button {
    width: 100%;
  }
}

 
      
        
      `}</style>
 <main className="main11">
    <div className="profile-card">
      <h2>My Profile</h2>

      <img
        src={userData?.user?.profilepic?.[0]}
        alt="Profile"
        className="profile-image"
      />

      <div className="profile-info">
        <h4>Name: {userData?.user?.fullName}</h4>
        <h4>Email: {userData?.user?.email}</h4>
        <h4>User Name: {userData?.user?.username}</h4>
      </div>

      <div className="profile-buttons">
        <button className="edit-btn" onClick={handleShow1}>Edit Profile</button>
        <button className="complete-btn" onClick={handleShow}>Complete Profile</button>
      </div>
    </div>
  </main> 

<Offcanvas show={show} onHide={handleClose} placement="end" className="lawyer-offcanvas">
        {/* <Offcanvas.Header closeButton>
          <Offcanvas.Title className="text-primary">Complete Your Profile</Offcanvas.Title>
        </Offcanvas.Header> */}
      <Offcanvas.Body>
                 <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
    <h5 className="m-0 text-primary">Complete Your Profile</h5>
    <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
  </div>
 <div>
    <Tabs
      activeKey={activeTab1}
      onSelect={(k) => setActiveTab1(k)}
      className="mb-3 nav-pills flex-nowrap"
      justify
      style={{ flexWrap: 'nowrap' }}
    >
  
    <Tab eventKey="personal" title="👤 Personal">
      <div className="tab-content-section">

         <Card elevation={3} sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Personal Details
            </Typography>

            <Grid container spacing={2}>

                <Grid item xs={12}>
                <label
                  style={{
                    fontWeight: 500,
                    fontSize: 14,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Profile Pic
                </label>
                <input
                name='profilepic'
                 className="custom-textfield"
                  type="file"
                  accept=".pdf, .jpg, .jpeg, .png"
                  id={`profilepic`}
                  style={{ display: "none" }}
                  onChange={(e)=>setclientprofile({...clientprofile,profilepic:Array.from(e.target.files)})}
                />
                <label htmlFor={`profilepic`}>
                  <IconButton
                    component="span"
                    sx={{
                      border: "1px solid #1976d2",
                      borderRadius: "6px",
                      backgroundColor: "#e3f2fd",
                      padding: "8px",
                    }}
                  >
                    <UploadFileIcon />
                   <img src={clientprofile.profilepic} style={{height:"50px"}}></img>
                  </IconButton>
                </label>

                      {clientprofile.profilepic?.length > 0 && (
                    <div style={{ marginTop: '10px', fontSize: '14px' }}>
                    <strong>Selected {clientprofile.profilepic.length} file(s):</strong> 
                    <ul style={{ paddingLeft: '18px', marginTop: '4px' }}>
                        {clientprofile.profilepic.map((file, index) => (
                        <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                    </div>
                )}
               
              </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            className="custom-textfield"
            select
            label="Gender"
            name="gender"
            fullWidth
            size="small"
            variant="outlined"
            onChange={handleChange}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            className="custom-textfield"
            label="Date of Birth"
            name="dob"
            type="date"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            className="custom-textfield"
            label="Contact No"
            name="contact_no"
            type="tel"
            fullWidth
            size="small"
            variant="outlined"
            onChange={handleChange}
          />
        </Grid>

        {/* <Grid item xs={12}>
          <TextField
            className="custom-textfield"
            label="Residential Address"
            name="residential_address"
            multiline
            minRows={2}
            fullWidth
            size="small"
            variant="outlined"
            onChange={handleChange}
          />
        </Grid> */}

        <Grid item xs={12}>
          <Select
            className="react-select-container"
            classNamePrefix="react-select"
            options={stateOptions}
            value={selectedState}
            onChange={(value) => {
            setSelectedState(value);
            setclientprofile((prev) => ({
              ...prev,
              state: value.label,
            }));
          }}
            name="state"
            placeholder="Select State"
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
        </Grid>

        <Grid item xs={12}>
          <Select
            className="react-select-container"
            classNamePrefix="react-select"
            options={cityOptions}
            value={selectedCity}
              onChange={(value) => {
            setSelectedCity(value);
            setclientprofile((prev) => ({
              ...prev,
              city: value.label, // stores the state's name like "Maharashtra"
            }));
          }}
            name="city"
            placeholder="Select City"
            isDisabled={!selectedState}
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            className="custom-textfield"
            label="PIN Code"
            name="pin_code"
            type="text"
            inputProps={{ maxLength: 6 }}
            fullWidth
            size="small"
            variant="outlined"
            onChange={handleChange}
          />
        </Grid>

        {/* <Grid item xs={12}>
          <TextField
            className="custom-textfield"
            label="Correspondence Address (Optional)"
            name="corrosponding_address"
            multiline
            minRows={2}
            fullWidth
            size="small"
            variant="outlined"
            onChange={handleChange}
          />
        </Grid> */}

      
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button variant="contained" color="primary" className="custom-button save" onClick={completeuserprofile}>
            Save
          </Button>
          <Button variant="outlined" color="secondary" className="custom-button reset">
            Reset
          </Button>
        </Grid>
      </Grid>
          </CardContent>
        </Card>

      </div>
    </Tab>

  </Tabs>
  </div>
</Offcanvas.Body>

      </Offcanvas>



{/*=================================== edit lawyer profile start ==============================================================*/}


  <Offcanvas show={show1} onHide={handleClose1} placement="end" className="lawyer-offcanvas">
        {/* <Offcanvas.Header closeButton>
          <Offcanvas.Title className="text-primary">Edit Your Profile</Offcanvas.Title>
        </Offcanvas.Header> */}
      <Offcanvas.Body>
          <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
    <h5 className="m-0 text-primary">Edit Your Profile</h5>
    <button type="button" className="btn-close" aria-label="Close" onClick={handleClose1}></button>
  </div>
 <div>
    <Tabs
      activeKey={activeTab2}
      onSelect={(k) => setActiveTab2(k)}
      className="mb-3 nav-pills flex-nowrap"
      justify
      style={{ flexWrap: 'nowrap' }}
    >
 
    <Tab eventKey="personal" title="👤 Personal">
      <div className="tab-content-section">

         <Card elevation={3} sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Personal Details
            </Typography>

            <Grid container spacing={2}>

        <Grid item xs={12}>
                <label
                  style={{
                    fontWeight: 500,
                    fontSize: 14,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Profile Pic
                </label>
                <input
                name='profilepic'
                 className="custom-textfield"
                  type="file"
                  accept=".pdf, .jpg, .jpeg, .png"
                  id={`profilepic`}
                  style={{ display: "none" }}
                  onChange={(e)=>setedituserprofile({...edituserprofile,profilepic:Array.from(e.target.files)})}
                />
                <label htmlFor={`profilepic`}>
                  <IconButton
                    component="span"
                    sx={{
                      border: "1px solid #1976d2",
                      borderRadius: "6px",
                      backgroundColor: "#e3f2fd",
                      padding: "8px",
                    }}
                  >
                    <UploadFileIcon />
                   <img src={edituserprofile.profilepic} style={{height:"50px"}}></img>
                  </IconButton>
                </label>

                      {edituserprofile.profilepic?.length > 0 && (
    <div style={{ marginTop: '10px', fontSize: '14px' }}>
     <strong>Selected {edituserprofile.profilepic.length} file(s):</strong> 
      <ul style={{ paddingLeft: '18px', marginTop: '4px' }}>
        {edituserprofile.profilepic.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    </div>
  )}
               
              </Grid>

                 <Grid item xs={12}>
          <TextField
            className="custom-textfield"
            label="Full Name"
            name="fullName"
            defaultValue={edituserprofile.fullName}
            type="text"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            onChange={handleChangeedit}
          />
        </Grid>

                 <Grid item xs={12}>
          <TextField
            className="custom-textfield"
            label="Email"
            name="email"
            defaultValue={edituserprofile.email}
            type="text"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            onChange={handleChangeedit}
          />
        </Grid>

                 <Grid item xs={12}>
          <TextField
            className="custom-textfield"
            label="User Name"
            name="username"
            defaultValue={edituserprofile.username}
            type="text"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            onChange={handleChangeedit}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            className="custom-textfield"
            select
            label="Gender"
            name="gender"
            fullWidth
            size="small"
            value={edituserprofile.gender}
            variant="outlined"
            onChange={handleChangeedit}
          >
           
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            className="custom-textfield"
            label="Date of Birth"
            name="dob"
            value={edituserprofile.dob}
            type="date"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            onChange={handleChangeedit}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            className="custom-textfield"
            label="Contact No"
            name="contact_no"
            type="tel"
            fullWidth
            size="small"
            variant="outlined"
            onChange={handleChangeedit}
          />
        </Grid>

    

       <Grid item xs={12}>
      <Select
        className="react-select-container"
        classNamePrefix="react-select"
        options={stateOptions}
        value={stateOptions.find(option => option.label === edituserprofile?.state) || selectedState}
        onChange={(value) => {
          setSelectedState(value);
          setedituserprofile((prev) => ({
            ...prev,
            state: value.label, // Store only the state's name
          }));
        }}
        name="state"
        placeholder="Select State"
        menuPortalTarget={document.body}
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      />
    </Grid>


       <Grid item xs={12}>
  <Select
    className="react-select-container"
    classNamePrefix="react-select"
    options={cityOptions}
    value={cityOptions.find(option => option.label === edituserprofile?.city) || selectedCity}
    onChange={(value) => {
      setSelectedCity(value);
      setedituserprofile((prev) => ({
        ...prev,
        city: value.label, // Store only the city's name
      }));
    }}
    name="city"
    placeholder="Select City"
    isDisabled={!selectedState?.label} // Disable if state is not selected
    menuPortalTarget={document.body}
    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
  />
</Grid>


        <Grid item xs={12}>
          <TextField
            className="custom-textfield"
            label="PIN Code"
            name="pin_code"
            value={edituserprofile.pin_code}
            type="text"
            inputProps={{ maxLength: 6 }}
            fullWidth
            size="small"
            variant="outlined"
            onChange={handleChangeedit}
          />
        </Grid>

     

      
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button variant="contained" color="primary" className="custom-button save" onClick={completeedituserprofile}>
            Save
          </Button>
          <Button variant="outlined" color="secondary" className="custom-button reset">
            Reset
          </Button>
        </Grid>
      </Grid>
          </CardContent>
        </Card>

      </div>
    </Tab>

  </Tabs>
  </div>
</Offcanvas.Body>

      </Offcanvas> 

        <>
      {isLoading && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          // background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}>
          <div style={{
            // backgroundColor: "rgba(0,0,0,0.75)",
            padding: "40px 60px",
            borderRadius: "20px",
            // boxShadow: "0 15px 35px rgba(0, 0, 0, 0.4)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#fff",
            textAlign: "center",
          }}>
            <Lottie
              animationData={animationData}
              loop
              autoplay
              style={{ height: '120px', width: '120px', marginBottom: '20px' }}
            />
            <div style={{ fontSize: "18px", fontWeight: 500 }}>
              Updating Profile...
            </div>
          </div>
        </div>
      )}
          </>

</div>
  </div>

    );
};

export default ClientProfileModal;