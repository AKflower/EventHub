import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import {
  Box,
  Typography,
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
  TextField,
  InputAdornment,
  Button,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Card,
  CardContent,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  DateRange as DateRangeIcon,
  FilterAlt as FilterIcon,
  EventNote as EventIcon,
  Assignment as BookingIcon,
  RequestQuote as PaymentIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, startDate, endDate]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:3001/api/admin/bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings(response.data);
      setFilteredBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      if (error.response && error.response.status === 403) {
        navigate("/admin/login");
      }
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.id.toString().includes(searchTerm) ||
          booking.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date range filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the entire end date

      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.createdTime);
        return bookingDate >= start && bookingDate <= end;
      });
    }

    setFilteredBookings(filtered);
    setPage(0); // Reset to first page when filtering
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenDetailDialog = (booking) => {
    setSelectedBooking(booking);
    setOpenDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
  };

  const handleDateFilterChange = (event) => {
    const { name, value } = event.target;
    if (name === "startDate") {
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setFilteredBookings(bookings);
  };

  const getStatusChip = (statusId, statusName) => {
    let color = "default";
    let label = statusName || "Unknown";

    switch (statusId) {
      case 1:
        color = "warning";
        break;
      case 2:
        color = "info";
        break;
      case 3:
        color = "success";
        break;
      case 4:
        color = "error";
        break;
      default:
        break;
    }

    return <Chip size="small" color={color} label={label} />;
  };

  const formatDateTime = (dateTimeStr) => {
    try {
      return format(new Date(dateTimeStr), "dd/MM/yyyy HH:mm");
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateTimeStr;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Calculate summary statistics
  const totalBookings = filteredBookings.length;
  const totalRevenue = filteredBookings.reduce(
    (sum, booking) => sum + (booking.totalPrice || 0),
    0
  );
  const pendingBookings = filteredBookings.filter(
    (booking) => booking.statusId === 1
  ).length;
  const completedBookings = filteredBookings.filter(
    (booking) => booking.statusId === 3
  ).length;

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <BookingIcon sx={{ fontSize: 40, color: "#379777", mr: 2 }} />
        <Typography variant="h4">Bookings Management</Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: "#e3f2fd", height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <BookingIcon sx={{ color: "#1976d2", mr: 1 }} />
                <Typography variant="h6">Total Bookings</Typography>
              </Box>
              <Typography variant="h4">{totalBookings}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: "#e8f5e9", height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PaymentIcon sx={{ color: "#43a047", mr: 1 }} />
                <Typography variant="h6">Total Revenue</Typography>
              </Box>
              <Typography variant="h4">
                {formatCurrency(totalRevenue)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: "#fff3e0", height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <EventIcon sx={{ color: "#ef6c00", mr: 1 }} />
                <Typography variant="h6">Pending Bookings</Typography>
              </Box>
              <Typography variant="h4">{pendingBookings}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: "#f3e5f5", height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <FilterIcon sx={{ color: "#8e24aa", mr: 1 }} />
                <Typography variant="h6">Completed</Typography>
              </Box>
              <Typography variant="h4">{completedBookings}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by ID, Event or Customer"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
              aria-label="Search bookings"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="From Date"
              type="date"
              name="startDate"
              value={startDate}
              onChange={handleDateFilterChange}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateRangeIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
              aria-label="Filter start date"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="To Date"
              type="date"
              name="endDate"
              value={endDate}
              onChange={handleDateFilterChange}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateRangeIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
              aria-label="Filter end date"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Stack
              direction="row"
              spacing={1}
              justifyContent={{ xs: "flex-start", md: "flex-end" }}
            >
              <Tooltip title="Reset filters">
                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  startIcon={<RefreshIcon />}
                  size="small"
                >
                  Reset
                </Button>
              </Tooltip>
              <Tooltip title="Apply filters">
                <Button
                  variant="contained"
                  onClick={filterBookings}
                  startIcon={<FilterIcon />}
                  size="small"
                >
                  Filter
                </Button>
              </Tooltip>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Bookings Table */}
      <Paper
        sx={{
          width: "100%",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 2,
        }}
      >
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Event</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((booking) => (
                  <TableRow key={booking.id} hover>
                    <TableCell>{booking.id}</TableCell>
                    <TableCell>{booking.eventName}</TableCell>
                    <TableCell>{booking.userName}</TableCell>
                    <TableCell>{formatDateTime(booking.createdTime)}</TableCell>
                    <TableCell>
                      {booking.totalPrice !== null &&
                      booking.totalPrice !== undefined
                        ? formatCurrency(booking.totalPrice)
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {getStatusChip(booking.statusId, booking.statusName)}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View details">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleOpenDetailDialog(booking)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredBookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No bookings found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredBookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Booking Details Dialog */}
      <Dialog
        open={openDetailDialog}
        onClose={handleCloseDetailDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <BookingIcon sx={{ mr: 1, color: "#379777" }} />
            Booking Details
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Booking ID:</Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedBooking.id}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Status:</Typography>
                  <Typography variant="body1" gutterBottom>
                    {getStatusChip(
                      selectedBooking.statusId,
                      selectedBooking.statusName
                    )}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Event:</Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedBooking.eventName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Customer:</Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedBooking.userName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Booking Date:</Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatDateTime(selectedBooking.createdTime)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Total Amount:</Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedBooking.totalPrice !== null &&
                    selectedBooking.totalPrice !== undefined
                      ? formatCurrency(selectedBooking.totalPrice)
                      : "N/A"}
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Additional Information
                </Typography>
                <DialogContentText>
                  Customer ID: {selectedBooking.userId}
                  <br />
                  Event ID: {selectedBooking.eventId}
                </DialogContentText>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDetailDialog}
            color="primary"
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Bookings;
