import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  Drawer,
  Divider,
  Alert,
  Snackbar,
  Tooltip,
  InputAdornment,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
  EventNote as EventIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getAllCategories,
} from "../../services/adminService";
import { toast } from "react-toastify";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [dialogMode, setDialogMode] = useState("create");
  const [categories, setCategories] = useState([]);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [filters, setFilters] = useState({
    searchTerm: "",
    category: "all",
    startDate: "",
    endDate: "",
    status: "all",
  });

  const navigate = useNavigate();

  // Stats for dashboard cards
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    activeEvents: 0,
    completedEvents: 0,
  });

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      applyFilters();
      calculateStats();
    }
  }, [events, filters]);

  const calculateStats = () => {
    const now = new Date();

    const total = events.length;
    const upcoming = events.filter(
      (event) => new Date(event.startTime) > now
    ).length;
    const active = events.filter((event) => event.isActive).length;
    const completed = events.filter(
      (event) => new Date(event.endTime) < now
    ).length;

    setStats({
      totalEvents: total,
      upcomingEvents: upcoming,
      activeEvents: active,
      completedEvents: completed,
    });
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getAllEvents();
      setEvents(data);
      setFilteredEvents(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error(error.message || "Failed to load events");
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Fallback to default categories if fetch fails
      setCategories([
        { id: 1, name: "Music" },
        { id: 2, name: "Sports" },
        { id: 3, name: "Arts" },
        { id: 4, name: "Business" },
        { id: 5, name: "Food" },
        { id: 6, name: "Technology" },
      ]);
    }
  };

  const applyFilters = () => {
    let filtered = [...events];

    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(searchLower) ||
          (event.description &&
            event.description.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(
        (event) =>
          event.categoryId && event.categoryId.toString() === filters.category
      );
    }

    // Date range filter
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);

      filtered = filtered.filter((event) => {
        const eventStart = new Date(event.startTime);
        return eventStart >= startDate && eventStart <= endDate;
      });
    }

    // Status filter
    if (filters.status !== "all") {
      if (filters.status === "active") {
        filtered = filtered.filter((event) => event.isActive);
      } else if (filters.status === "inactive") {
        filtered = filtered.filter((event) => !event.isActive);
      } else if (filters.status === "upcoming") {
        const now = new Date();
        filtered = filtered.filter((event) => new Date(event.startTime) > now);
      } else if (filters.status === "completed") {
        const now = new Date();
        filtered = filtered.filter((event) => new Date(event.endTime) < now);
      }
    }

    setFilteredEvents(filtered);
    setPage(0); // Reset to first page when filters applied
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      category: "all",
      startDate: "",
      endDate: "",
      status: "all",
    });
    setFilteredEvents(events);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleOpenCreateDialog = () => {
    setSelectedEvent({
      name: "",
      description: "",
      startTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      endTime: format(
        new Date(new Date().getTime() + 3600000),
        "yyyy-MM-dd'T'HH:mm"
      ),
      city: "",
      district: "",
      ward: "",
      street: "",
      venueName: "",
      categoryId: "",
      minPrice: 0,
      isFree: false,
      accOwner: "",
      accNumber: "",
      bank: "",
      branch: "",
    });
    setDialogMode("create");
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (event) => {
    // Format dates for datetime-local input
    const formattedEvent = {
      ...event,
      startTime: format(new Date(event.startTime), "yyyy-MM-dd'T'HH:mm"),
      endTime: format(new Date(event.endTime), "yyyy-MM-dd'T'HH:mm"),
    };
    setSelectedEvent(formattedEvent);
    setDialogMode("edit");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCreateEvent = async () => {
    try {
      await createEvent(selectedEvent);
      fetchEvents();
      handleCloseDialog();
      showSnackbar("Event created successfully", "success");
    } catch (error) {
      console.error("Error creating event:", error);
      showSnackbar("Failed to create event", "error");
    }
  };

  const handleUpdateEvent = async () => {
    try {
      await updateEvent(selectedEvent.id, selectedEvent);
      fetchEvents();
      handleCloseDialog();
      showSnackbar("Event updated successfully", "success");
    } catch (error) {
      console.error("Error updating event:", error);
      showSnackbar("Failed to update event", "error");
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const confirmDelete = (event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(eventToDelete.id);
      fetchEvents();
      setDeleteDialogOpen(false);
      showSnackbar("Event deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting event:", error);
      showSnackbar("Failed to delete event", "error");
    }
  };

  const getStatusChip = (event) => {
    const now = new Date();
    const eventStart = new Date(event.startTime);
    const eventEnd = new Date(event.endTime);

    if (!event.isActive) {
      return <Chip label="Inactive" color="default" size="small" />;
    }

    if (eventEnd < now) {
      return <Chip label="Completed" color="secondary" size="small" />;
    }

    if (eventStart <= now && eventEnd >= now) {
      return <Chip label="In Progress" color="success" size="small" />;
    }

    return <Chip label="Upcoming" color="primary" size="small" />;
  };

  const formatDateTime = (dateTimeStr) => {
    try {
      return format(new Date(dateTimeStr), "dd MMM yyyy, HH:mm");
    } catch (error) {
      return dateTimeStr;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Box>
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

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <EventIcon sx={{ fontSize: 40, color: "#379777", mr: 2 }} />
          <Typography variant="h4" component="h1">
            Event Management
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<FilterListIcon />}
            onClick={() => setFilterDrawerOpen(true)}
            sx={{ mr: 1 }}
          >
            Filter
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDialog}
          >
            Add Event
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: "#e3f2fd", height: "100%" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center" }}
              >
                <EventIcon sx={{ mr: 1 }} /> Total Events
              </Typography>
              <Typography variant="h3">{stats.totalEvents}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: "#e8f5e9", height: "100%" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center" }}
              >
                <CalendarIcon sx={{ mr: 1 }} /> Upcoming Events
              </Typography>
              <Typography variant="h3">{stats.upcomingEvents}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: "#fff3e0", height: "100%" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center" }}
              >
                <VisibilityIcon sx={{ mr: 1 }} /> Active Events
              </Typography>
              <Typography variant="h3">{stats.activeEvents}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: "#f3e5f5", height: "100%" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center" }}
              >
                <CheckCircleIcon sx={{ mr: 1 }} /> Completed Events
              </Typography>
              <Typography variant="h3">{stats.completedEvents}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Box */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Events"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                label="Category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                label="Status"
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="upcoming">Upcoming</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Events Table */}
      <Paper sx={{ width: "100%", mb: 2, overflow: "hidden" }}>
        <TableContainer>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table sx={{ minWidth: 650 }} aria-label="events table">
              <TableHead sx={{ backgroundColor: "#e0f2f1" }}>
                <TableRow>
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Category</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Location</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Start Time</strong>
                  </TableCell>
                  <TableCell>
                    <strong>End Time</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Price</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEvents
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <Typography
                          variant="body2"
                          component="div"
                          sx={{ fontWeight: "bold" }}
                        >
                          {event.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<CategoryIcon />}
                          label={
                            categories.find(
                              (c) => c.id === parseInt(event.categoryId)
                            )?.name || "Unknown"
                          }
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip
                          title={`${event.street}, ${event.ward}, ${event.district}, ${event.city}`}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography
                              variant="body2"
                              noWrap
                              sx={{ maxWidth: 150 }}
                            >
                              {event.venueName || event.city}
                            </Typography>
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{formatDateTime(event.startTime)}</TableCell>
                      <TableCell>{formatDateTime(event.endTime)}</TableCell>
                      <TableCell>
                        {event.isFree ? (
                          <Chip label="Free" color="success" size="small" />
                        ) : (
                          <Typography>
                            {event.minPrice
                              ? formatCurrency(event.minPrice)
                              : "N/A"}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{getStatusChip(event)}</TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          <Tooltip title="View Event">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() =>
                                navigate(`/admin/events/${event.id}/view`)
                              }
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Event">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleOpenEditDialog(event)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Event">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => confirmDelete(event)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                {filteredEvents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No events found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredEvents.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Event Form Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {dialogMode === "create" ? "Create New Event" : "Edit Event"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Name"
                name="name"
                value={selectedEvent?.name || ""}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, name: e.target.value })
                }
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={selectedEvent?.description || ""}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    description: e.target.value,
                  })
                }
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
                value={selectedEvent?.startTime || ""}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    startTime: e.target.value,
                  })
                }
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
                value={selectedEvent?.endTime || ""}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    endTime: e.target.value,
                  })
                }
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  name="categoryId"
                  value={selectedEvent?.categoryId || ""}
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      categoryId: e.target.value,
                    })
                  }
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
                value={selectedEvent?.venueName || ""}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    venueName: e.target.value,
                  })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={selectedEvent?.city || ""}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, city: e.target.value })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="District"
                name="district"
                value={selectedEvent?.district || ""}
                onChange={(e) =>
                  setSelectedEvent({
                    ...selectedEvent,
                    district: e.target.value,
                  })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Ward"
                name="ward"
                value={selectedEvent?.ward || ""}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, ward: e.target.value })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Street"
                name="street"
                value={selectedEvent?.street || ""}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, street: e.target.value })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedEvent?.isFree || false}
                    onChange={(e) =>
                      setSelectedEvent({
                        ...selectedEvent,
                        isFree: e.target.checked,
                      })
                    }
                    name="isFree"
                  />
                }
                label="Free Event"
              />
            </Grid>
            {!selectedEvent?.isFree && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Minimum Price"
                  name="minPrice"
                  type="number"
                  value={selectedEvent?.minPrice || ""}
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      minPrice: e.target.value,
                    })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  margin="normal"
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={
              dialogMode === "create" ? handleCreateEvent : handleUpdateEvent
            }
          >
            {dialogMode === "create" ? "Create" : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the event "{eventToDelete?.name}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteEvent}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Filter Drawer */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{
          sx: { width: 320 },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">Filter Events</Typography>
            <IconButton onClick={() => setFilterDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />

          <TextField
            fullWidth
            label="Search Term"
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleFilterChange}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              label="Category"
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              label="Status"
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="upcoming">Upcoming</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Start Date"
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />

          <TextField
            fullWidth
            label="End Date"
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />

          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={resetFilters}
            >
              Reset
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                applyFilters();
                setFilterDrawerOpen(false);
              }}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default AdminEvents;
