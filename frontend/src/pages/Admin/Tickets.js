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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { ConfirmationNumber as TicketIcon } from "@mui/icons-material";
import { getAllTickets } from "../../services/adminService";
import { toast } from "react-toastify";

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch tickets on component mount
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await getAllTickets();
      setTickets(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error(error.message || "Failed to load tickets data");
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
        <TicketIcon sx={{ fontSize: 40, color: "#379777", mr: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Ticket Management
        </Typography>
      </Box>

      <Paper sx={{ width: "100%", mb: 2, borderRadius: 2, overflow: "hidden" }}>
        <TableContainer>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table sx={{ minWidth: 650 }} aria-label="tickets table">
              <TableHead sx={{ backgroundColor: "#e0f2f1" }}>
                <TableRow>
                  <TableCell>
                    <strong>ID</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Event</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Ticket Type</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Price</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Created</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {ticket.id}
                      </TableCell>
                      <TableCell>{ticket.eventName}</TableCell>
                      <TableCell>{ticket.ticketTypeName}</TableCell>
                      <TableCell>${ticket.price}</TableCell>
                      <TableCell>
                        <Chip
                          label={ticket.isDelete ? "Deleted" : "Active"}
                          color={ticket.isDelete ? "error" : "success"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(ticket.createdTime)}</TableCell>
                    </TableRow>
                  ))}
                {tickets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No tickets found
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
          count={tickets.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default AdminTickets;
