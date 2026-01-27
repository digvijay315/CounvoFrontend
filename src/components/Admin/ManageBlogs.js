import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Chip,
  Switch,
  FormControlLabel,
  Grid,
  Divider,
  Tooltip,
  CircularProgress,
  InputAdornment,
  Tabs,
  Tab,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon, Search as SearchIcon
} from "@mui/icons-material";

// Rich text editor - You'll need to install this package
// npm install react-quill
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../../api";
import { getDownloadUrl, uploadResource } from "../../utils";
import { LawyerSpecializations } from "../../_constants/dataConstants";

// Define the data structure for a blog
const initialBlogData = {
  blogTitle: "",
  blogContent: "",
  blogTags: "",
  authorName: "",
  authorPosition: "",
  authorBio: "",
  isPublished: false,
  slug: "",
  featuredImage: "",
  metaDescription: "",
  excerpt: "",
  blogpostingSchema: JSON.stringify({
    "@type": "BlogPosting",
    "headline": "",
    "description": "",
    "author": {},
    "datePublished": "",
    "dateModified": "",
    "image": "",
    "mainEntityOfPage": ""
  }
    , null, "\t"),
  breadcrumbSchema: JSON.stringify({
    "@type": "BreadcrumbList",
    "itemListElement": []
  }
    , null, "\t"),
  blogCategory: "",
  featuredImageAltText: "",
};

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [blogData, setBlogData] = useState(initialBlogData);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    blogId: null,
  });
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = () => {
    setLoading(true);
    api
      .get("/api/v2/admin/blogs")
      .then((response) => {
        if (response?.data?.blogs) setBlogs(response.data?.blogs);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
        setNotification({
          open: true,
          message: "Failed to load blogs. Please try again.",
          severity: "error",
        });
        setLoading(false);
      });
  };

  const handleOpen = (blog = initialBlogData) => {
    setBlogData(blog);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setBlogData(initialBlogData);
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "isPublished") {
      setBlogData({ ...blogData, [name]: checked });
    } else {
      setBlogData({ ...blogData, [name]: value });
    }
  };

  const handleEditorChange = (content) => {
    setBlogData({ ...blogData, blogContent: content });
  };

  const handleTagsChange = (e) => {
    setBlogData({ ...blogData, blogTags: e.target.value });
  };

  const validateBlogData = (data) => {
    const errors = {};

    const isEmpty = (v) =>
      v === undefined || v === null || String(v).trim() === "";

    // Basic fields
    if (isEmpty(data.blogTitle))
      errors.blogTitle = "Blog title is required";

    if (isEmpty(data.blogContent))
      errors.blogContent = "Blog content cannot be empty";

    if (isEmpty(data.excerpt))
      errors.excerpt = "Excerpt is required";

    if (isEmpty(data.metaDescription))
      errors.metaDescription = "Meta description is required";

    if (isEmpty(data.featuredImage))
      errors.featuredImage = "Featured image is required";

    if (isEmpty(data.featuredImageAltText))
      errors.featuredImageAltText = "Featured image alt text is required";

    if (isEmpty(data.blogCategory))
      errors.blogCategory = "Blog category is required";

    // Author fields
    if (isEmpty(data.authorName))
      errors.authorName = "Author name is required";

    if (isEmpty(data.authorPosition))
      errors.authorPosition = "Author position is required";

    if (isEmpty(data.authorBio))
      errors.authorBio = "Author bio is required";

    // Schema validation
    try {
      const blogSchema = JSON.parse(data.blogpostingSchema);
      if (blogSchema["@type"] !== "BlogPosting")
        errors.blogpostingSchema = "Invalid BlogPosting schema type";
    } catch {
      errors.blogpostingSchema = "BlogPosting schema must be valid JSON";
    }

    try {
      const breadcrumb = JSON.parse(data.breadcrumbSchema);
      if (breadcrumb["@type"] !== "BreadcrumbList")
        errors.breadcrumbSchema = "Invalid Breadcrumb schema type";
    } catch {
      errors.breadcrumbSchema = "Breadcrumb schema must be valid JSON";
    }

    return {
      status: Object.keys(errors).length === 0,
      errors
    };
  };

  const [formErrors, setFormErrors] = useState({});
  const getErrorField = (field) => formErrors[field] || "";
  const handleCreateOrUpdateBlog = () => {
    // Basic validation
    const validation = validateBlogData(blogData);
    if (validation.status === false) {
      setNotification({
        open: true,
        message: "Please correct the errors in the form.",
        severity: "error",
      });
      setFormErrors(validation.errors);
      return;
    }
    const isUpdate = Boolean(blogData.slug);
    const url = isUpdate
      ? "/api/v2/admin/blogs/update"
      : "/api/v2/admin/blogs/create";

    setLoading(true);
    api[isUpdate ? "put" : "post"](url, blogData)
      .then((response) => {
        setNotification({
          open: true,
          message: blogData.slug
            ? "Blog updated successfully!"
            : "Blog created successfully!",
          severity: "success",
        });
        fetchBlogs();
        handleClose();
      })
      .catch((error) => {
        console.error("Error saving blog:", error);
        setNotification({
          open: true,
          message: "Failed to save blog. Please try again.",
          severity: "error",
        });
        setLoading(false);
      });
  };

  const openDeleteConfirm = (id) => {
    setConfirmDelete({ open: true, blogId: id });
  };

  const closeDeleteConfirm = () => {
    setConfirmDelete({ open: false, blogId: null });
  };

  const handleDeleteBlog = () => {
    if (!confirmDelete.blogId) return;

    setLoading(true);
    api
      .delete(`/api/v2/admin/blogs/${confirmDelete.blogId}`)
      .then(() => {
        setNotification({
          open: true,
          message: "Blog deleted successfully!",
          severity: "success",
        });
        fetchBlogs();
        closeDeleteConfirm();
      })
      .catch((error) => {
        console.error("Error deleting blog:", error);
        setNotification({
          open: true,
          message: "Failed to delete blog. Please try again.",
          severity: "error",
        });
        setLoading(false);
        closeDeleteConfirm();
      });
  };

  // Filter blogs based on search term
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.status === (activeTab === 1 ? "published" : activeTab === 2 ? "draft" : blog.status) &&
      (blog.blogTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.authorName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const [featureImagePreview, setFeaturedImagePreview] = useState(null);
  useEffect(() => {
    if (blogData?.featuredImage) {
      if (blogData?.featuredImage?.startsWith("https")) {
        setFeaturedImagePreview(blogData?.featuredImage);
      } else {
        getDownloadUrl(blogData?.featuredImage).then((data) => {
          if (data?.success) {
            setFeaturedImagePreview(data?.signedUrl);
          } else {
            setFeaturedImagePreview(null);
          }
        });
      }
    } else {
      setFeaturedImagePreview(null);
    }
  }, [blogData?.featuredImage]);

  return (
    <Box sx={{ height: "100%", width: "100%", p: 3 }}>
      <Typography variant="h4" fontWeight="600" gutterBottom>
        Manage Blogs
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Create, edit, and manage your blog content
      </Typography>

      {/* Actions Bar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen()}
            startIcon={<AddIcon />}
          >
            Create New Blog
          </Button>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            placeholder="Search blogs..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mr: 2 }}

          />
        </Box>
      </Box>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="All Blogs" />
        <Tab label="Published" />
        <Tab label="Drafts" />
      </Tabs>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredBlogs.length > 0 ? (
        <TableContainer component={Paper} elevation={2}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "primary.light" }}>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBlogs.map((blog) => (
                <TableRow key={blog.slug} hover>
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {blog.blogTitle}
                    </Typography>
                  </TableCell>
                  <TableCell>{blog.authorName}</TableCell>
                  <TableCell>
                    <Chip
                      label={blog.isPublished ? "Published" : "Draft"}
                      color={blog.isPublished ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {Array.isArray(blog.blogTags) &&
                      blog.blogTags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag.trim()}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpen(blog)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => openDeleteConfirm(blog._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 4, textAlign: "center", mt: 2 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No blogs available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create your first blog post to get started
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen()}
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
          >
            Create New Blog
          </Button>
        </Paper>
      )}

      {/* Blog Create/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" component="div">
            {blogData.slug ? "Edit Blog" : "Create New Blog"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {blogData.slug
              ? "Update your blog content and settings"
              : "Fill in the details to create a new blog post"}
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="blogTitle"
                label="Blog Title"
                value={blogData.blogTitle}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                placeholder="Enter an engaging title for your blog"
                error={!!getErrorField("blogTitle")}
                helperText={getErrorField("blogTitle")}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Blog Content
              </Typography>
              <ReactQuill
                value={blogData.blogContent}
                onChange={handleEditorChange}
                style={{ height: "200px", marginBottom: "50px" }}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image"],
                    ["clean"],
                  ],
                }}
              />
              {!!getErrorField("blogContent") && (<Typography color="error" variant="body2">{getErrorField("blogContent")}</Typography>)}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="blogTags"
                label="Tags (comma separated)"
                value={blogData.blogTags}
                onChange={handleTagsChange}
                fullWidth
                variant="outlined"
                placeholder="tech, news, updates"
                error={!!getErrorField("blogTags")}
                helperText={getErrorField("blogTags")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="slug"
                label="URL Slug"
                value={blogData.slug}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                placeholder="my-blog-post"
                helperText="Leave empty to auto-generate from title"

              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                Author Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="authorName"
                label="Author Name"
                value={blogData.authorName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                error={!!getErrorField("authorName")}
                helperText={getErrorField("authorName")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="authorPosition"
                label="Author Position"
                value={blogData.authorPosition}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                error={!!getErrorField("authorPosition")}
                helperText={getErrorField("authorPosition")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="authorBio"
                label="Author Bio"
                value={blogData.authorBio}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                error={!!getErrorField("authorBio")}
                helperText={getErrorField("authorBio")}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                SEO Information
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="metaDescription"
                label="Meta Description"
                value={blogData.metaDescription}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                error={!!getErrorField("metaDescription")}
                helperText={getErrorField("metaDescription")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="excerpt"
                label="Excerpt"
                value={blogData.excerpt}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                error={!!getErrorField("excerpt")}
                helperText={getErrorField("excerpt")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                maxRows={12}
                name="blogpostingSchema"
                label="Blog Posting Schema"
                value={blogData.blogpostingSchema}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                error={!!getErrorField("blogpostingSchema")}
                helperText={getErrorField("blogpostingSchema")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                maxRows={4}
                name="breadcrumbSchema"
                label="Breadcrumb Schema"
                value={blogData.breadcrumbSchema}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                error={!!getErrorField("breadcrumbSchema")}
                helperText={getErrorField("breadcrumbSchema")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>Select Blog Category</Typography>
              <Select
                name="blogCategory"
                value={blogData.blogCategory ?? ""}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                error={!!getErrorField("blogCategory")}
                helperText={getErrorField("blogCategory")}
              >
                {LawyerSpecializations.filter(item => Boolean(item.value)).map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                Image & Publication Settings
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="featuredImage"
                onChange={async (e) => {
                  let selectedFile = e?.target?.files?.[0];
                  if (selectedFile) {
                    const resource = await uploadResource(
                      selectedFile,
                      selectedFile?.name || "filename",
                      "blogs"
                    );
                    handleChange({
                      target: {
                        name: "featuredImage",
                        value: resource?.fileKey,
                      },
                    });
                  } else {
                    handleChange({
                      target: { name: "featuredImage", value: "" },
                    });
                  }
                }}
                fullWidth
                variant="outlined"
                type="file"
                placeholder="https://example.com/image.jpg"
                error={!!getErrorField("featuredImage")}
                helperText={getErrorField("featuredImage")}
              />
              {featureImagePreview && (
                <img height={200} width={200} src={featureImagePreview}></img>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="featuredImageAltText"
                label="Image Alt Text"
                value={blogData.featuredImageAltText}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                error={!!getErrorField("featuredImageAltText")}
                helperText={getErrorField("featuredImageAltText")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={blogData.isPublished}
                    onChange={handleChange}
                    name="isPublished"
                    color="primary"
                  />
                }
                label={blogData.isPublished ? "Published" : "Draft"}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleCreateOrUpdateBlog}
            variant="contained"
            color="primary"
            disabled={!blogData.blogTitle || !blogData.blogContent}
          >
            {blogData.slug ? "Update Blog" : "Publish Blog"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete.open} onClose={closeDeleteConfirm}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this blog? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirm} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteBlog} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box >
  );
};

export default ManageBlogs;
