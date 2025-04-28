import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";

const NavBar = ({ toggleTheme }: { toggleTheme: () => void }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const username = localStorage.getItem("username") || "User";
  const room = localStorage.getItem("room") || "Room";
  const profilePicture = localStorage.getItem("profilePictureUrl") || "";

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4" component="div">
          BayMax
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton color="inherit" onClick={toggleTheme}>
            <SettingsIcon />
          </IconButton>
          <IconButton onClick={handleAvatarClick}>
            <Avatar
              alt={username}
              src={profilePicture}
              sx={{ width: 40, height: 40 }}
            />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Box sx={{ padding: "8px 16px", maxWidth: "250px" }}>
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{ fontSize: "0.9rem" }}
              >
                {username}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.8rem" }}
              >
                {room}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
