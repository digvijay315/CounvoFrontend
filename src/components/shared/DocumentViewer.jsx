import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  CircularProgress,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  OpenInNew as OpenInNewIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { getDownloadUrl } from "../../utils";

const getFileIcon = (url) => {
  const ext = url?.split(".").pop()?.toLowerCase()?.split("?")[0];
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
    return <ImageIcon sx={{ fontSize: 18 }} />;
  }
  if (ext === "pdf") {
    return <PdfIcon sx={{ fontSize: 18 }} />;
  }
  return <FileIcon sx={{ fontSize: 18 }} />;
};

const getFileName = (url) => {
  if (!url) return "Document";
  // Extract filename from URL
  const urlWithoutParams = url.split("?")[0];
  const parts = urlWithoutParams.split("/");
  return parts[parts.length - 1] || "Document";
};

const isImageUrl = (url) => {
  const ext = url?.split(".").pop()?.toLowerCase()?.split("?")[0];
  return ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
};

// Single Document Item
const DocumentItem = ({ url, index, showLabel = true }) => {
  const [signedUrl, setSignedUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const fetchSignedUrl = async () => {
    if (!url) return;
    // Otherwise, get signed URL from backend
    setLoading(true);
    setError(null);
    try {
      const result = await getDownloadUrl(url);
      if (result.success && result.signedUrl) {
        setSignedUrl(result.signedUrl);
      } else {
        setError("Failed to load document");
      }
    } catch (err) {
      setError("Failed to load document");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignedUrl();
  }, [url]);

  const handleView = () => {
    if (signedUrl) {
      if (isImageUrl(url)) {
        setPreviewOpen(true);
      } else {
        window.open(signedUrl, "_blank", "noopener,noreferrer");
      }
    }
  };

  const handleDownload = async () => {
    if (signedUrl) {
      try {
        const response = await fetch(signedUrl);
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = getFileName(url);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      } catch (err) {
        // Fallback: open in new tab
        window.open(signedUrl, "_blank", "noopener,noreferrer");
      }
    }
  };

  const fileName = getFileName(url);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          p: 1,
          borderRadius: 1,
          border: 1,
          borderColor: "divider",
          "&:hover": { borderColor: "primary.main" },
        }}
      >
        {getFileIcon(url)}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {showLabel && !isImageUrl(url) && (
            <Typography variant="body2" noWrap title={fileName}>
              {fileName.length > 25
                ? fileName.substring(0, 25) + "..."
                : fileName}
            </Typography>
          )}
          {isImageUrl(url) && signedUrl && (
            <Box
              component="img"
              src={signedUrl}
              alt={fileName}
              sx={{ width: 100, height: 100 }}
            />
          )}
        </Box>

        {loading ? (
          <CircularProgress size={16} />
        ) : error ? (
          <Typography variant="caption" color="error">
            {error}
          </Typography>
        ) : (
          <Stack direction="row" spacing={0.5}>
            <IconButton
              size="small"
              onClick={handleView}
              disabled={!signedUrl}
              title="View"
            >
              <ViewIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleDownload}
              disabled={!signedUrl}
              title="Download"
            >
              <DownloadIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => window.open(signedUrl, "_blank")}
              disabled={!signedUrl}
              title="Open in new tab"
            >
              <OpenInNewIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        )}
      </Box>

      {/* Image Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {fileName}
          <IconButton onClick={() => setPreviewOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          {signedUrl && (
            <img
              src={signedUrl}
              alt={fileName}
              style={{
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDownload} startIcon={<DownloadIcon />}>
            Download
          </Button>
          <Button onClick={() => setPreviewOpen(false)} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Main Component for viewing multiple documents
const DocumentViewer = ({ label, urls, emptyMessage = "No documents uploaded" }) => {
  // Normalize urls to array
  const urlArray = Array.isArray(urls) ? urls : urls ? [urls] : [];

  if (urlArray.length === 0) {
    return (
      <Box sx={{ mb: 1.5 }}>
        {label && (
          <Typography variant="caption" color="text.secondary" display="block">
            {label}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 1.5 }}>
      {label && (
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
          {label}
        </Typography>
      )}
      <Stack spacing={1}>
        {urlArray.map((url, index) => (
          <DocumentItem
            key={index}
            url={url}
            index={index}
            showLabel={urlArray.length > 1}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default DocumentViewer;

