import { NAVIGATION_CONSTANTS } from "../_constants/navigationConstants";
import api from "../api";

export const getRouteBasedOnUserType = (userType = "customer") => {
  switch (userType) {
    case "customer":
      return NAVIGATION_CONSTANTS.FIND_LAWYER_PATH;
    default:
      return NAVIGATION_CONSTANTS.DASHBOARD_PATH;
  }
};

/**
 * Upload a file to S3 via presigned URL
 * @param {File} file - The file to upload
 * @param {string} filename - Original filename
 * @param {string} folder - S3 folder path (e.g., 'chat', 'profiles', 'documents')
 * @returns {Promise<{success: boolean, fileKey?: string, publicUrl?: string, error?: string}>}
 */
export const uploadResource = async (file, filename, folder) => {
  try {
    // Step 1: Get presigned upload URL from backend
    const response = await api.post("/api/v2/resources/upload", {
      fileName: filename,
      folder: folder || "uploads",
    });

    if (!response.data.success) {
      return { success: false, error: "Failed to get upload URL" };
    }

    const { uploadUrl, fileKey, publicUrl, contentType } = response.data.data;

    // Step 2: Upload file directly to S3 using PUT request
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      return { success: false, error: "Failed to upload file to S3" };
    }

    return {
      success: true,
      fileKey,
      publicUrl,
    };
  } catch (error) {
    console.error("Error uploading resource:", error);
    return {
      success: false,
      error: error.message || "Upload failed",
    };
  }
};

/**
 * Get a signed download URL for a file stored in S3
 * @param {string} fileKey - The S3 file key
 * @returns {Promise<{success: boolean, signedUrl?: string, error?: string}>}
 */
export const getDownloadUrl = async (fileKey) => {
  try {
    const response = await api.get("/api/v2/resources/download", {
      params: { fileKey },
    });

    if (!response.data.success) {
      return { success: false, error: "Failed to get download URL" };
    }

    return {
      success: true,
      signedUrl: response.data.data.accessUrl,
    };
  } catch (error) {
    console.error("Error getting download URL:", error);
    return {
      success: false,
      error: error.message || "Failed to get download URL",
    };
  }
};
