import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Assessment as AssessmentIcon,
  Category as CategoryIcon,
  ConfirmationNumber as TicketIcon,
  Logout as LogoutIcon,
  AccountCircle,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useUserContext } from "../context/UserContext";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerStyled = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const AdminLayout = ({ children }) => {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const { sessionInfo, setSessionInfo } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  useEffect(() => {
    // Check if user is logged in and is admin
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin");

    if (!token || isAdmin !== "true") {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear all auth info
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");

    // Clear context
    setSessionInfo(null);

    // Redirect to login page
    navigate("/admin/login");
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Events", icon: <EventIcon />, path: "/admin/events" },
    { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
    { text: "Roles", icon: <AccountCircle />, path: "/admin/roles" },
    { text: "Categories", icon: <CategoryIcon />, path: "/admin/categories" },
    { text: "Bookings", icon: <ReceiptIcon />, path: "/admin/bookings" },
    { text: "Bills", icon: <ReceiptIcon />, path: "/admin/bills" },
    { text: "Tickets", icon: <TicketIcon />, path: "/admin/tickets" },
    { text: "Ticket Types", icon: <TicketIcon />, path: "/admin/ticket-types" },
    { text: "Reports", icon: <AssessmentIcon />, path: "/admin/reports" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <AppBarStyled position="fixed" open={open} sx={{ bgcolor: "#379777" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            EventHub Admin
          </Typography>
          <div>
            <Tooltip title="Account settings">
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: "#1C4E3F" }}>
                  <AccountCircle />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBarStyled>
      <DrawerStyled variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "#e0f2f1",
                  color: "#379777",
                  "&:hover": {
                    backgroundColor: "#e0f2f1",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "#379777",
                  },
                },
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </DrawerStyled>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          backgroundColor: "#f5f7fa",
        }}
      >
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
