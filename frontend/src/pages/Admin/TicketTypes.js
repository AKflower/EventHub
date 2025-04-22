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
} from "@mui/material";
import {
  LocalActivity as TicketTypeIcon,
  Event as EventIcon,
  AccessTime as TimeIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
} from "@mui/icons-material";
import { getAllTicketTypes } from "../../services/adminService";
import { toast } from "react-toastify";

const AdminTicketTypes = () => {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch ticket types on component mount
  useEffect(() => {
    fetchTicketTypes();
  }, []);

  const fetchTicketTypes = async () => {
    try {
      setLoading(true);
      const data = await getAllTicketTypes();
      setTicketTypes(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching ticket types:", error);
      toast.error(error.message || "Failed to load ticket types data");
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
            <Grid item xs={12} md={3}>
              <Card sx={{ backgroundColor: "#e3f2fd", height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <TicketTypeIcon sx={{ color: "#1976d2", mr: 1 }} />
                    <Typography variant="h6">Total Types</Typography>
                  </Box>
                  <Typography variant="h4">{ticketTypes.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ backgroundColor: "#e8f5e9", height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <MoneyIcon sx={{ color: "#43a047", mr: 1 }} />
                    <Typography variant="h6">Avg. Price</Typography>
                  </Box>
                  <Typography variant="h4">
                    $
                    {ticketTypes.reduce(
                      (acc, type) => acc + parseFloat(type.price || 0),
                      0
                    ) / (ticketTypes.length || 1)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ backgroundColor: "#fff3e0", height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <EventIcon sx={{ color: "#ef6c00", mr: 1 }} />
                    <Typography variant="h6">Events Covered</Typography>
                  </Box>
                  <Typography variant="h4">
                    {new Set(ticketTypes.map((tt) => tt.eventId)).size}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ backgroundColor: "#f3e5f5", height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <PeopleIcon sx={{ color: "#8e24aa", mr: 1 }} />
                    <Typography variant="h6">Total Capacity</Typography>
                  </Box>
                  <Typography variant="h4">
                    {ticketTypes
                      .reduce((acc, type) => acc + parseInt(type.total || 0), 0)
                      .toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Paper
            sx={{ width: "100%", mb: 2, borderRadius: 2, overflow: "hidden" }}
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
                      <strong>Total</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Available</strong>
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
                  {ticketTypes
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((ticketType) => (
                      <TableRow
                        key={ticketType.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {ticketType.id}
                        </TableCell>
                        <TableCell>{ticketType.eventName}</TableCell>
                        <TableCell>{ticketType.name}</TableCell>
                        <TableCell>${parseFloat(ticketType.price)}</TableCell>
                        <TableCell>{ticketType.total}</TableCell>
                        <TableCell>
                          <Chip
                            label={`${ticketType.available}/${ticketType.total}`}
                            color={
                              ticketType.available > 0 ? "success" : "error"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {ticketType.minBuy} - {ticketType.maxBuy}
                        </TableCell>
                        <TableCell sx={{ maxWidth: 250 }}>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <TimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                              From: {formatDate(ticketType.startTime)}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ display: "flex", alignItems: "center" }}
                            >
                              <TimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                              To: {formatDate(ticketType.endTime)}
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
                  {ticketTypes.length === 0 && (
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
              count={ticketTypes.length}
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

export default AdminTicketTypes;
