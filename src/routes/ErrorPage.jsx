// ErrorPage.jsx
import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import { NAVIGATION_CONSTANTS } from "../_constants/navigationConstants";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  // Auto-redirect to login after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(NAVIGATION_CONSTANTS.LOGIN_PATH);
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleRedirect = () => {
    navigate(NAVIGATION_CONSTANTS.LOGIN_PATH);
  };

  const getErrorContent = () => {
    if (isRouteErrorResponse(error)) {
      return {
        title: `Error ${error.status}`,
        message: error.statusText || "An error occurred",
        details: error.data?.message || "",
      };
    }

    return {
      title: "Something went wrong",
      message: error?.message || "An unexpected error occurred",
      details: "",
    };
  };

  const { title, message, details } = getErrorContent();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg p-8 text-center">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Error Content */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 mb-1">{message}</p>
        {details && <p className="text-sm text-gray-500 mb-6">{details}</p>}

        {/* Redirect Message */}
        <p className="text-sm text-gray-500 mb-6">
          Redirecting to login page in 5 seconds...
        </p>

        {/* Action Buttons */}
        <div className="space-x-3 flex">
          <button
            onClick={handleRedirect}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            Go to Login Now
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition duration-200 "
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
