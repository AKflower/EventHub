import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Event as EventIcon,
  Place as PlaceIcon,
  AccessTime as TimeIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  AttachMoney as MoneyIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import {
  getAllTicketTypes,
  updateEvent,
  getAllCategories,
} from "../../services/adminService";

const ViewEvent = () => {
  const { id, eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  console.log(eventId);
  useEffect(() => {
    fetchEventDetails();
    fetchTicketTypes();
    fetchCategories();
  }, [eventId]);
  const API_URL =
    process.env.REACT_APP_API_URL + "/api" || "http://localhost:3001/api";
  const fetchEventDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await fetch(`${API_URL}/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch event details");
      }

      const data = await response.json();
      setEvent(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching event details:", error);
      setLoading(false);
    }
  };

  const fetchTicketTypes = async () => {
    try {
      const data = await getAllTicketTypes();
      // Filter ticket types for this event
      const eventTicketTypes = data.filter(
        (tt) => tt.eventId === parseInt(eventId)
      );
      setTicketTypes(eventTicketTypes);
    } catch (error) {
      console.error("Error fetching ticket types:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleOpenEditDialog = () => {
    // Format dates for datetime-local input
    const formattedEvent = {
      ...event,
      startTime: format(new Date(event.startTime), "yyyy-MM-dd'T'HH:mm"),
      endTime: format(new Date(event.endTime), "yyyy-MM-dd'T'HH:mm"),
    };
    setEditFormData(formattedEvent);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: checked,
    });
  };

  const handleSaveEvent = async () => {
    try {
      setLoading(true);
      await updateEvent(eventId, editFormData);
      setOpenEditDialog(false);
      await fetchEventDetails();
      showSnackbar("Event updated successfully", "success");
    } catch (error) {
      console.error("Error updating event:", error);
      showSnackbar("Failed to update event: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy, HH:mm");
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "Free";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!event) {
    return (
      <Box>
        <Typography variant="h6" color="error">
          Event not found or error loading event details
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/events")}
          sx={{ mt: 2 }}
        >
          Back to Events
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Header with back button and edit button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/events")}
        >
          Back to Events
        </Button>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleOpenEditDialog}
        >
          Edit Event
        </Button>
      </Box>

      {/* Event Header */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${
            event.coverImg
              ? `${API_URL}/galleries/${event.coverImg}`
              : "https://source.unsplash.com/random/?event"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={9}>
            <Typography variant="h4" gutterBottom>
              {event.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <TimeIcon sx={{ mr: 1 }} />
              <Typography variant="body1">
                {formatDate(event.startTime)} - {formatDate(event.endTime)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <PlaceIcon sx={{ mr: 1 }} />
              <Typography variant="body1">
                {event.venueName}, {event.street}, {event.ward},{" "}
                {event.district}, {event.city}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CategoryIcon sx={{ mr: 1 }} />
              <Chip
                label={event.category || "Uncategorized"}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ borderColor: "white", color: "white" }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={3} sx={{ textAlign: "right" }}>
            <Box>
              <Typography variant="body2">Price from</Typography>
              <Typography variant="h5" sx={{ mt: 1, mb: 2 }}>
                {event.isFree ? (
                  <Chip label="FREE" color="success" />
                ) : (
                  formatCurrency(event.minPrice)
                )}
              </Typography>
              <Chip
                label={
                  new Date() < new Date(event.startTime)
                    ? "Upcoming"
                    : new Date() > new Date(event.endTime)
                    ? "Completed"
                    : "Active"
                }
                color={
                  new Date() < new Date(event.startTime)
                    ? "primary"
                    : new Date() > new Date(event.endTime)
                    ? "secondary"
                    : "success"
                }
                sx={{ fontWeight: "bold" }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Event Details */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <DescriptionIcon sx={{ mr: 1 }} /> Description
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                {event.description || "No description provided."}
              </Typography>
            </CardContent>
          </Card>

          {/* Ticket Types */}
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ display: "flex", alignItems: "center", mb: 2 }}
              >
                <MoneyIcon sx={{ mr: 1 }} /> Ticket Types
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {ticketTypes.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Ticket Type</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Availability</TableCell>
                        <TableCell>Sale Period</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ticketTypes.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell>
                            <Typography variant="body1" fontWeight="bold">
                              {ticket.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {ticket.description || "No description"}
                            </Typography>
                          </TableCell>
                          <TableCell>{formatCurrency(ticket.price)}</TableCell>
                          <TableCell>
                            <Chip
                              label={`${ticket.available}/${ticket.total}`}
                              color={ticket.available > 0 ? "success" : "error"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDate(ticket.startTime)}
                            </Typography>
                            <Typography variant="body2">
                              to {formatDate(ticket.endTime)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body1" sx={{ py: 2, textAlign: "center" }}>
                  No ticket types found for this event.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Event Information */}
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Event Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Event ID
                </Typography>
                <Typography variant="body1">{event.id}</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Creation Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(event.createdTime)}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Last Modified
                </Typography>
                <Typography variant="body1">
                  {formatDate(event.modifiedTime)}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Status
                </Typography>
                <Chip
                  label={event.isDelete ? "Deleted" : "Active"}
                  color={event.isDelete ? "error" : "success"}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>

          {/* Payment Information */}
          {!event.isFree && (
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Payment Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Account Owner
                  </Typography>
                  <Typography variant="body1">
                    {event.accOwner || "N/A"}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Account Number
                  </Typography>
                  <Typography variant="body1">
                    {event.accNumber || "N/A"}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Bank
                  </Typography>
                  <Typography variant="body1">{event.bank || "N/A"}</Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Branch
                  </Typography>
                  <Typography variant="body1">
                    {event.branch || "N/A"}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Edit Event Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent dividers>
          {editFormData && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Event Name"
                  name="name"
                  value={editFormData.name || ""}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={editFormData.description || ""}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Start Time"
                  name="startTime"
                  type="datetime-local"
                  value={editFormData.startTime || ""}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="End Time"
                  name="endTime"
                  type="datetime-local"
                  value={editFormData.endTime || ""}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="categoryId"
                    value={editFormData.categoryId || ""}
                    onChange={handleInputChange}
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Venue Name"
                  name="venueName"
                  value={editFormData.venueName || ""}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={editFormData.city || ""}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="District"
                  name="district"
                  value={editFormData.district || ""}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Ward"
                  name="ward"
                  value={editFormData.ward || ""}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Street"
                  name="street"
                  value={editFormData.street || ""}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editFormData.isFree || false}
                      onChange={handleSwitchChange}
                      name="isFree"
                    />
                  }
                  label="Free Event"
                />
              </Grid>
              {!editFormData.isFree && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Minimum Price"
                      name="minPrice"
                      type="number"
                      value={editFormData.minPrice || ""}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₫</InputAdornment>
                        ),
                      }}
                      margin="normal"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Account Owner"
                      name="accOwner"
                      value={editFormData.accOwner || ""}
                      onChange={handleInputChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Account Number"
                      name="accNumber"
                      value={editFormData.accNumber || ""}
                      onChange={handleInputChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Bank"
                      name="bank"
                      value={editFormData.bank || ""}
                      onChange={handleInputChange}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Branch"
                      name="branch"
                      value={editFormData.branch || ""}
                      onChange={handleInputChange}
                      margin="normal"
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={!editFormData.isDelete}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          isDelete: !e.target.checked,
                        })
                      }
                      name="isActive"
                    />
                  }
                  label="Active Event"
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveEvent}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewEvent;
