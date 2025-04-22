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
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  ConfirmationNumber as TicketIcon,
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  Event as EventIcon,
  AttachMoney as MoneyIcon,
} from "@mui/icons-material";
import { getAllTickets } from "../../services/adminService";
import { toast } from "react-toastify";

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch tickets on component mount
  useEffect(() => {
    fetchTickets();
  }, []);

  // Apply filter when search term changes
  useEffect(() => {
    filterTickets();
  }, [tickets, searchTerm]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await getAllTickets();
      setTickets(data);
      setFilteredTickets(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error(error.message || "Failed to load tickets data");
      setLoading(false);
    }
  };

  const filterTickets = () => {
    if (!searchTerm.trim()) {
      setFilteredTickets(tickets);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = tickets.filter(
      (ticket) =>
        ticket.id.toString().includes(searchLower) ||
        ticket.eventName.toLowerCase().includes(searchLower) ||
        ticket.ticketTypeName.toLowerCase().includes(searchLower)
    );

    setFilteredTickets(filtered);
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

  // Calculate stats
  const totalTickets = filteredTickets.length;
  const activeTickets = filteredTickets.filter(
    (ticket) => !ticket.isDelete
  ).length;
  const totalSales = filteredTickets.reduce(
    (sum, ticket) => sum + parseFloat(ticket.price || 0),
    0
  );
  const uniqueEvents = new Set(
    filteredTickets.map((ticket) => ticket.eventName)
  ).size;

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <TicketIcon sx={{ fontSize: 40, color: "#379777", mr: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Ticket Management
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: "#e3f2fd", height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <TicketIcon sx={{ color: "#1976d2", mr: 1 }} />
                    <Typography variant="h6">Total Tickets</Typography>
                  </Box>
                  <Typography variant="h4">{totalTickets}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: "#e8f5e9", height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <FilterIcon sx={{ color: "#43a047", mr: 1 }} />
                    <Typography variant="h6">Active Tickets</Typography>
                  </Box>
                  <Typography variant="h4">{activeTickets}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: "#fff3e0", height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <MoneyIcon sx={{ color: "#ef6c00", mr: 1 }} />
                    <Typography variant="h6">Total Value</Typography>
                  </Box>
                  <Typography variant="h4">
                    {formatCurrency(totalSales)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: "#f3e5f5", height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <EventIcon sx={{ color: "#8e24aa", mr: 1 }} />
                    <Typography variant="h6">Events</Typography>
                  </Box>
                  <Typography variant="h4">{uniqueEvents}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Search */}
          <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search by ID, Event or Ticket Type"
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
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper
            sx={{ width: "100%", mb: 2, borderRadius: 2, overflow: "hidden" }}
          >
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="tickets table">
                <TableHead sx={{ backgroundColor: "#e0f2f1" }}>
                  <TableRow>
                    <TableCell width="10%">
                      <strong>ID</strong>
                    </TableCell>
                    <TableCell width="25%">
                      <strong>Event</strong>
                    </TableCell>
                    <TableCell width="25%">
                      <strong>Ticket Type</strong>
                    </TableCell>
                    <TableCell width="15%">
                      <strong>Price</strong>
                    </TableCell>
                    <TableCell width="15%">
                      <strong>Status</strong>
                    </TableCell>
                    <TableCell width="10%">
                      <strong>Created</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTickets
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((ticket) => (
                      <TableRow
                        key={ticket.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          "&:hover": { backgroundColor: "#f5f5f5" },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {ticket.id}
                        </TableCell>
                        <TableCell>
                          <Tooltip title={ticket.eventName}>
                            <Typography noWrap sx={{ maxWidth: 200 }}>
                              {ticket.eventName}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>{ticket.ticketTypeName}</TableCell>
                        <TableCell>{formatCurrency(ticket.price)}</TableCell>
                        <TableCell>
                          <Chip
                            label={ticket.isDelete ? "Deleted" : "Active"}
                            color={ticket.isDelete ? "error" : "success"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title={formatDate(ticket.createdTime)}>
                            <span>
                              {new Date(
                                ticket.createdTime
                              ).toLocaleDateString()}
                            </span>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  {filteredTickets.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No tickets found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredTickets.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </>
      )}
    </Box>
  );
};

export default AdminTickets;
