import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
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
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
} from "@mui/icons-material";
import {
  getAllUsers,
  updateUser,
  deleteUser,
  updateUserRole,
  getAllRoles,
} from "../../services/adminService";

const API_URL =
  process.env.REACT_APP_API_URL + "/api" || "http://localhost:3001/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState({
    id: "",
    fullName: "",
    phone: "",
    birth: "",
    gender: "",
    mail: "",
    roleId: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const data = await getAllUsers();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response && error.response.status === 403) {
        navigate("/admin/login");
      }
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await getAllRoles();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({
      ...selectedUser,
      [name]: value,
    });
  };

  const handleOpenEditDialog = (user) => {
    // Format date for date input
    const formattedUser = {
      ...user,
      birth: format(new Date(user.birth), "yyyy-MM-dd"),
    };
    setSelectedUser(formattedUser);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenRoleDialog = (user) => {
    setSelectedUser(user);
    setOpenRoleDialog(true);
  };

  const handleCloseRoleDialog = () => {
    setOpenRoleDialog(false);
  };

  const handleUpdateUser = async () => {
    try {
      await updateUser(selectedUser.id, {
        fullName: selectedUser.fullName,
        phone: selectedUser.phone,
        birth: selectedUser.birth,
        gender: selectedUser.gender,
        mail: selectedUser.mail,
      });

      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleUpdateRole = async () => {
    try {
      if (!selectedUser.roleId) {
        alert("Vui lòng chọn vai trò cho người dùng");
        return;
      }

      await updateUserRole(selectedUser.id, selectedUser.roleId);
      fetchUsers();
      handleCloseRoleDialog();
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const formatDate = (dateStr) => {
    try {
      return format(new Date(dateStr), "dd/MM/yyyy");
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateStr;
    }
  };

  const getRoleChip = (roleId, roleName) => {
    if (!roleId) {
      return (
        <Chip
          size="small"
          color="default"
          icon={<UserIcon />}
          label="Người dùng"
        />
      );
    }

    if (roleId === 1) {
      return (
        <Chip
          size="small"
          color="error"
          icon={<AdminIcon />}
          label={roleName || "Admin"}
        />
      );
    }

    return (
      <Chip
        size="small"
        color="primary"
        icon={<UserIcon />}
        label={roleName || "Người dùng"}
      />
    );
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
        Users Management
      </Typography>

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
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Birth Date</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.mail}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{formatDate(user.birth)}</TableCell>
                    <TableCell>
                      {user.gender === "M" ? "Male" : "Female"}
                    </TableCell>
                    <TableCell>
                      {getRoleChip(user.roleId, user.roleName)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        color={user.isDelete ? "error" : "success"}
                        label={user.isDelete ? "Inactive" : "Active"}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit User">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleOpenEditDialog(user)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Change Role">
                        <IconButton
                          color="secondary"
                          size="small"
                          onClick={() => handleOpenRoleDialog(user)}
                        >
                          <AdminIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete User">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Edit User Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={selectedUser.fullName || ""}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="mail"
                type="email"
                value={selectedUser.mail || ""}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={selectedUser.phone || ""}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Birth Date"
                name="birth"
                type="date"
                value={selectedUser.birth || ""}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={selectedUser.gender || ""}
                  label="Gender"
                  onChange={handleInputChange}
                  required
                >
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateUser}
            variant="contained"
            sx={{
              backgroundColor: "#379777",
              "&:hover": {
                backgroundColor: "#2B7C61",
              },
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog
        open={openRoleDialog}
        onClose={handleCloseRoleDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Change User Role</DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <Typography variant="body1" gutterBottom>
              User: {selectedUser.fullName}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Email: {selectedUser.mail}
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Role</InputLabel>
              <Select
                name="roleId"
                value={selectedUser.roleId || ""}
                label="Role"
                onChange={handleInputChange}
                required
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRoleDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateRole}
            variant="contained"
            sx={{
              backgroundColor: "#379777",
              "&:hover": {
                backgroundColor: "#2B7C61",
              },
            }}
          >
            Update Role
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
