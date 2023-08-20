import React from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Link } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  ADMIN_ROL,
  APPLICATION_AREA_CREATE,
  APPLICATION_AREA_LIST,
  MATERIAL_CREATE,
  MATERIAL_LIST,
  SYSTEM_CREATE,
  SYSTEM_LIST,
} from "../../utils/constants";

type MenuProps = {
  isOpen: boolean;
  setOpen: CallableFunction;
};

export const CustomMenu: React.FC<MenuProps> = ({ isOpen, setOpen }) => {
  let menuOptions = [
    {
      name: "Sistemas",
      icon: <ArrowRightIcon />,
      path: SYSTEM_LIST,
    },
  ];

  const userRole = localStorage.getItem("userRole");
  if (userRole === ADMIN_ROL) {
    menuOptions.push(
      {
        name: "Agregar sistema",
        icon: <ArrowRightIcon />,
        path: SYSTEM_CREATE,
      },
      {
        name: "Materiales",
        icon: <ArrowRightIcon />,
        path: MATERIAL_LIST,
      },
      {
        name: "Agregar material",
        icon: <ArrowRightIcon />,
        path: MATERIAL_CREATE,
      },
      {
        name: "Campos de aplicación",
        icon: <ArrowRightIcon />,
        path: APPLICATION_AREA_LIST,
      },
      {
        name: "Agregar campo de aplicación",
        icon: <ArrowRightIcon />,
        path: APPLICATION_AREA_CREATE,
      }
    );
  }

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setOpen(open);
    };

  const getList = () => (
    <Box
      sx={{ width: 250, paddingTop: "60px" }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuOptions.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton href={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <Link
                to={item.path}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemText primary={item.name} />
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <React.Fragment>
      <Drawer anchor={"left"} open={isOpen} onClose={toggleDrawer(false)}>
        {getList()}
      </Drawer>
    </React.Fragment>
  );
};
