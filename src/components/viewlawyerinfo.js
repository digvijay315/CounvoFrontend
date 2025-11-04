import React from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  Paper,
  Box,
  Avatar,
  Chip,
} from '@mui/material';

const LawyerStepper = ({ selectedLawyer }) => {
    const [activeStep, setActiveStep] = React.useState(0);

console.log(selectedLawyer);


const steps = [
  {
    label: '🧾 Basic Information',
    content: (
      <Paper elevation={3} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar
            src={selectedLawyer?.profilepic}
            alt="Profile"
            sx={{ width: 80, height: 80 }}
          />
          <Box>
            <Typography variant="h6" color="primary">
              {selectedLawyer?.firstName} {selectedLawyer?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">{selectedLawyer?.username}</Typography>
            <Chip label={selectedLawyer?.email} color="success" size="small" />
          </Box>
        </Box>
        <Typography><strong>📞 Phone:</strong> <span style={{ color: '#444' }}>{selectedLawyer?.phone}</span></Typography>
        <Typography><strong>👤 Gender:</strong> <span style={{ color: '#444' }}>{selectedLawyer?.gender}</span></Typography>
        <Typography><strong>🎂 DOB:</strong> <span style={{ color: '#444' }}>{selectedLawyer?.dob}</span></Typography>
        <Typography>
          <strong>📍 Address:</strong>{' '}
          <span style={{ color: '#444' }}>
            {selectedLawyer?.residential_address}, {selectedLawyer?.city}, {selectedLawyer?.state} - {selectedLawyer?.pin_code}
          </span>
        </Typography>
      </Paper>
    ),
  },
  {
    label: '🎓 Education',
    content: selectedLawyer?.degree?.map((deg, i) => (
      <Paper elevation={1} key={i} sx={{ p: 2, mb: 2, bgcolor: '#eef6f9', borderRadius: 2 }}>
        <Typography variant="subtitle1" color="primary"><strong>Degree:</strong> {deg}</Typography>
        <Typography><strong>🏛️ University:</strong> {selectedLawyer.university?.[i]}</Typography>
        {selectedLawyer.certificate?.[i] && (
          <Box mt={1} position="relative" width="120px">
            <img
              src={selectedLawyer.certificate[i]}
              alt="Certificate"
              style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc' }}
            />
            <a
              href={selectedLawyer.certificate[i]}
              target="_blank"
              rel="noreferrer"
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                // background: '#fff',
                borderRadius: '50%',
                padding: '0px 0px',
                fontSize: '14px',
                textDecoration: 'none',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
              }}
              title="View Full Image"
            >
              👁️
            </a>
          </Box>
        )}
      </Paper>
    )),
  },
  {
    label: '💼 Work & Bar Details',
    content: (
      <Paper elevation={2} sx={{ p: 2, bgcolor: '#fff8e1', borderRadius: 2 }}>
        <Typography><strong>🪪 Bar Enrolment No:</strong> {selectedLawyer?.barEnrolment}</Typography>
        <Typography><strong>🌐 Bar Council State:</strong> {selectedLawyer?.barState}</Typography>
        <Typography><strong>📅 Registration Year:</strong> {selectedLawyer?.barYear}</Typography>
        <Typography><strong>🔖 AIBE No:</strong> {selectedLawyer?.aibeNo}</Typography>
        <Typography><strong>🎯 Specializations:</strong> {selectedLawyer?.specializations.map(l => l.label).join(', ')}</Typography>
        <Typography><strong>🗣️ Languages:</strong> {selectedLawyer?.languages?.map(l => l.label).join(', ')}</Typography>
        <Typography><strong>⚖️ Practice Types:</strong> {selectedLawyer.practice_type}</Typography>
        <Typography><strong>🏢 Law Firm:</strong> {selectedLawyer?.lawfarm_name}</Typography>
        <Typography><strong>📍 Office:</strong> {selectedLawyer?.office_address}</Typography>
        <Typography><strong>🪪 Bar Membership:</strong> {selectedLawyer?.bar_membership}</Typography>
        <Typography><strong>📝 Bio:</strong> {selectedLawyer?.professional_bio}</Typography>
        {selectedLawyer.proofofpractice && (
          <Box mt={1} position="relative" width="120px">
            <img
              src={selectedLawyer.proofofpractice}
              alt="Practice Proof"
              style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc' }}
            />
            <a
              href={selectedLawyer.proofofpractice}
              target="_blank"
              rel="noreferrer"
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                // background: '#fff',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '14px',
                textDecoration: 'none',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
              }}
            >
              👁️
            </a>
          </Box>
        )}
      </Paper>
    ),
  },
  {
    label: '📁 Documents & Other Info',
    content: (
      <Paper elevation={2} sx={{ p: 2, bgcolor: '#f3e5f5', borderRadius: 2 }}>
        <Typography><strong>💰 Consultation Fee:</strong> {selectedLawyer.consultation_fee}</Typography>
        <Typography><strong>📅 Available Days:</strong> {selectedLawyer.available_days?.map(d => d.label).join(', ')}</Typography>
        <Typography><strong>⏰ Available From:</strong> {selectedLawyer.available_from}</Typography>
        <Typography><strong>⏱️ Available To:</strong> {selectedLawyer.available_to}</Typography>
        <Typography><strong>💻 Consultation Mode:</strong> {selectedLawyer.consultation_mode?.map(d => d.label).join(', ')}</Typography>
        <Typography><strong>✅ Declaration Authenticity:</strong> {selectedLawyer.declaration_authenticity}</Typography>
        <Typography><strong>🔒 Accepted Terms:</strong> {selectedLawyer.accept_terms}</Typography>
        {(selectedLawyer.identity_proof || []).map((proof, i) => (
          <Paper elevation={1} key={i} sx={{ p: 2, mt: 2, bgcolor: '#fff' }}>
            <Typography><strong>🪪 Identity:</strong> {proof}</Typography>
            <Typography><strong>🔢 Number:</strong> {selectedLawyer.identity_number?.[i]}</Typography>
            {selectedLawyer.identity_pic?.[i] && (
              <Box mt={1} position="relative" width="120px">
                <img
                  src={selectedLawyer.identity_pic[i]}
                  alt="Identity Proof"
                  style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc' }}
                />
                <a
                  href={selectedLawyer.identity_pic[i]}
                  target="_blank"
                  rel="noreferrer"
                  className="eye-icon"
                  title="View Full"
                  style={{  fontSize: '14px',}}
                >
                  👁️
                </a>
              </Box>
            )}
            <Typography><strong>📬 Address Proof:</strong> {selectedLawyer.address_proof?.[i]}</Typography>
            {selectedLawyer.address_pic?.[i] && (
              <Box mt={1} position="relative" width="120px">
                <img
                  src={selectedLawyer.address_pic[i]}
                  alt="Address Proof"
                  style={{ width: '100%', borderRadius: 6, border: '1px solid #ccc' }}
                />
                <a
                  href={selectedLawyer.address_pic[i]}
                  target="_blank"
                  rel="noreferrer"
                  className="eye-icon"
                  title="View Full"
                  style={{  fontSize: '14px',}}
                >
                  👁️
                </a>
              </Box>
            )}
          </Paper>
        ))}
      </Paper>
    ),
  },
];



  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', p: 2 }}>
      <Typography variant="h5" gutterBottom textAlign="center">
        👨‍⚖️ Lawyer Profile Details
      </Typography>
     <Stepper orientation="vertical" activeStep={activeStep} nonLinear>
  {steps.map((step, index) => (
    <Step key={index}>
      <StepLabel onClick={() => setActiveStep(index)} style={{ cursor: 'pointer' }}>
        {step.label}
      </StepLabel>
      <StepContent>
        <Box mb={2}>{step.content}</Box>
      </StepContent>
    </Step>
  ))}
</Stepper>
    </Box>
  );
};

export default LawyerStepper;
