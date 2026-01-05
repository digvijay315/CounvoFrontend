import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Stack,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
} from "@mui/icons-material";
import { uploadResource } from "../../utils";
import { toast } from "react-toastify";

const getFileIcon = (fileName) => {
  const ext = fileName?.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
    return <ImageIcon sx={{ fontSize: 16 }} />;
  }
  if (ext === "pdf") {
    return <PdfIcon sx={{ fontSize: 16 }} />;
  }
  return <FileIcon sx={{ fontSize: 16 }} />;
};

const getFileName = (url) => {
  if (!url) return "Document";
  // Extract filename from URL or fileKey
  const parts = url.split("/");
  return parts[parts.length - 1] || "Document";
};

const FileUpload = ({
  label = "Upload File",
  folder = "documents",
  accept = ".pdf,.jpg,.jpeg,.png",
  multiple = false,
  value = [], // Array of URLs
  onChange, // (urls: string[]) => void
  onUploadingChange, // (uploading: boolean) => void - notify parent of upload state
  maxFiles = 5,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);

  const updateUploading = (isUploading) => {
    setUploading(isUploading);
    onUploadingChange?.(isUploading);
  };

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Check max files limit
    const currentCount = Array.isArray(value) ? value.length : 0;
    if (currentCount + files.length > maxFiles) {
      toast.warning(`Maximum ${maxFiles} files allowed`);
      return;
    }

    updateUploading(true);
    const uploadedUrls = [];

    try {
      for (const file of files) {
        const result = await uploadResource(file, file.name, folder);
        if (result.success && result.publicUrl) {
          uploadedUrls.push(result.publicUrl);
        } else {
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      if (uploadedUrls.length > 0) {
        const currentUrls = Array.isArray(value) ? value : [];
        onChange([...currentUrls, ...uploadedUrls]);
        toast.success(
          `${uploadedUrls.length} file${uploadedUrls.length > 1 ? "s" : ""} uploaded`
        );
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      updateUploading(false);
      // Reset input
      event.target.value = "";
    }
  };

  const handleRemove = (indexToRemove) => {
    const currentUrls = Array.isArray(value) ? value : [];
    const newUrls = currentUrls.filter((_, index) => index !== indexToRemove);
    onChange(newUrls);
  };

  const currentUrls = Array.isArray(value) ? value : value ? [value] : [];
  const inputId = `file-upload-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <Box>
      {/* Upload Button */}
      <input
        type="file"
        id={inputId}
        accept={accept}
        multiple={multiple}
        style={{ display: "none" }}
        onChange={handleFileSelect}
        disabled={disabled || uploading}
      />
      <label htmlFor={inputId}>
        <Button
          component="span"
          variant="outlined"
          fullWidth
          disabled={disabled || uploading || currentUrls.length >= maxFiles}
          startIcon={
            uploading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <CloudUploadIcon />
            )
          }
          sx={{
            height: 40,
            borderStyle: "dashed",
            textTransform: "none",
          }}
        >
          {uploading ? "Uploading..." : label}
        </Button>
      </label>

      {/* Uploaded Files List */}
      {currentUrls.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
          {currentUrls.map((url, index) => (
            <Chip
              key={index}
              icon={getFileIcon(url)}
              label={getFileName(url).substring(0, 20) + (getFileName(url).length > 20 ? "..." : "")}
              size="small"
              onDelete={() => handleRemove(index)}
              deleteIcon={<DeleteIcon sx={{ fontSize: 14 }} />}
              sx={{
                maxWidth: 200,
                "& .MuiChip-label": { fontSize: "0.75rem" },
              }}
            />
          ))}
        </Stack>
      )}

      {/* Helper Text */}
      {currentUrls.length > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
          {currentUrls.length} of {maxFiles} files uploaded
        </Typography>
      )}
    </Box>
  );
};

export default FileUpload;

