import * as React from "react";
import { Button, IconButton, Typography, Toolbar, Box, AppBar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

type HeaderProps = {
    onMenuOpen: () => void;
}

export const CustomHeader: React.FC<HeaderProps> = ({ onMenuOpen }) => {

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon onClick={onMenuOpen} />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CEAOSA
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
