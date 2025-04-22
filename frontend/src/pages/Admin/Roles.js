import React, { useState, useEffect } from "react";
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
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as RoleIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../../services/adminService";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add"); // "add" or "edit"
  const [selectedRole, setSelectedRole] = useState({ id: null, name: "" });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await getAllRoles();
      setRoles(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to load roles");
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setSelectedRole({ id: null, name: "" });
    setDialogMode("add");
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (role) => {
    setSelectedRole({ ...role });
    setDialogMode("edit");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveRole = async () => {
    if (!selectedRole.name.trim()) {
      toast.error("Role name is required");
      return;
    }

    try {
      if (dialogMode === "add") {
        await createRole({ name: selectedRole.name });
        toast.success("Role created successfully");
      } else {
        await updateRole(selectedRole.id, { name: selectedRole.name });
        toast.success("Role updated successfully");
      }

      handleCloseDialog();
      fetchRoles();
    } catch (error) {
      console.error("Error saving role:", error);
      toast.error(error.message || "Error saving role");
    }
  };

  const handleDeleteRole = async (id) => {
    // Admin role (id=1) cannot be deleted
    if (id === 1) {
      toast.error("Cannot delete the Admin role");
      return;
    }

    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await deleteRole(id);
        toast.success("Role deleted successfully");
        fetchRoles();
      } catch (error) {
        console.error("Error deleting role:", error);
        toast.error(error.message || "Error deleting role");
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <RoleIcon sx={{ fontSize: 40, color: "#379777", mr: 2 }} />
          <Typography variant="h4">Role Management</Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add Role
        </Button>
      </Box>

      <Paper sx={{ width: "100%", mb: 2, borderRadius: 2, overflow: "hidden" }}>
        <TableContainer>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Role Name</TableCell>
                  <TableCell>System Role</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id} hover>
                    <TableCell>{role.id}</TableCell>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>
                      {role.id === 1 ? (
                        <Chip
                          size="small"
                          color="primary"
                          label="System Role"
                        />
                      ) : null}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleOpenEditDialog(role)}
                      >
                        <EditIcon />
                      </IconButton>
                      {role.id !== 1 && ( // Prevent deleting Admin role
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {roles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No roles found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Paper>

      {/* Add/Edit Role Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === "add" ? "Add New Role" : "Edit Role"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Role Name"
            fullWidth
            value={selectedRole.name}
            onChange={(e) =>
              setSelectedRole({ ...selectedRole, name: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSaveRole} variant="contained" color="primary">
            {dialogMode === "add" ? "Add" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Roles;
