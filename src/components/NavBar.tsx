import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import SvgIcon from "@mui/material/SvgIcon";

const NavBar = ({ toggleTheme }: { toggleTheme: () => void }) => {
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
          <Avatar alt="User" src="" />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
