import { NAVIGATION_CONSTANTS } from "../_constants/navigationConstants";

export const getRouteBasedOnUserType = (userType = "customer") => {
  switch (userType) {
    case "customer":
      return NAVIGATION_CONSTANTS.FIND_LAWYER_PATH;
    default:
      return NAVIGATION_CONSTANTS.DASHBOARD_PATH;
  }
};