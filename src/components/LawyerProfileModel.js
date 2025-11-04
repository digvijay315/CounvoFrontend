import {React,useState,useEffect} from 'react';
import api from '../api'; // adjust the path as needed
import Lawyersidebar from './lawyersidebar';
import '../css/lawyerprofile.css'
import { Offcanvas, Button, Tab, Tabs } from 'react-bootstrap';
import { TextField, MenuItem, Card, CardContent, Typography, Grid, FormControlLabel, FormGroup,FormControl, FormLabel, RadioGroup,  Radio, OutlinedInput, Checkbox, ListItemText } from '@mui/material';


import Select from 'react-select';
import { Country, State, City } from 'country-state-city';
import { IconButton, Tooltip } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import Lottie from "lottie-react";
import Swal from 'sweetalert2';
import { event } from 'jquery';
import socket from './socket';


const LawyerProfileModal = () => {

     const [isLoading, setIsLoading] = useState(false);
    const [animationData, setAnimationData] = useState(null);
      useEffect(() => {
      fetch("https://assets6.lottiefiles.com/packages/lf20_usmfx6bp.json")
        .then((res) => res.json())
        .then((data) => setAnimationData(data));
    }, []);
    
      const lawyerdetails = JSON.parse(localStorage.getItem('lawyerDetails'));


  useEffect(() => {
    if (!lawyerdetails?.lawyer?._id) return;

    if (!socket.connected) socket.connect();

    socket.on('connect', () => {
      const lawyerId = lawyerdetails.lawyer._id;
      socket.emit('lawyerOnline', lawyerId);
      socket.emit('getOnlineClients');
    });
      socket.on('onlineClientsList', ids => {
          // setOnlineClients(ids);
        });
      }
    )

        const [show, setShow] = useState(false);
        const [activeTab1, setActiveTab1] = useState('');

         const handleShow = () => {
            setActiveTab1('personal');
            setShow(true);
        };

        const handleClose = () => {
            setShow(false);
        };

const[lawyerprofile,setlawyerprofile]=useState({gender:"",dob:"",alternet_contact:"",residential_address:"",state:"",city:"",
                                        pin_code:"",corrosponding_address:"",
                                        degree:[],university:[],certificate:[],yearofgraduation:[],
                                        barEnrolment: '',barState: '',barYear: '',barCertificate:[], aibeNo: '',aibeCertificate:[],
                                        specializations:[],practicingcourts:[],languages:[],practice_type:"",lawfarm_name:"",office_address:"",
                                        bar_membership:"",proofofpractice:[],professional_bio:"",
                                        identity_proof:[],identity_number:[],identity_pic:[],address_proof:[],address_pic:[],
                                        consultation_fee_charged:"",consultation_fee_start_condition:"",consultation_fee: "",available_days: [],available_from: "",available_to: "",consultation_mode: [],
                                        account_holder_name:"",bank_name:"",account_number:"",ifsc_code:"",cancelled_cheque:[],
                                        declaration_authenticity: false,consent_verification: false,accept_terms: false})

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


  const lawyerspecializations = [
  { value: 'property lawyer', label: 'Property Lawyer' },
  { value: 'family lawyer', label: 'Family Lawyer' },
  { value: 'civil lawyer', label: 'Civil Lawyer' },
  { value: 'cyber lawyer', label: 'Cyber Lawyer' },
  { value: 'criminal lawyer', label: 'Criminal Lawyer' },
  { value: 'consumer lawyer', label: 'Consumer Lawyer' },
  { value: 'labour lawyer', label: 'Labour Lawyer' },
  { value: 'legal notice drafting', label: 'Legal Notice Drafting' },
  { value: 'company law & corporate compliance', label: 'Company Law & Corporate Compliance' },
];

const languages = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'marathi', label: 'Marathi' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'bengali', label: 'Bengali' },
];

const practiceTypes = [
  { value: 'solo', label: 'Solo' },
  { value: 'lawfirm', label: 'Law Firm' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'government', label: 'Government' },
];

 const practicingcourts = [
  { value: '', label: 'Select Courts' },
  { value: 'other', label: 'Other' },
  { value: 'tis_hazari_court', label: 'Tis Hazari Court' },
  { value: 'saket_court', label: 'Saket Court' },
  { value: 'karkardooma_court', label: 'Karkardooma Court' },
  { value: 'patiala_house_court', label: 'Patiala House Court' },
  { value: 'rohini_court', label: 'Rohini Court' },
  { value: 'dwarka_court', label: 'Dwarka Court' },
  { value: 'rouse_avenue_court', label: 'Rouse Avenue Court' },
  { value: 'high_court', label: 'High Court' },
];


const degreeOptions = ['LLB', 'LLM', 'BA LLB', 'BBA LLB', 'Other'];
const addEducationField = () => {
  setlawyerprofile((prev) => ({
    ...prev,
    degree: [...prev.degree, ""],
    university: [...prev.university, ""],
    certificate: [...prev.certificate, null],
  }));
};

const handleDeleteEducation = (index) => {
  setlawyerprofile((prev) => ({
    ...prev,
    degree: prev.degree.filter((_, i) => i !== index),
    university: prev.university.filter((_, i) => i !== index),
    certificate: prev.certificate.filter((_, i) => i !== index),
  }));
};

const stateBarCouncils = [
  'Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'West Bengal',
  'Uttar Pradesh', 'Rajasthan', 'Punjab & Haryana', 'Kerala', 'Gujarat',
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => currentYear - i);





const days = [
  { value: 'sun', label: 'Sunday' },
  { value: 'mon', label: 'Monday' },
  { value: 'tue', label: 'Tuesday' },
  { value: 'wed', label: 'Wednessday' },
  { value: 'thu', label: 'Thusday' },
  { value: 'fri', label: 'Friday' },
  { value: 'sat', label: 'Saturday' },
];



const handleChange = (e) => {
  const { name, value } = e.target;
  setlawyerprofile((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handlearrayChange = (index, field, value) => {
  setlawyerprofile((prev) => {
    const updatedArray = [...prev[field]];
    updatedArray[index] = value;
    return {
      ...prev,
      [field]: updatedArray,
    };
  });
};








const completelawyerprofile=async()=>
{
  try {
    setIsLoading(true)
    const resp=await api.put(`api/lawyer/updatelawyerprofile/${lawyerdetails.lawyer._id}`,lawyerprofile, {headers: {
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
      setlawyerprofile([])
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

const[editlawyerprofile,seteditlawyerprofile]=useState({firstName:"",lastName:"",email:"",phone:"",yearsOfExperience:"",practiceAreas:"",profilepic:[],
                                        gender:"",dob:"",alternet_contact:"",residential_address:"",state:"",city:"",
                                        pin_code:"",corrosponding_address:"",
                                        degree:[],university:[],certificate:[],yearofgraduation:[],
                                        barEnrolment: '',barState: '',barYear: '',barCertificate:[], aibeNo: '',aibeCertificate:[],
                                        specializations:[],practicingcourts:[],languages:[],practice_type:"",lawfarm_name:"",office_address:"",
                                        bar_membership:"",proofofpractice:[],professional_bio:"",
                                        identity_proof:[],identity_number:[],identity_pic:[],address_proof:[],address_pic:[],
                                        consultation_fee_charged:"",consultation_fee_start_condition:"",consultation_fee: "",available_days: [],available_from: "",available_to: "",consultation_mode: [],
                                        account_holder_name:"",bank_name:"",account_number:"",ifsc_code:"",cancelled_cheque:[],
                                        declaration_authenticity: false,consent_verification: false,accept_terms: false})


    const [show1, setShow1] = useState(false);
        const [activeTab2, setActiveTab2] = useState('');

         const handleShow1 = () => {
            setActiveTab2('personal');
            setShow1(true);
            seteditlawyerprofile(lawyerdetails.lawyer)
        };

        const handleClose1 = () => {
            setShow1(false);
        };

const handleChangeedit = (e) => {
  const { name, value } = e.target;
  seteditlawyerprofile((prev) => ({
    ...prev,
    [name]: value,
  }));
};


 const handle_profile_pic_change = (e) => {
  const files = Array.from(e.target.files);
  if (files.length > 0) {
    const file = files[0];
    // const previewUrl = URL.createObjectURL(file);
    seteditlawyerprofile({
      ...editlawyerprofile,
      profilepic: file,
      // profile_pic_preview: previewUrl,
    });
  }
};
const handlearrayChangeedit = (index, field, value) => {
  seteditlawyerprofile((prev) => {
    const updatedArray = [...prev[field]];
    updatedArray[index] = value;
    return {
      ...prev,
      [field]: updatedArray,
    };
  });
};


const addEducationFieldedit = () => {
  seteditlawyerprofile((prev) => ({
    ...prev,
    degree: [...prev.degree, ""],
    university: [...prev.university, ""],
    certificate: [...prev.certificate, null],
  }));
};

const handleDeleteEducationedit = (index) => {
  seteditlawyerprofile((prev) => ({
    ...prev,
    degree: prev.degree.filter((_, i) => i !== index),
    university: prev.university.filter((_, i) => i !== index),
    certificate: prev.certificate.filter((_, i) => i !== index),
  }));
};

console.log(editlawyerprofile);

        
        const completeeditlawyerprofile=async()=>
          {
            try {
              setIsLoading(true)
              const resp=await api.put(`api/lawyer/updatelawyerprofile/${lawyerdetails.lawyer._id}`,editlawyerprofile, {headers: {
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
                seteditlawyerprofile([])
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
   <div className="profile-container">
  <Lawyersidebar />

  <main className="main11">
    <div className="profile-card">
      <h2>My Profile</h2>

      <img
        src={lawyerdetails?.lawyer?.profilepic[0]}
        alt="Profile"
        className="profile-image"
      />

      <div className="profile-info">
        <h4>Name: {lawyerdetails?.lawyer?.firstName} {lawyerdetails?.lawyer?.lastName}</h4>
        <h4>Phone: {lawyerdetails?.lawyer?.phone}</h4>
        <h4>Experience: {lawyerdetails?.lawyer?.yearsOfExperience} years</h4>
        <h4>Status: {lawyerdetails?.lawyer?.status}</h4>
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
    {/* PERSONAL TAB */}
    <Tab eventKey="personal" title="👤 Personal">
      <div className="tab-content-section">

         <Card elevation={3} sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Personal Details
            </Typography>

            <Grid container spacing={2}>
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
            label="Alternate Contact No"
            name="alternet_contact"
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
            setlawyerprofile((prev) => ({
              ...prev,
              state: value.label, // stores the state's name like "Maharashtra"
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
            setlawyerprofile((prev) => ({
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

        {/* Buttons */}
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button variant="contained" color="primary" className="custom-button save" onClick={completelawyerprofile}>
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

    {/*====================================== EDUCATION TAB ===============================================================*/}


    <Tab eventKey="education" title="🎓 Education">
      <div className="tab-content-section">
    {lawyerprofile?.degree?.map((_, index) => (
        <Card
          key={index}
          variant="outlined"
          sx={{
            marginBottom: 3,
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Education {index + 1}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name='degree'
                 className="custom-textfield"
                  select
                  label="Degree"
                  value={lawyerprofile.degree[index] || ""}
                  onChange={(e) =>handlearrayChange(index, "degree", e.target.value)}
                  fullWidth
                  size="small"
                >
                  {degreeOptions.map((deg) => (
                    <MenuItem key={deg} value={deg}>
                      {deg}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                 className="custom-textfield"
                name='university'
                  label="University/College Name"
                  value={lawyerprofile.university[index] || ""}
                  onChange={(e) =>handlearrayChange(index, "university", e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>

                <Grid item xs={12}>
                <TextField
                 className="custom-textfield"
                name='yearofgraduation'
                  label="Year Of Graduation"
                  value={lawyerprofile.university[index] || ""}
                  onChange={(e) =>handlearrayChange(index, "yearofgraduation", e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>

              {/* <Grid item xs={12}>
                <label
                  style={{
                    fontWeight: 500,
                    fontSize: 14,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Degree Certificate
                </label>
                <input
                name='certificate'
                 className="custom-textfield"
                  type="file"
                  accept=".pdf, .jpg, .jpeg, .png"
                  id={`certificate-${index}`}
                  style={{ display: "none" }}
                   onChange={(e) => handleCertificateUpload(index, e.target.files[0])}
                />
                <label htmlFor={`certificate-${index}`}>
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
                  </IconButton>
                </label>
                {lawyerprofile.certificate[index] && (
                  <div style={{ marginTop: 8, fontSize: 13 }}>
                    {lawyerprofile.certificate[index].name}
                  </div>
                )}
              </Grid> */}
              <Grid container justifyContent="space-between" alignItems="center">
            {lawyerprofile.degree.length >=1 && (
                <IconButton
                aria-label="delete"
                size="small"
                color="error"
                onClick={() => handleDeleteEducation(index)}
                >
                <DeleteIcon fontSize="small" />
                </IconButton>

            )}
            </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Grid item xs={12} style={{ textAlign: "right" }}>
        <Button
          variant="outlined"
          onClick={() => addEducationField()}
          style={{
            textTransform: "none",
            borderRadius: "8px",
            borderColor: "#1976d2",
            color: "#1976d2",
          }}
        >
          + Add Education
        </Button>
      </Grid>
     

      </div>
    
    </Tab>

    {/*============================== BAR COUNCIL TAB =====================================================================*/}


    <Tab eventKey="barcouncil" title="📜 Bar Council">
      <div className="tab-content-section">

          <Card
          variant="outlined"
          sx={{
            marginBottom: 3,
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Bar Council Details
            </Typography>
           <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
         className="custom-textfield"
          label="Bar Council Enrolment Number"
          name="barEnrolment"
          value={lawyerprofile.barEnrolment || ''}
          onChange={handleChange}
          fullWidth
          size="small"
          variant="outlined"
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
         className="custom-textfield"
          select
          label="State Bar Council"
          name="barState"
          value={lawyerprofile.barState || ''}
          onChange={handleChange}
          fullWidth
          size="small"
          variant="outlined"
        >
          {stateBarCouncils.map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12}>
        <TextField
         className="custom-textfield"
          select
          label="Year of Registration"
          name="barYear"
          value={lawyerprofile.barYear || ''}
          onChange={handleChange}
          fullWidth
          size="small"
          variant="outlined"
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12}>
        <label style={{ display: 'block', marginBottom: 6, fontSize: 14 }}>
          Bar Council Id/Certificate Upload
        </label>
        <input
         className="custom-textfield"
          id="barCertificate"
          type="file"
          name="barCertificate"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setlawyerprofile({...lawyerprofile,barCertificate:Array.from(e.target.files)})}
          style={{ display: 'none' }}
        />
        <label htmlFor="barCertificate">
          <Tooltip title="Upload Bar Certificate">
            <IconButton
              component="span"
              sx={{
                border: '1px solid #1976d2',
                borderRadius: '6px',
                padding: '10px',
                backgroundColor: '#e3f2fd',
              }}
            >
              <UploadFileIcon />
            </IconButton>
          </Tooltip>
        </label>
        {lawyerprofile.barCertificate?.length > 0 && (
    <div style={{ marginTop: '10px', fontSize: '14px' }}>
      <strong>Selected {lawyerprofile.barCertificate.length} file(s):</strong>
      <ul style={{ paddingLeft: '18px', marginTop: '4px' }}>
        {lawyerprofile.barCertificate.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    </div>
  )}
      </Grid>

      {/* <Grid item xs={12}>
        <TextField
         className="custom-textfield"
          label="AIBE Certificate Number (Optional)"
          name="aibeNo"
          value={lawyerprofile.aibeNo || ''}
          onChange={handleChange}
          fullWidth
          size="small"
          variant="outlined"
        />
      </Grid> 

      <Grid item xs={12}>
        <label style={{ display: 'block', marginBottom: 6, fontSize: 14 }}>
          AIBE Certificate Upload (Optional)
        </label>
        <input
         className="custom-textfield"
          id="aibeCertificate"
          type="file"
          name="aibeCertificate"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setlawyerprofile({...lawyerprofile,aibeCertificate:Array.from(e.target.files)})}
          style={{ display: 'none' }}
        />
        <label htmlFor="aibeCertificate">
          <Tooltip title="Upload AIBE Certificate">
            <IconButton
              component="span"
              sx={{
                border: '1px solid #1976d2',
                borderRadius: '6px',
                padding: '10px',
                backgroundColor: '#e3f2fd',
              }}
            >
              <UploadFileIcon />
            </IconButton>
          </Tooltip>
        </label>
         {lawyerprofile.aibeCertificate?.length > 0 && (
    <div style={{ marginTop: '10px', fontSize: '14px' }}>
      <strong>Selected {lawyerprofile.aibeCertificate.length} file(s):</strong>
      <ul style={{ paddingLeft: '18px', marginTop: '4px' }}>
        {lawyerprofile.aibeCertificate.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    </div>
  )}
      </Grid>*/}

       <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button variant="contained" color="primary" className="custom-button save" onClick={completelawyerprofile}>
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

    {/*===================================== PROFESSIONAL TAB ===================================================================*/}


    <Tab eventKey="professional" title="💼 Professional">
      
      <div className="tab-content-section">
        <Card
          variant="outlined"
          sx={{
            marginBottom: 3,
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Professional Details
            </Typography>

        <Grid container spacing={2}>
       
         <Grid item xs={12}>
        <Select
          className="react-select-container"
          isMulti
          classNamePrefix="react-select"
          options={lawyerspecializations}
          label="Select Specializations"
          name="specializations"
          value={lawyerprofile.specializations || ''}
          onChange={(selectedOptions) =>
            setlawyerprofile((prev) => ({
                ...prev,
                specializations: selectedOptions,
            }))
            }
            placeholder="Specializations"
            menuPortalTarget={document.body}
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
        >
         
        </Select>
      </Grid>

          <Grid item xs={12}>
        <Select
          className="react-select-container"
          isMulti
          classNamePrefix="react-select"
          options={practicingcourts}
          label="Practicing Courts"
          name="practicingcourts"
          value={lawyerprofile.practicingcourts || ''}
          onChange={(selectedOptions) =>
            setlawyerprofile((prev) => ({
                ...prev,
                practicingcourts: selectedOptions,
            }))
            }
            placeholder="Practicing Courts"
            menuPortalTarget={document.body}
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
        >
         
        </Select>
      </Grid>

       <Grid item xs={12}>
        <Select
            name='languages'
            className="react-select-container"
            classNamePrefix="react-select"
            isMulti
            options={languages}
            value={lawyerprofile.languages}
            onChange={(selectedOptions) =>
            setlawyerprofile((prev) => ({
                ...prev,
                languages: selectedOptions,
            }))
            }
            placeholder="Languages Spoken"
            menuPortalTarget={document.body}
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
        />
        </Grid>

         <Grid item xs={12}>
        <TextField
         className="custom-textfield"
          select
          label="Current Practice Type"
          name="practice_type"
          value={lawyerprofile.practice || ''}
          onChange={handleChange}
          fullWidth
          size="small"
          variant="outlined"
        >
          {practiceTypes.map((practice) => (
            <MenuItem key={practice.value} value={practice.value}>
              {practice.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

        <Grid item xs={12}>
          <TextField
            className="custom-textfield"
            label="Name of Law Firm/Organization"
            name="lawfarm_name"
            fullWidth
            size="small"
            variant="outlined"
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            className="custom-textfield"
            label="Office Address"
            name="office_address"
            multiline
            minRows={2}
            fullWidth
            size="small"
            variant="outlined"
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            className="custom-textfield"
            label="Bar Association Membership"
            name="bar_membership"
            fullWidth
            size="small"
            variant="outlined"
            onChange={handleChange}
          />
        </Grid>

       {/* <Grid item xs={12}>
  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>
    Proof of Practice (Vakalatnamas, Cause List, etc.)
  </label>

  <input
    id="proofOfPractice"
    name="proofofpractice"
    type="file"
    accept=".pdf, .jpg, .jpeg, .png"
    multiple
    onChange={(e) => setlawyerprofile({...lawyerprofile,proofofpractice:Array.from(e.target.files)})}
    style={{ display: 'none' }}
  />

  <label htmlFor="proofOfPractice">
    <Tooltip title="Upload Proof Files">
      <IconButton
        color="primary"
        component="span"
        style={{
          border: '1px solid #1976d2',
          borderRadius: '6px',
          padding: '10px',
          backgroundColor: '#e3f2fd',
        }}
      >
        <UploadFileIcon />
      </IconButton>
    </Tooltip>
  </label>
    
  {lawyerprofile.proofofpractice?.length > 0 && (
    <div style={{ marginTop: '10px', fontSize: '14px' }}>
      <strong>Selected {lawyerprofile.proofofpractice.length} file(s):</strong>
      <ul style={{ paddingLeft: '18px', marginTop: '4px' }}>
        {lawyerprofile.proofofpractice.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    </div>
  )}
        </Grid> */}


        {/* <Grid item xs={12}>
          <TextField
            className="custom-textfield"
            label="Professional Bio / Description"
            name="professional_bio"
            multiline
            minRows={4}
            fullWidth
            size="small"
            variant="outlined"
            onChange={handleChange}
          />
        </Grid> */}

         <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button variant="contained" color="primary" className="custom-button save" onClick={completelawyerprofile}>
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

    {/*================================== VERIFICATION & KYC TAB================================================================= */}

    {/* <Tab eventKey="verification_kyc" title="🔍 Verification & KYC">
      <div className="tab-content-section">
        <p><strong>Aadhar:</strong> Verified</p>
        <p><strong>PAN:</strong> Verified</p>
      </div>
    </Tab> */}
          {/* <Tab eventKey="verification_kyc" title="🔍KYC">
      <div className="tab-content-section">
    {lawyerprofile.identity_proof.map((_, index) => (
        <Card
          key={index}
          variant="outlined"
          sx={{
            marginBottom: 3,
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Identity {index + 1}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                name='identity_proof'
                 className="custom-textfield"
                  select
                  label="Identity Proof"
                  value={lawyerprofile.identity_proof[index] || ""}
                  onChange={(e) =>handlearrayChange(index, "identity_proof", e.target.value)}
                  fullWidth
                  size="small"
                >
                  {identityproof.map((id) => (
                    <MenuItem key={id} value={id}>
                      {id}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                 className="custom-textfield"
                  name='identity_number'
                  label="Identity Number"
                  value={lawyerprofile.identity_number[index] || ""}
                   onChange={(e) =>handlearrayChange(index, "identity_number", e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <label
                  style={{
                    fontWeight: 500,
                    fontSize: 14,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Identity Pic
                </label>
                <input
                name='identity_pic'
                 className="custom-textfield"
                  type="file"
                  accept=".pdf, .jpg, .jpeg, .png"
                  id={`identity_pic-${index}`}
                  style={{ display: "none" }}
                  onChange={(e) => handleidentityupload(index, e.target.files[0])}
                />
                <label htmlFor={`identity_pic-${index}`}>
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
                  </IconButton>
                </label>
                {lawyerprofile.identity_pic[index] && (
                  <div style={{ marginTop: 8, fontSize: 13 }}>
                    {lawyerprofile.identity_pic[index].name}
                  </div>
                )}
              </Grid>

                   <Grid item xs={12}>
                <TextField
                  name='address_proof'
                 className="custom-textfield"
                  select
                  label="Address Proof"
                  value={lawyerprofile.address_proof[index] || ""}
                  onChange={(e) =>handlearrayChange(index, "address_proof", e.target.value)}
                  fullWidth
                  size="small"
                >
                  {identityproof.map((id) => (
                    <MenuItem key={id} value={id}>
                      {id}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

                <Grid item xs={12}>
                <label
                  style={{
                    fontWeight: 500,
                    fontSize: 14,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Address Pic
                </label>
                <input
                  name='address_pic'
                 className="custom-textfield"
                  type="file"
                  accept=".pdf, .jpg, .jpeg, .png"
                  id={`address_pic-${index}`}
                  style={{ display: "none" }}
                  onChange={(e) => handleaddresspicupload(index, e.target.files[0])}
                />
                <label htmlFor={`address_pic-${index}`}>
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
                  </IconButton>
                </label>
                {lawyerprofile.address_pic[index] && (
                  <div style={{ marginTop: 8, fontSize: 13 }}>
                    {lawyerprofile.address_pic[index].name}
                  </div>
                )}
              </Grid>
              
              <Grid container justifyContent="space-between" alignItems="center">
            {lawyerprofile.identity_proof.length >=1 && (
                <IconButton
                aria-label="delete"
                size="small"
                  onClick={() => handleDeleteidentity(index)}
                >
                <DeleteIcon fontSize="small" />
                </IconButton>
            )}
            </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Grid item xs={12} style={{ textAlign: "right" }}>
        <Button
          variant="outlined"
          onClick={() => addidentityField()}
          style={{
            textTransform: "none",
            borderRadius: "8px",
            borderColor: "#1976d2",
            color: "#1976d2",
          }}
        >
          + Add Identity
        </Button>
      </Grid>
     

      </div>
    
    </Tab> */}

    {/* ===================================CONSULTATION & AVAILABILITY TAB==================================================== */}

    <Tab eventKey="consultation_availability" title="📆 Consultation">
      <div className="tab-content-section">
         <Card
          variant="outlined"
          sx={{
            marginBottom: 3,
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
         <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          Consultation Details
        </Typography>
           <Grid container spacing={2}>

            <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Consultation Fee Charged</FormLabel>
              <RadioGroup
                row
                name="consultation_fee_charged"
                value={lawyerprofile.consultation_fee_charged || ""}
                onChange={handleChange}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>
{
  lawyerprofile.consultation_fee_charged==="yes" && (

<>

          <Grid item xs={12}>
            <TextField
              className="custom-textfield"
              label="Consultation Fee Start Condition"
              name="consultation_fee_start_condition"
              value={lawyerprofile.consultation_fee_start_condition || ""}
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              className="custom-textfield"
              label="Consultation Fee (INR per half hour)"
              type="number"
              name="consultation_fee"
              value={lawyerprofile.consultation_fee || ""}
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Grid>

               <Grid item xs={12}>
            <Select
            name='available_days'
            className="react-select-container"
            classNamePrefix="react-select"
            isMulti
            options={days}
            value={lawyerprofile.available_days}
            onChange={(selectedOptions) =>
            setlawyerprofile((prev) => ({
                ...prev,
                available_days: selectedOptions,
            }))
            }
            placeholder="Available Days"
            menuPortalTarget={document.body}
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
        />
        </Grid>

             <Grid item xs={6}>
            <TextField
              className="custom-textfield"
              label="Available From"
              type="time"
              name="available_from"
              value={lawyerprofile.available_from || ""}
              onChange={handleChange}
              fullWidth
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 minutes
              }}
            />
          </Grid>

            <Grid item xs={6}>
            <TextField
              className="custom-textfield"
              label="Available To"
              type="time"
              name="available_to"
              value={lawyerprofile.available_to || ""}
              onChange={handleChange}
              fullWidth
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 minutes
              }}
            />
          </Grid>
</>
            )
}

                {/* <Grid item xs={12}>
            <Select
            className="react-select-container"
            classNamePrefix="react-select"
            isMulti
            options={consultation_mode}
            value={lawyerprofile.consultation_mode}
            onChange={(selectedOptions) =>
            setlawyerprofile((prev) => ({
                ...prev,
                consultation_mode: selectedOptions,
            }))
            } 
            placeholder="Consultation Mode"
            menuPortalTarget={document.body}
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
        />
        </Grid> */}

          {/* Buttons */}
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button variant="contained" color="primary" className="custom-button save" onClick={completelawyerprofile}>
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

    {/*==================================== BANK DETAILS TAB ========================================================================*/}


    {/* <Tab eventKey="bank_details" title="🏦 Bank Details">
      <div className="tab-content-section">
      <Card
          variant="outlined"
          sx={{
            marginBottom: 3,
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Bank Details
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                name='account_holder_name'
                 className="custom-textfield"
                  label="Account Holder Name"
                  value={lawyerprofile.account_holder_name || ""}
                //   onChange={(e) =>
                //     handleEducationChange(index, "degree", e.target.value, lawyerprofile, setlawyerprofile)
                //   }
                  fullWidth
                  size="small"
                >
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                 className="custom-textfield"
                name='bank_name'
                  label="Bank Name"
                  value={lawyerprofile.bank_name|| ""}
                  onChange={(e) =>
                    handleEducationChange(index, "university", e.target.value, lawyerprofile, setlawyerprofile)
                  }
                  fullWidth
                  size="small"
                />
              </Grid>

              
              <Grid item xs={12}>
                <TextField
                 className="custom-textfield"
                name='account_number'
                  label="Account Number"
                  value={lawyerprofile.account_number|| ""}
                  onChange={(e) =>
                    handleEducationChange(index, "university", e.target.value, lawyerprofile, setlawyerprofile)
                  }
                  fullWidth
                  size="small"
                />
              </Grid>

                 <Grid item xs={12}>
                <TextField
                 className="custom-textfield"
                name='ifsc_code'
                  label="IFSC Code"
                  value={lawyerprofile.ifsc_code|| ""}
                  onChange={(e) =>
                    handleEducationChange(index, "university", e.target.value, lawyerprofile, setlawyerprofile)
                  }
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <label
                  style={{
                    fontWeight: 500,
                    fontSize: 14,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Cancelled Cheque/Passbook Upload 
                </label>
                <input
                name='cancelled_cheque'
                 className="custom-textfield"
                  type="file"
                  accept=".pdf, .jpg, .jpeg, .png"
                  id={`cancelled_cheque`}
                  style={{ display: "none" }}
                   onChange={(e) => setlawyerprofile({...lawyerprofile,cancelled_cheque:Array.from(e.target.files)})}
                />
                <label htmlFor={`cancelled_cheque`}>
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
                  </IconButton>
                </label>
              
                      {lawyerprofile.cancelled_cheque?.length > 0 && (
                <div style={{ marginTop: '10px', fontSize: '14px' }}>
                  <strong>Selected {lawyerprofile.cancelled_cheque.length} file(s):</strong>
                  <ul style={{ paddingLeft: '18px', marginTop: '4px' }}>
                    {lawyerprofile.cancelled_cheque.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
           
              </Grid>

                    
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button variant="contained" color="primary" className="custom-button save">
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
    </Tab> */}

    {/* DECLARATIONS & AGREEMENTS TAB */}
    <Tab eventKey="declarations_agreements" title="📝 Declarations">
      <div className="tab-content-section">
        <Card
      variant="outlined"
      sx={{
        marginBottom: 3,
        borderRadius: 2,
        backgroundColor: "#f9f9f9",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          Declarations & Agreements
        </Typography>

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
              name='declaration_authenticity'
                checked={lawyerprofile.declaration_authenticity || false}
                onChange={(e) =>
                  setlawyerprofile({
                    ...lawyerprofile,
                    declaration_authenticity: e.target.checked,
                  })
                }
              />
            }
            label="I declare that all information is true and correct."
          />

          <FormControlLabel
            control={
              <Checkbox
              name='consent_verification'
                checked={lawyerprofile.consent_verification || false}
                onChange={(e) =>
                  setlawyerprofile({
                    ...lawyerprofile,
                    consent_verification: e.target.checked,
                  })
                }
              />
            }
            label="I authorize counvo to verify my documents."
          />

          <FormControlLabel
            control={
              <Checkbox
              name='accept_terms'
                checked={lawyerprofile.accept_terms || false}
                onChange={(e) =>
                  setlawyerprofile({
                    ...lawyerprofile,
                    accept_terms: e.target.checked,
                  })
                }
              />
            }
            label="I accept the Terms & Conditions and Privacy Policy."
          />
        </FormGroup>

      </CardContent>
    </Card>
               {/* Buttons */}
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button variant="contained" color="primary" className="custom-button save" onClick={completelawyerprofile}>
            Save
          </Button>
          <Button variant="outlined" color="secondary" className="custom-button reset">
            Reset
          </Button>
        </Grid>
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
    {/* PERSONAL TAB */}
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
                  onChange={handle_profile_pic_change}
                  // onChange={(e)=>seteditlawyerprofile({...editlawyerprofile,profilepic:Array.from(e.target.files)})}
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
                    {/* <img src={editlawyerprofile.profilepic} style={{height:"50px"}}></img> */}
                  </IconButton>
                </label>

                      {editlawyerprofile.profilepic?.length > 0 && (
    <div style={{ marginTop: '10px', fontSize: '14px' }}>
      {/* <strong>Selected {editlawyerprofile.profilepic.length} file(s):</strong> */}
      <ul style={{ paddingLeft: '18px', marginTop: '4px' }}>
        {editlawyerprofile.profilepic.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    </div>
  )}
               
              </Grid>

                 <Grid item xs={12} sm={6}>
          <TextField
            className="custom-textfield"
            label="First Name"
            name="firstName"
            defaultValue={editlawyerprofile.firstName}
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
            label="Last Name"
            name="lastName"
            defaultValue={editlawyerprofile.lastName}
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
            label="Email Id"
            name="email"
            defaultValue={editlawyerprofile.email}
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
            label="Practice Areas"
            name="practiceAreas"
            defaultValue={editlawyerprofile.practiceAreas}
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
            label="Years Of Experience"
            name="yearsOfExperience"
            defaultValue={editlawyerprofile.yearsOfExperience}
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
            value={editlawyerprofile.gender}
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
            label="Alternate Contact No"
            name="alternet_contact"
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
        value={stateOptions.find(option => option.label === editlawyerprofile?.state) || selectedState}
        onChange={(value) => {
          setSelectedState(value);
          seteditlawyerprofile((prev) => ({
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
    value={cityOptions.find(option => option.label === editlawyerprofile?.city) || selectedCity}
    onChange={(value) => {
      setSelectedCity(value);
      seteditlawyerprofile((prev) => ({
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
            value={editlawyerprofile.pin_code}
            type="text"
            inputProps={{ maxLength: 6 }}
            fullWidth
            size="small"
            variant="outlined"
            onChange={handleChangeedit}
          />
        </Grid>

     

        {/* Buttons */}
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button variant="contained" color="primary" className="custom-button save" onClick={completeeditlawyerprofile}>
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

    {/*====================================== EDUCATION TAB ===============================================================*/}


    <Tab eventKey="education" title="🎓 Education">
      <div className="tab-content-section">
    {editlawyerprofile?.degree?.map((_, index) => (
        <Card
          key={index}
          variant="outlined"
          sx={{
            marginBottom: 3,
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Education {index + 1}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name='degree'
                 className="custom-textfield"
                  select
                  label="Degree"
                  value={editlawyerprofile.degree[index] || ""}
                  onChange={(e) =>handlearrayChangeedit(index, "degree", e.target.value)}
                  fullWidth
                  size="small"
                >
                  {degreeOptions.map((deg) => (
                    <MenuItem key={deg} value={deg}>
                      {deg}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                 className="custom-textfield"
                name='university'
                  label="University/College Name"
                  value={editlawyerprofile.university[index] || ""}
                  onChange={(e) =>handlearrayChangeedit(index, "university", e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>

                <Grid item xs={12}>
                <TextField
                 className="custom-textfield"
                  name='yearofgraduation'
                  label="Year Of Graduation"
                  value={editlawyerprofile.yearofgraduation[index] || ""}
                  onChange={(e) =>handlearrayChangeedit(index, "yearofgraduation", e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>

          
              <Grid container justifyContent="space-between" alignItems="center">
            {editlawyerprofile.degree.length >=1 && (
                <IconButton
                aria-label="delete"
                size="small"
                color="error"
                onClick={() => handleDeleteEducationedit(index)}
                >
                <DeleteIcon fontSize="small" />
                </IconButton>

            )}
            </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Grid item xs={12} style={{ textAlign: "right" }}>
        <Button
          variant="outlined"
          onClick={() => addEducationFieldedit()}
          style={{
            textTransform: "none",
            borderRadius: "8px",
            borderColor: "#1976d2",
            color: "#1976d2",
          }}
        >
          + Add Education
        </Button>
      </Grid>
     

      </div>
    
    </Tab>

    {/*============================== BAR COUNCIL TAB =====================================================================*/}


    <Tab eventKey="barcouncil" title="📜 Bar Council">
      <div className="tab-content-section">

          <Card
          variant="outlined"
          sx={{
            marginBottom: 3,
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Bar Council Details
            </Typography>
           <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
         className="custom-textfield"
          label="Bar Council Enrolment Number"
          name="barEnrolment"
          value={editlawyerprofile.barEnrolment || ''}
          onChange={handleChangeedit}
          fullWidth
          size="small"
          variant="outlined"
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
         className="custom-textfield"
          select
          label="State Bar Council"
          name="barState"
          value={editlawyerprofile.barState || ''}
          onChange={handleChangeedit}
          fullWidth
          size="small"
          variant="outlined"
        >
          {stateBarCouncils.map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12}>
        <TextField
         className="custom-textfield"
          select
          label="Year of Registration"
          name="barYear"
          value={editlawyerprofile.barYear || ''}
          onChange={handleChangeedit}
          fullWidth
          size="small"
          variant="outlined"
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12}>
        <label style={{ display: 'block', marginBottom: 6, fontSize: 14 }}>
          Bar Council Id/Certificate Upload
        </label>
        <input
         className="custom-textfield"
          id="barCertificate"
          type="file"
          name="barCertificate"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => seteditlawyerprofile({...editlawyerprofile,barCertificate:Array.from(e.target.files)})}
          style={{ display: 'none' }}
        />
         <img src={editlawyerprofile.barCertificate} style={{height:"50px"}}></img><br></br>
        <label htmlFor="barCertificate">
          <Tooltip title="Upload Bar Certificate">
            <IconButton
              component="span"
              sx={{
                border: '1px solid #1976d2',
                borderRadius: '6px',
                padding: '10px',
                backgroundColor: '#e3f2fd',
              }}
            >
              <UploadFileIcon />
            </IconButton>
          </Tooltip>
        </label>
            
        {editlawyerprofile.barCertificate?.length > 0 && (
    <div style={{ marginTop: '10px', fontSize: '14px' }}>
 
      <strong>Selected {editlawyerprofile.barCertificate.length} file(s):</strong>
      <ul style={{ paddingLeft: '18px', marginTop: '4px' }}>
        {editlawyerprofile.barCertificate.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    </div>
  )}
      </Grid>

      

       <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button variant="contained" color="primary" className="custom-button save" onClick={completeeditlawyerprofile}>
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

    {/*===================================== PROFESSIONAL TAB ===================================================================*/}


    <Tab eventKey="professional" title="💼 Professional">
      
      <div className="tab-content-section">
        <Card
          variant="outlined"
          sx={{
            marginBottom: 3,
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Professional Details
            </Typography>

        <Grid container spacing={2}>
       
         <Grid item xs={12}>
        <Select
          className="react-select-container"
          isMulti
          classNamePrefix="react-select"
          options={lawyerspecializations}
          label="Select Specializations"
          name="specializations"
          value={editlawyerprofile.specializations || ''}
          onChange={(selectedOptions) =>
            seteditlawyerprofile((prev) => ({
                ...prev,
                specializations: selectedOptions,
            }))
            }
            placeholder="Specializations"
            menuPortalTarget={document.body}
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
        >
         
        </Select>
      </Grid>

          <Grid item xs={12}>
        <Select
          className="react-select-container"
          isMulti
          classNamePrefix="react-select"
          options={practicingcourts}
          label="Practicing Courts"
          name="practicingcourts"
          value={editlawyerprofile.practicingcourts || ''}
          onChange={(selectedOptions) =>
            seteditlawyerprofile((prev) => ({
                ...prev,
                practicingcourts: selectedOptions,
            }))
            }
            placeholder="Practicing Courts"
            menuPortalTarget={document.body}
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
        >
         
        </Select>
      </Grid>

       <Grid item xs={12}>
        <Select
            name='languages'
            className="react-select-container"
            classNamePrefix="react-select"
            isMulti
            options={languages}
            value={editlawyerprofile.languages}
            onChange={(selectedOptions) =>
            seteditlawyerprofile((prev) => ({
                ...prev,
                languages: selectedOptions,
            }))
            }
            placeholder="Languages Spoken"
            menuPortalTarget={document.body}
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
        />
        </Grid>

         <Grid item xs={12}>
        <TextField
         className="custom-textfield"
          select
          label="Current Practice Type"
          name="practice_type"
          value={editlawyerprofile.practice_type || ''}
          onChange={handleChangeedit}
          fullWidth
          size="small"
          variant="outlined"
        >
          {practiceTypes.map((practice) => (
            <MenuItem key={practice.value} value={practice.value}>
              {practice.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

        <Grid item xs={12}>
          <TextField
            className="custom-textfield"
            label="Name of Law Firm/Organization"
            value={editlawyerprofile.lawfarm_name}
            name="lawfarm_name"
            fullWidth
            size="small"
            variant="outlined"
            onChange={handleChangeedit}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            className="custom-textfield"
            label="Office Address"
            name="office_address"
            value={editlawyerprofile.office_address}
            multiline
            minRows={2}
            fullWidth
            size="small"
            variant="outlined"
            onChange={handleChangeedit}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            className="custom-textfield"
            label="Bar Association Membership"
            name="bar_membership"
            value={editlawyerprofile.bar_membership}
            fullWidth
            size="small"
            variant="outlined"
            onChange={handleChangeedit}
          />
        </Grid>



         <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button variant="contained" color="primary" className="custom-button save" onClick={completeeditlawyerprofile}>
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

   

    {/* ===================================CONSULTATION & AVAILABILITY TAB==================================================== */}

    <Tab eventKey="consultation_availability" title="📆 Consultation">
      <div className="tab-content-section">
         <Card
          variant="outlined"
          sx={{
            marginBottom: 3,
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
         <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          Consultation Details
        </Typography>
           <Grid container spacing={2}>

            <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Consultation Fee Charged</FormLabel>
              <RadioGroup
                row
                name="consultation_fee_charged"
                value={editlawyerprofile.consultation_fee_charged || ""}
                onChange={handleChangeedit}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>
{
  editlawyerprofile.consultation_fee_charged==="yes" && (

<>

          <Grid item xs={12}>
            <TextField
              className="custom-textfield"
              label="Consultation Fee Start Condition"
              name="consultation_fee_start_condition"
              value={editlawyerprofile.consultation_fee_start_condition || ""}
              onChange={handleChangeedit}
              fullWidth
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              className="custom-textfield"
              label="Consultation Fee (INR per half hour)"
              type="number"
              name="consultation_fee"
              value={editlawyerprofile.consultation_fee || ""}
              onChange={handleChangeedit}
              fullWidth
              size="small"
            />
          </Grid>

               <Grid item xs={12}>
            <Select
            name='available_days'
            className="react-select-container"
            classNamePrefix="react-select"
            isMulti
            options={days}
            value={editlawyerprofile.available_days}
            onChange={(selectedOptions) =>
            seteditlawyerprofile((prev) => ({
                ...prev,
                available_days: selectedOptions,
            }))
            }
            placeholder="Available Days"
            menuPortalTarget={document.body}
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
        />
        </Grid>

             <Grid item xs={6}>
            <TextField
              className="custom-textfield"
              label="Available From"
              type="time"
              name="available_from"
              value={editlawyerprofile.available_from || ""}
              onChange={handleChangeedit}
              fullWidth
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 minutes
              }}
            />
          </Grid>

            <Grid item xs={6}>
            <TextField
              className="custom-textfield"
              label="Available To"
              type="time"
              name="available_to"
              value={editlawyerprofile.available_to || ""}
              onChange={handleChangeedit}
              fullWidth
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 minutes
              }}
            />
          </Grid>
</>
            )
}

                {/* <Grid item xs={12}>
            <Select
            className="react-select-container"
            classNamePrefix="react-select"
            isMulti
            options={consultation_mode}
            value={lawyerprofile.consultation_mode}
            onChange={(selectedOptions) =>
            setlawyerprofile((prev) => ({
                ...prev,
                consultation_mode: selectedOptions,
            }))
            } 
            placeholder="Consultation Mode"
            menuPortalTarget={document.body}
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
        />
        </Grid> */}

          {/* Buttons */}
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button variant="contained" color="primary" className="custom-button save" onClick={completeeditlawyerprofile}>
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

   


   

    {/* DECLARATIONS & AGREEMENTS TAB */}
    <Tab eventKey="declarations_agreements" title="📝 Declarations">
      <div className="tab-content-section">
        <Card
      variant="outlined"
      sx={{
        marginBottom: 3,
        borderRadius: 2,
        backgroundColor: "#f9f9f9",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          Declarations & Agreements
        </Typography>

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
              name='declaration_authenticity'
                checked={editlawyerprofile.declaration_authenticity || false}
                onChange={(e) =>
                  seteditlawyerprofile({
                    ...editlawyerprofile,
                    declaration_authenticity: e.target.checked,
                  })
                }
              />
            }
            label="I declare that all information is true and correct."
          />

          <FormControlLabel
            control={
              <Checkbox
              name='consent_verification'
                checked={editlawyerprofile.consent_verification || false}
                onChange={(e) =>
                  seteditlawyerprofile({
                    ...editlawyerprofile,
                    consent_verification: e.target.checked,
                  })
                }
              />
            }
            label="I authorize FindMyLawyer to verify my documents."
          />

          <FormControlLabel
            control={
              <Checkbox
              name='accept_terms'
                checked={editlawyerprofile.accept_terms || false}
                onChange={(e) =>
                  seteditlawyerprofile({
                    ...editlawyerprofile,
                    accept_terms: e.target.checked,
                  })
                }
              />
            }
            label="I accept the Terms & Conditions and Privacy Policy."
          />
        </FormGroup>

      </CardContent>
    </Card>
               {/* Buttons */}
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button variant="contained" color="primary" className="custom-button save" onClick={completeeditlawyerprofile}>
            Save
          </Button>
          <Button variant="outlined" color="secondary" className="custom-button reset">
            Reset
          </Button>
        </Grid>
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

    );
};

export default LawyerProfileModal;