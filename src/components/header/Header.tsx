import * as React from "react";
import { Button, IconButton, Toolbar, AppBar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import "./Header.css";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { LOGIN } from "../../utils/constants";

import { logout } from "../../services/ApiService";

type HeaderProps = {
  onMenuOpen: () => void;
};

export const CustomHeader: React.FC<HeaderProps> = ({ onMenuOpen }) => {
  const dispatch = useDispatch();
  const navigator = useNavigate();

  const executeLogout = () => {
    logout();    
    dispatch({ type: "LOGOUT" });
    localStorage.clear();
    navigator(LOGIN);
  };

  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#000000",
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
          src="/images/CEAOSA_logo.png"
          alt="Logo CEAOSA"
          className="img-fluid image"
        />
        <Button onClick={executeLogout} color="inherit">
          Cerrar sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
};
