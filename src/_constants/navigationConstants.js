import {
  Dashboard,
  Gavel,
  History,
  Email,
  Support,
  People,
  Checklist,
  Person,
} from "@mui/icons-material";

export const NAVIGATION_CONSTANTS = {
  MANAGE_APPROVALS_PATH: "/dashboard/manageapprovals",
  MANAGE_USERS_PATH: "/dashboard/manageusers",
  LAWYER_PUBLIC_PROFILE_PATH: "/dashboard/lawyerprofile",
  PROFILE_PATH: "/dashboard/profile",
  SETTINGS_PATH: "/dashboard/settings",
  MESSAGES_PATH: "/dashboard/messages",
  HISTORY_PATH: "/dashboard/history",
  SUPPORT_PATH: "/dashboard/support",
  CLIENTS_PATH: "/dashboard/clients",
  PAYMENT_PATH: "/dashboard/payment",
  REPORT_PATH: "/dashboard/report",
  FIND_LAWYER_PATH: "/dashboard/findlawyer",
  DASHBOARD_PATH: "/dashboard",
  LOGIN_PATH: "/auth/signin",
  REGISTER_PATH: "/auth/signup",
  FORGOT_PASSWORD_PATH: "/auth/forgot-password",
  RESET_PASSWORD_PATH: "/auth/reset-password",
};

export const NAVIGATION_MENU_ITEMS = [
  {
    label: "Dashboard",
    path: NAVIGATION_CONSTANTS.DASHBOARD_PATH,
    icon: <Dashboard />,
    allowedRoles: ["lawyer", "admin"],
  },
  {
    label: "Find Lawyer",
    path: NAVIGATION_CONSTANTS.FIND_LAWYER_PATH,
    icon: <Gavel />,
    allowedRoles: ["customer"],
  },
  {
    label: "Clients",
    path: NAVIGATION_CONSTANTS.CLIENTS_PATH,
    icon: <People />,
    allowedRoles: ["lawyer"],
  },
  {
    label: "Messages",
    path: NAVIGATION_CONSTANTS.MESSAGES_PATH,
    icon: <Email />,
    allowedRoles: ["customer", "lawyer"],
  },
  {
    label: "History",
    path: NAVIGATION_CONSTANTS.HISTORY_PATH,
    icon: <History />,
    allowedRoles: ["customer", "lawyer"],
  },
  {
    label: "Support",
    path: NAVIGATION_CONSTANTS.SUPPORT_PATH,
    icon: <Support />,
    allowedRoles: ["customer", "lawyer"],
  },
  {
    label: "Manage Approvals",
    path: NAVIGATION_CONSTANTS.MANAGE_APPROVALS_PATH,
    icon: <Checklist />,
    allowedRoles: ["admin"],
  },
  {
    label: "Manage Users",
    path: NAVIGATION_CONSTANTS.MANAGE_USERS_PATH,
    icon: <People />,
    allowedRoles: ["admin"],
  },
];

export const GetNavigationMenuItems = (role = "customer") => {
  return NAVIGATION_MENU_ITEMS.filter((item) =>
    item.allowedRoles.includes(role)
  );
};
