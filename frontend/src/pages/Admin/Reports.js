import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  TextField,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  getBookingsByCity,
  getBookingsByCategory,
} from "../../services/adminService";

const Reports = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    format(
      new Date(new Date().setMonth(new Date().getMonth() - 1)),
      "yyyy-MM-dd"
    )
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [salesData, setSalesData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const navigate = useNavigate();

  // For pie chart colors
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A569BD",
    "#5DADE2",
    "#58D68D",
    "#F4D03F",
  ];

  useEffect(() => {
    if (activeTab === 0) {
      fetchSalesReport();
    } else if (activeTab === 1) {
      fetchEventsReport();
    } else if (activeTab === 2) {
      fetchCityReport();
    } else if (activeTab === 3) {
      fetchCategoryReport();
    }
  }, [activeTab]);

  const fetchSalesReport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await axios.get(
        `http://localhost:3001/api/admin/reports/sales?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSalesData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sales report:", error);
      if (error.response && error.response.status === 403) {
        navigate("/admin/login");
      }
      setLoading(false);
    }
  };

  const fetchEventsReport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:3001/api/admin/reports/events",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEventsData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events report:", error);
      if (error.response && error.response.status === 403) {
        navigate("/admin/login");
      }
      setLoading(false);
    }
  };

  const fetchCityReport = async () => {
    setLoading(true);
    try {
      const data = await getBookingsByCity();
      setCityData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching city report:", error);
      if (error.response && error.response.status === 403) {
        navigate("/admin/login");
      }
      setLoading(false);
    }
  };

  const fetchCategoryReport = async () => {
    setLoading(true);
    try {
      const data = await getBookingsByCategory();
      setCategoryData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching category report:", error);
      if (error.response && error.response.status === 403) {
        navigate("/admin/login");
      }
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    if (name === "startDate") {
      setStartDate(value);
    } else if (name === "endDate") {
      setEndDate(value);
    }
  };

  const handleGenerateReport = () => {
    if (activeTab === 0) {
      fetchSalesReport();
    } else if (activeTab === 1) {
      fetchEventsReport();
    } else if (activeTab === 2) {
      fetchCityReport();
    } else if (activeTab === 3) {
      fetchCategoryReport();
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    try {
      return format(new Date(dateStr), "dd/MM/yyyy");
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateStr;
    }
  };

  // Calculate total revenue for sales report
  const calculateTotalRevenue = () => {
    return salesData.reduce((total, item) => total + Number(item.revenue), 0);
  };

  // Calculate total bookings for sales report
  const calculateTotalBookings = () => {
    return salesData.reduce(
      (total, item) => total + Number(item.bookings_count),
      0
    );
  };

  // Format data for bar chart (sales report)
  const getSalesChartData = () => {
    return salesData.map((item) => ({
      date: formatDate(item.date),
      Revenue: Number(item.revenue),
      Bookings: Number(item.bookings_count),
    }));
  };

  // Format data for pie chart (events report)
  const getEventsPieChartData = () => {
    return eventsData
      .filter((event) => event.bookings_count > 0)
      .slice(0, 8) // Limit to 8 events for clarity
      .map((event) => ({
        name: event.name,
        value: Number(event.bookings_count),
      }));
  };

  // Format data for city bar chart
  const getCityChartData = () => {
    return cityData.map((item) => ({
      city: item.city || "Unknown",
      Bookings: Number(item.booking_count),
    }));
  };

  // Format data for category pie chart
  const getCategoryPieChartData = () => {
    return categoryData.map((item) => ({
      name: item.category || "Unknown",
      value: Number(item.booking_count),
    }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reports & Analytics
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Sales Report" />
          <Tab label="Events Performance" />
          <Tab label="City Distribution" />
          <Tab label="Category Analysis" />
        </Tabs>
      </Paper>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              label="Start Date"
              type="date"
              name="startDate"
              value={startDate}
              onChange={handleDateChange}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="End Date"
              type="date"
              name="endDate"
              value={endDate}
              onChange={handleDateChange}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateReport}
              fullWidth
            >
              Generate Report
            </Button>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="400px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {/* Sales Report Tab */}
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Sales Overview" />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="h6">Total Revenue</Typography>
                        <Typography variant="h4">
                          {formatCurrency(calculateTotalRevenue())}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6">Total Bookings</Typography>
                        <Typography variant="h4">
                          {calculateTotalBookings()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardHeader title="Sales Trend" />
                  <Divider />
                  <CardContent>
                    <Box height={400}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={getSalesChartData()}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 30,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" angle={-45} textAnchor="end" />
                          <YAxis
                            yAxisId="left"
                            orientation="left"
                            stroke="#8884d8"
                          />
                          <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#82ca9d"
                          />
                          <Tooltip />
                          <Legend />
                          <Bar
                            yAxisId="left"
                            dataKey="Revenue"
                            fill="#8884d8"
                            name="Revenue (VND)"
                          />
                          <Bar
                            yAxisId="right"
                            dataKey="Bookings"
                            fill="#82ca9d"
                            name="Bookings"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardHeader title="Sales Details" />
                  <Divider />
                  <CardContent>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell align="right">Bookings</TableCell>
                            <TableCell align="right">Revenue</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {salesData.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{formatDate(row.date)}</TableCell>
                              <TableCell align="right">
                                {row.bookings_count}
                              </TableCell>
                              <TableCell align="right">
                                {formatCurrency(row.revenue)}
                              </TableCell>
                            </TableRow>
                          ))}
                          {salesData.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={3} align="center">
                                No data available
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Events Report Tab */}
          {activeTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Top Events by Bookings" />
                  <Divider />
                  <CardContent>
                    <Box height={400}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getEventsPieChartData()}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) =>
                              `${name}: ${percent * 100}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {getEventsPieChartData().map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name, props) => [
                              value,
                              "Bookings",
                            ]}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Top Events by Revenue" />
                  <Divider />
                  <CardContent>
                    <Box height={400}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={eventsData
                            .filter((event) => event.revenue > 0)
                            .slice(0, 5)}
                          layout="vertical"
                          margin={{
                            top: 20,
                            right: 30,
                            left: 100,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis
                            dataKey="name"
                            type="category"
                            width={80}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="revenue"
                            fill="#8884d8"
                            name="Revenue (VND)"
                            label={{ position: "right", fontSize: 12 }}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardHeader title="Events Performance" />
                  <Divider />
                  <CardContent>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Event Name</TableCell>
                            <TableCell align="right">Bookings</TableCell>
                            <TableCell align="right">Revenue</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {eventsData.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell>{row.name}</TableCell>
                              <TableCell align="right">
                                {row.bookings_count}
                              </TableCell>
                              <TableCell align="right">
                                {formatCurrency(row.revenue)}
                              </TableCell>
                            </TableRow>
                          ))}
                          {eventsData.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={3} align="center">
                                No data available
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* City Distribution Tab */}
          {activeTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardHeader title="Bookings by City" />
                  <Divider />
                  <CardContent>
                    <Box height={500}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={getCityChartData()}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 50,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="city"
                            angle={-45}
                            textAnchor="end"
                            height={70}
                          />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="Bookings" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardHeader title="City Distribution Details" />
                  <Divider />
                  <CardContent>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>City</TableCell>
                            <TableCell align="right">Bookings</TableCell>
                            <TableCell align="right">Percentage</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {cityData.map((row, index) => {
                            const totalBookings = cityData.reduce(
                              (total, item) =>
                                total + Number(item.booking_count),
                              0
                            );
                            const percentage =
                              (row.booking_count / totalBookings) * 100;

                            return (
                              <TableRow key={index}>
                                <TableCell>{row.city || "Unknown"}</TableCell>
                                <TableCell align="right">
                                  {row.booking_count}
                                </TableCell>
                                <TableCell align="right">
                                  {percentage}%
                                </TableCell>
                              </TableRow>
                            );
                          })}
                          {cityData.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={3} align="center">
                                No data available
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Category Analysis Tab */}
          {activeTab === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Bookings by Category" />
                  <Divider />
                  <CardContent>
                    <Box height={400}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getCategoryPieChartData()}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) =>
                              `${name}: ${percent * 100}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {getCategoryPieChartData().map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name, props) => [
                              value,
                              "Bookings",
                            ]}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Category Distribution" />
                  <Divider />
                  <CardContent>
                    <Box height={400}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={getCategoryPieChartData()}
                          layout="vertical"
                          margin={{
                            top: 20,
                            right: 30,
                            left: 100,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis
                            dataKey="name"
                            type="category"
                            width={100}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="value"
                            fill="#82ca9d"
                            name="Bookings"
                            label={{ position: "right", fontSize: 12 }}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardHeader title="Category Analysis Details" />
                  <Divider />
                  <CardContent>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Category</TableCell>
                            <TableCell align="right">Bookings</TableCell>
                            <TableCell align="right">Percentage</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {categoryData.map((row, index) => {
                            const totalBookings = categoryData.reduce(
                              (total, item) =>
                                total + Number(item.booking_count),
                              0
                            );
                            const percentage =
                              (row.booking_count / totalBookings) * 100;

                            return (
                              <TableRow key={index}>
                                <TableCell>
                                  {row.category || "Unknown"}
                                </TableCell>
                                <TableCell align="right">
                                  {row.booking_count}
                                </TableCell>
                                <TableCell align="right">
                                  {percentage}%
                                </TableCell>
                              </TableRow>
                            );
                          })}
                          {categoryData.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={3} align="center">
                                No data available
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Reports;
