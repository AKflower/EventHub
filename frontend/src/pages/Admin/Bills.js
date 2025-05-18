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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  Receipt as BillIcon,
  AttachMoney as MoneyIcon,
  Payments as PaymentIcon,
  LocalAtm as RevenueIcon,
  CreditCard as CardIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { getAllBills } from "../../services/adminService";
import { toast } from "react-toastify";

const AdminBills = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Fetch bills on component mount
  useEffect(() => {
    fetchBills();
  }, []);

  // Apply filters when filter criteria or bills change
  useEffect(() => {
    applyFilters();
  }, [bills, filterStatus, filterPayment, startDate, endDate]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const data = await getAllBills();
      setBills(data);
      setFilteredBills(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bills:", error);
      toast.error(error.message || "Failed to load bills data");
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bills];

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((bill) => bill.statusId === filterStatus);
    }

    // Filter by payment method
    if (filterPayment !== "all") {
      filtered = filtered.filter(
        (bill) => bill.paymentMethodId === filterPayment
      );
    }

    // Filter by date range
    if (startDate && endDate) {
      const startDateTime = new Date(startDate).getTime();
      const endDateTime = new Date(endDate).getTime();

      filtered = filtered.filter((bill) => {
        const billDate = new Date(bill.createdTime).getTime();
        return billDate >= startDateTime && billDate <= endDateTime;
      });
    }

    setFilteredBills(filtered);
    setPage(0); // Reset to first page when filters change
  };

  const resetFilters = () => {
    setFilterStatus("all");
    setFilterPayment("all");
    setStartDate(null);
    setEndDate(null);
    setFilteredBills(bills);
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

  // Calculate total revenue from filtered bills
  const totalRevenue = filteredBills.reduce(
    (acc, bill) => acc + parseFloat(bill.total || 0),
    0
  );

  // Count payment methods
  const paymentMethodCounts = filteredBills.reduce((acc, bill) => {
    const method = bill.paymentMethod || "Unknown";
    acc[method] = (acc[method] || 0) + 1;
    return acc;
  }, {});

  // Get most popular payment method
  const mostPopularPayment =
    Object.keys(paymentMethodCounts).length > 0
      ? Object.keys(paymentMethodCounts).reduce((a, b) =>
          paymentMethodCounts[a] > paymentMethodCounts[b] ? a : b
        )
      : "None";

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <BillIcon sx={{ fontSize: 40, color: "#379777", mr: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Bills Management
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
                    <BillIcon sx={{ color: "#1976d2", mr: 1 }} />
                    <Typography variant="h6">Total Bills</Typography>
                  </Box>
                  <Typography variant="h4">{filteredBills.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ backgroundColor: "#e8f5e9", height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <RevenueIcon sx={{ color: "#43a047", mr: 1 }} />
                    <Typography variant="h6">Total Revenue</Typography>
                  </Box>
                  <Typography variant="h4">${totalRevenue}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ backgroundColor: "#fff3e0", height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <MoneyIcon sx={{ color: "#ef6c00", mr: 1 }} />
                    <Typography variant="h6">Avg. Bill Amount</Typography>
                  </Box>
                  <Typography variant="h4">
                    ${totalRevenue / (filteredBills.length || 1)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ backgroundColor: "#f3e5f5", height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CardIcon sx={{ color: "#8e24aa", mr: 1 }} />
                    <Typography variant="h6">Popular Payment</Typography>
                  </Box>
                  <Typography variant="h5">{mostPopularPayment}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    id="status-filter"
                    value={filterStatus}
                    label="Status"
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="1">Pending</MenuItem>
                    <MenuItem value="2">Paid</MenuItem>
                    <MenuItem value="3">Cancelled</MenuItem>
                    <MenuItem value="4">Refunded</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel id="payment-filter-label">
                    Payment Method
                  </InputLabel>
                  <Select
                    labelId="payment-filter-label"
                    id="payment-filter"
                    value={filterPayment}
                    label="Payment Method"
                    onChange={(e) => setFilterPayment(e.target.value)}
                  >
                    <MenuItem value="all">All Methods</MenuItem>
                    <MenuItem value="1">Credit Card</MenuItem>
                    <MenuItem value="2">PayPal</MenuItem>
                    <MenuItem value="3">Bank Transfer</MenuItem>
                    <MenuItem value="4">Cash</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={resetFilters}
                    sx={{ mr: 1 }}
                  >
                    Reset Filters
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={applyFilters}
                  >
                    Apply Filters
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Paper
            sx={{ width: "100%", mb: 2, borderRadius: 2, overflow: "hidden" }}
          >
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="bills table">
                <TableHead sx={{ backgroundColor: "#e0f2f1" }}>
                  <TableRow>
                    <TableCell>
                      <strong>ID</strong>
                    </TableCell>
                    <TableCell>
                      <strong>User</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Booking ID</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Amount</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Payment Method</strong>
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
                  {filteredBills
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((bill) => (
                      <TableRow
                        key={bill.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {bill.id}
                        </TableCell>
                        <TableCell>{bill.userName}</TableCell>
                        <TableCell>{bill.bookingId}</TableCell>
                        <TableCell>${parseFloat(bill.total)}</TableCell>
                        <TableCell>
                          <Chip
                            icon={<PaymentIcon />}
                            label={bill.paymentMethod}
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={bill.billStatus}
                            color={
                              bill.statusId === "2"
                                ? "success"
                                : bill.statusId === "1"
                                ? "warning"
                                : bill.statusId === "3"
                                ? "error"
                                : "default"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatDate(bill.createdTime)}</TableCell>
                      </TableRow>
                    ))}
                  {filteredBills.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No bills found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredBills.length}
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

export default AdminBills;
