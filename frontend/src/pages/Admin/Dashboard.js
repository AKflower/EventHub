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
} from "@mui/material";
import {
  PeopleAlt,
  Event,
  ShoppingCart,
  AttachMoney,
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
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
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
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>

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
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6" color="textSecondary">
                Total Users
              </Typography>
              <PeopleAlt color="primary" />
            </Box>
            <Typography variant="h4" sx={{ my: 1 }}>
              {dashboardData.stats.totalUsers}
            </Typography>
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
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6" color="textSecondary">
                Total Events
              </Typography>
              <Event color="success" />
            </Box>
            <Typography variant="h4" sx={{ my: 1 }}>
              {dashboardData.stats.totalEvents}
            </Typography>
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
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6" color="textSecondary">
                Total Bookings
              </Typography>
              <ShoppingCart color="warning" />
            </Box>
            <Typography variant="h4" sx={{ my: 1 }}>
              {dashboardData.stats.totalBookings}
            </Typography>
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
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6" color="textSecondary">
                Total Revenue
              </Typography>
              <AttachMoney color="secondary" />
            </Box>
            <Typography variant="h4" sx={{ my: 1 }}>
              {formatCurrency(dashboardData.stats.totalRevenue)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Bookings and Upcoming Events */}
      <Grid container spacing={3}>
        {/* Recent Bookings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="h6">Recent Bookings</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate("/admin/bookings")}
                >
                  View All
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {dashboardData.recentBookings.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell>Event</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboardData.recentBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.id}</TableCell>
                          <TableCell>{booking.userName}</TableCell>
                          <TableCell>{booking.eventName}</TableCell>
                          <TableCell>
                            {booking.totalPrice !== null &&
                            booking.totalPrice !== undefined
                              ? formatCurrency(booking.totalPrice)
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {formatDateTime(booking.createdTime)}
                          </TableCell>
                          <TableCell>
                            {getStatusChip(booking.statusId)}
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
                >
                  No recent bookings found
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="h6">Upcoming Events</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate("/admin/events")}
                >
                  View All
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {dashboardData.upcomingEvents.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Event Name</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboardData.upcomingEvents.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell>{event.id}</TableCell>
                          <TableCell>{event.name}</TableCell>
                          <TableCell>
                            {formatDateTime(event.startTime)}
                          </TableCell>
                          <TableCell>{formatCurrency(event.price)}</TableCell>
                          <TableCell>{getStatusChip(event.statusId)}</TableCell>
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
