import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from "@mui/material";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { NAVIGATION_CONSTANTS } from "../../_constants/navigationConstants";

export const getLawyerFormattedData = (lawyer) => {
  let Data = lawyer?.lawyerKycId;
  if (!Data) return null;
  let lawyerSpecialization = Data?.professionalInfo?.specializations || [],
    practiceType = Data?.professionalInfo?.practiceType || "",
    lawFirmName = Data?.professionalInfo?.lawFirmName || "",
    officeAddress = Data?.professionalInfo?.officeAddress || {},
    languages = Data?.professionalInfo?.languages || [],
    practicingCourts = Data?.professionalInfo?.practicingCourts || [],
    professionalBio = Data?.professionalInfo?.professionalBio || "",
    officeAddressString = officeAddress?.street
      ? `${officeAddress?.street}, ${officeAddress?.city}, ${officeAddress?.state}, ${officeAddress?.pinCode}, ${officeAddress?.country}`
      : "",
    barCouncilInfo = Data?.barCouncilInfo || {};
  return {
    lawyerId: lawyer?._id,
    lawyerSpecialization,
    practiceType,
    lawFirmName,
    officeAddress: officeAddressString,
    languages,
    practicingCourts,
    professionalBio,
    barCouncilInfo,
  };
};

const LawyerProfileCard = ({ lawyer }) => {
  let lawyerData = useMemo(() => {
    return getLawyerFormattedData(lawyer);
  }, [lawyer?.lawyerKycId]);
  return (
    <Card variant="outlined">
      <CardHeader
        title={lawyer.fullName}
        subheader={lawyerData?.practiceType}
      />
      <Divider />
      <CardContent>
        <Typography variant="body1">{lawyerData.professionalBio}</Typography>
        <Typography variant="body1">
          <strong>Languages:</strong> {lawyerData.languages.join(", ")}
        </Typography>
        <Typography variant="body1">
          <strong>Practicing Courts:</strong>{" "}
          {lawyerData.practicingCourts.join(", ")}
        </Typography>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          LinkComponent={Link}
          to={`${NAVIGATION_CONSTANTS.LAWYER_PUBLIC_PROFILE_PATH}/${lawyerData.lawyerId}`}
          variant="contained"
          color="primary"
        >
          View Profile
        </Button>
      </CardActions>
    </Card>
  );
};

export default LawyerProfileCard;
