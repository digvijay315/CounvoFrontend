import { Button, Card, CardActions, CardContent, CardHeader, Divider, Typography } from '@mui/material'
import React from 'react'

const LawyerProfileCard = ({lawyer}) => {
  return (
    <Card variant="outlined">
      <CardHeader title={lawyer.fullName} />
      <Divider />
      <CardContent>
        <Typography variant="body1">{lawyer.email}</Typography>
        <Typography variant="body1">{lawyer.phone}</Typography>
        <Typography variant="body1">{lawyer.gender}</Typography>
        <Typography variant="body1">{lawyer.dob}</Typography>
        <Typography variant="body1">{lawyer.residential_address}</Typography>
        <Typography variant="body1">{lawyer.city}</Typography>
        <Typography variant="body1">{lawyer.state}</Typography>
      </CardContent>
      <Divider />
      <CardActions>
        <Button variant="contained" color="primary">
          View Profile
        </Button>
      </CardActions>
    </Card>
  )
}

export default LawyerProfileCard