import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  LocalActivity as TicketTypeIcon,
  Event as EventIcon,
  AccessTime as TimeIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { getAllTicketTypes } from "../../services/adminService";
import { toast } from "react-toastify";

const AdminTicketTypes = () => {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [filteredTicketTypes, setFilteredTicketTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch ticket types on component mount
  useEffect(() => {
    fetchTicketTypes();
  }, []);

  // Filter ticket types when search term changes
  useEffect(() => {
    filterTicketTypes();
  }, [ticketTypes, searchTerm]);

  const fetchTicketTypes = async () => {
    try {
      setLoading(true);
      const data = await getAllTicketTypes();
      setTicketTypes(data);
      setFilteredTicketTypes(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching ticket types:", error);
      toast.error(error.message || "Failed to load ticket types data");
      setLoading(false);
    }
  };

  const filterTicketTypes = () => {
    if (!searchTerm.trim()) {
      setFilteredTicketTypes(ticketTypes);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = ticketTypes.filter(
      (type) =>
        type.name.toLowerCase().includes(searchLower) ||
        type.eventName.toLowerCase().includes(searchLower)
    );

    setFilteredTicketTypes(filtered);
    setPage(0); // Reset to first page when filtering
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Format date string to a more readable format
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate statistics
  const totalTypes = filteredTicketTypes.length;
  const averagePrice =
    filteredTicketTypes.reduce(
      (acc, type) => acc + parseFloat(type.price || 0),
      0
    ) / (filteredTicketTypes.length || 1);
  const eventsCovered = new Set(filteredTicketTypes.map((tt) => tt.eventId))
    .size;
  const totalCapacity = filteredTicketTypes.reduce(
    (acc, type) => acc + parseInt(type.total || 0),
    0
  );
  const totalRevenue = filteredTicketTypes.reduce(
    (acc, type) =>
      acc + parseFloat(type.price || 0) * parseInt(type.total || 0),
    0
  );

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <TicketTypeIcon sx={{ fontSize: 40, color: "#379777", mr: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Ticket Types Management
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  backgroundColor: "#e3f2fd",
                  height: "100%",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "translateY(-5px)" },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <TicketTypeIcon sx={{ color: "#1976d2", mr: 1 }} />
                    <Typography variant="h6">Total Types</Typography>
                  </Box>
                  <Typography variant="h4">{totalTypes}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  backgroundColor: "#e8f5e9",
                  height: "100%",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "translateY(-5px)" },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <MoneyIcon sx={{ color: "#43a047", mr: 1 }} />
                    <Typography variant="h6">Avg. Price</Typography>
                  </Box>
                  <Typography variant="h4">
                    {formatCurrency(averagePrice)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  backgroundColor: "#fff3e0",
                  height: "100%",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "translateY(-5px)" },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <EventIcon sx={{ color: "#ef6c00", mr: 1 }} />
                    <Typography variant="h6">Events Covered</Typography>
                  </Box>
                  <Typography variant="h4">{eventsCovered}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  backgroundColor: "#f3e5f5",
                  height: "100%",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "translateY(-5px)" },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <PeopleIcon sx={{ color: "#8e24aa", mr: 1 }} />
                    <Typography variant="h6">Total Capacity</Typography>
                  </Box>
                  <Typography variant="h4">
                    {totalCapacity.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Search Bar */}
          <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search by name or event"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                      <InputAdornment position="end">
                        <IconButton onClick={clearSearch} size="small">
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Typography variant="subtitle1" sx={{ mr: 2 }}>
                    Potential Revenue:{" "}
                    <strong>{formatCurrency(totalRevenue)}</strong>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Paper
            sx={{
              width: "100%",
              mb: 2,
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: 2,
            }}
          >
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="ticket types table">
                <TableHead sx={{ backgroundColor: "#e0f2f1" }}>
                  <TableRow>
                    <TableCell>
                      <strong>ID</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Event</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Price</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Availability</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Min/Max Purchase</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Sale Period</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTicketTypes
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((ticketType) => (
                      <TableRow
                        key={ticketType.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          "&:hover": { backgroundColor: "#f5f5f5" },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {ticketType.id}
                        </TableCell>
                        <TableCell>
                          <Tooltip title={ticketType.eventName}>
                            <Typography noWrap sx={{ maxWidth: 150 }}>
                              {ticketType.eventName}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>{ticketType.name}</TableCell>
                        <TableCell>
                          {formatCurrency(parseFloat(ticketType.price))}
                        </TableCell>
                        <TableCell>
                          <Tooltip
                            title={`${ticketType.available} available out of ${ticketType.total} total`}
                          >
                            <Chip
                              label={`${ticketType.available}/${ticketType.total}`}
                              color={
                                ticketType.available === 0
                                  ? "error"
                                  : ticketType.available <
                                    ticketType.total * 0.2
                                  ? "warning"
                                  : "success"
                              }
                              size="small"
                              sx={{ minWidth: 80 }}
                            />
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          {ticketType.minBuy} - {ticketType.maxBuy}
                        </TableCell>
                        <TableCell sx={{ maxWidth: 250 }}>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 0.5,
                              }}
                            >
                              <TimeIcon
                                fontSize="small"
                                sx={{ mr: 0.5, color: "#379777" }}
                              />
                              From:{" "}
                              {new Date(
                                ticketType.startTime
                              ).toLocaleDateString()}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <TimeIcon
                                fontSize="small"
                                sx={{ mr: 0.5, color: "#d32f2f" }}
                              />
                              To:{" "}
                              {new Date(
                                ticketType.endTime
                              ).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={ticketType.isDelete ? "Inactive" : "Active"}
                            color={ticketType.isDelete ? "error" : "success"}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  {filteredTicketTypes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        No ticket types found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredTicketTypes.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Rows:"
            />
          </Paper>
        </>
      )}
    </Box>
  );
};

export default AdminTicketTypes;
