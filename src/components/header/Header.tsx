import * as React from "react";
import { Button, IconButton, Typography, Toolbar, Box, AppBar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router"
import { LOGIN } from "../../utils/constants";

type HeaderProps = {
    onMenuOpen: () => void;
}

export const CustomHeader: React.FC<HeaderProps> = ({ onMenuOpen }) => {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  
  const logout = () => {
    localStorage.clear();
    dispatch({ type: "LOGIN" });
    navigator(LOGIN);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: "#00b500" }}>
        <Toolbar>
          <IconButton
            onClick={onMenuOpen} 
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            CEAOSA
          </Typography>
          <Button onClick={logout} color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
