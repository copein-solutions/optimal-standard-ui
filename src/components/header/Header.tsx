import * as React from "react";
import {
  Button,
  IconButton,
  Typography,
  Toolbar,
  Box,
  AppBar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import "./Header.css";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { LOGIN } from "../../utils/constants";

type HeaderProps = {
  onMenuOpen: () => void;
};

export const CustomHeader: React.FC<HeaderProps> = ({ onMenuOpen }) => {
  const dispatch = useDispatch();
  const navigator = useNavigate();

  const logout = () => {
    localStorage.clear();
    dispatch({ type: "LOGIN" });
    navigator(LOGIN);
  };

return (
    // <div className="app-bar">
    <AppBar position="static">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#1b3957",
        }}
      >
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
        <img
          src="../images/CEAOSA_logo.png"
          alt="Logo CEAOSA"
          className="img-fluid image"
        />
        <Button onClick={logout} color="inherit">
          Cerrar sesión
        </Button>
      </Toolbar>
    </AppBar>
    // </div>
  );
};
