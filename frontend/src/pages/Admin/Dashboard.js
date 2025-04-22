import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Tooltip,
  Stack,
  IconButton,
} from "@mui/material";
import {
  PeopleAlt,
  Event,
  ShoppingCart,
  AttachMoney,
  Dashboard as DashboardIcon,
  Visibility as VisibilityIcon,
  NavigateNext as NavigateNextIcon,
} from "@mui/icons-material";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      totalEvents: 0,
      totalBookings: 0,
      totalRevenue: 0,
    },
    recentBookings: [],
    upcomingEvents: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/admin/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:3001/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDashboardData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        if (error.response && error.response.status === 403) {
          navigate("/admin/login");
        }
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const getStatusChip = (statusId) => {
    let color = "default";
    let label = "Unknown";

    switch (statusId) {
      case 1:
        color = "info";
        label = "Upcoming";
        break;
      case 2:
        color = "success";
        label = "Active";
        break;
      case 3:
        color = "error";
        label = "Completed";
        break;
      case 4:
        color = "warning";
        label = "Cancelled";
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
        <DashboardIcon sx={{ fontSize: 40, color: "#379777", mr: 2 }} />
        <Typography variant="h4">Dashboard</Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              boxShadow: 2,
              bgcolor: "#e3f2fd",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" color="textSecondary">
                Total Users
              </Typography>
              <PeopleAlt color="primary" />
            </Box>
            <Typography variant="h3" sx={{ mt: 1 }}>
              {dashboardData.stats.totalUsers}
            </Typography>
            <Button
              size="small"
              sx={{ alignSelf: "flex-start", mt: "auto", pt: 1 }}
              endIcon={<NavigateNextIcon />}
              onClick={() => navigate("/admin/users")}
            >
              View Users
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              boxShadow: 2,
              bgcolor: "#e8f5e9",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" color="textSecondary">
                Total Events
              </Typography>
              <Event color="success" />
            </Box>
            <Typography variant="h3" sx={{ mt: 1 }}>
              {dashboardData.stats.totalEvents}
            </Typography>
            <Button
              size="small"
              sx={{ alignSelf: "flex-start", mt: "auto", pt: 1 }}
              endIcon={<NavigateNextIcon />}
              onClick={() => navigate("/admin/events")}
            >
              View Events
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              boxShadow: 2,
              bgcolor: "#fff8e1",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" color="textSecondary">
                Total Bookings
              </Typography>
              <ShoppingCart color="warning" />
            </Box>
            <Typography variant="h3" sx={{ mt: 1 }}>
              {dashboardData.stats.totalBookings}
            </Typography>
            <Button
              size="small"
              sx={{ alignSelf: "flex-start", mt: "auto", pt: 1 }}
              endIcon={<NavigateNextIcon />}
              onClick={() => navigate("/admin/bookings")}
            >
              View Bookings
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              boxShadow: 2,
              bgcolor: "#f3e5f5",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" color="textSecondary">
                Total Revenue
              </Typography>
              <AttachMoney color="secondary" />
            </Box>
            <Typography variant="h3" sx={{ mt: 1 }}>
              {formatCurrency(dashboardData.stats.totalRevenue)}
            </Typography>
            <Button
              size="small"
              sx={{ alignSelf: "flex-start", mt: "auto", pt: 1 }}
              endIcon={<NavigateNextIcon />}
              onClick={() => navigate("/admin/bills")}
            >
              View Bills
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Bookings and Upcoming Events */}
      <Grid container spacing={3}>
        {/* Recent Bookings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 2, height: "100%" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                  alignItems: "center",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <ShoppingCart color="primary" />
                  <Typography variant="h6">Recent Bookings</Typography>
                </Stack>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate("/admin/bookings")}
                  endIcon={<NavigateNextIcon />}
                >
                  View All
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {dashboardData.recentBookings.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell>Event</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboardData.recentBookings.map((booking) => (
                        <TableRow key={booking.id} hover>
                          <TableCell>{booking.id}</TableCell>
                          <TableCell>{booking.userName}</TableCell>
                          <TableCell>
                            <Tooltip title={booking.eventName}>
                              <Typography
                                variant="body2"
                                noWrap
                                sx={{ maxWidth: 120 }}
                              >
                                {booking.eventName}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            {booking.totalPrice !== null &&
                            booking.totalPrice !== undefined
                              ? formatCurrency(booking.totalPrice)
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {getStatusChip(booking.statusId)}
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="View details">
                              <IconButton size="small" color="primary">
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                  sx={{ py: 4 }}
                >
                  No recent bookings found
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 2, height: "100%" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                  alignItems: "center",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Event color="success" />
                  <Typography variant="h6">Upcoming Events</Typography>
                </Stack>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate("/admin/events")}
                  endIcon={<NavigateNextIcon />}
                >
                  View All
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {dashboardData.upcomingEvents.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Event Name</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboardData.upcomingEvents.map((event) => (
                        <TableRow key={event.id} hover>
                          <TableCell>{event.id}</TableCell>
                          <TableCell>
                            <Tooltip title={event.name}>
                              <Typography
                                variant="body2"
                                noWrap
                                sx={{ maxWidth: 120 }}
                              >
                                {event.name}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            {formatDateTime(event.startTime)}
                          </TableCell>
                          <TableCell>{formatCurrency(event.price)}</TableCell>
                          <TableCell>{getStatusChip(event.statusId)}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="View details">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() =>
                                  navigate(`/admin/events/${event.id}/view`)
                                }
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                  sx={{ py: 4 }}
                >
                  No upcoming events found
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
