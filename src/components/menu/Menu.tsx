import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import ListMaterial from "../../pages/material/listMaterial/listMaterial";
import AddMaterial from "../../pages/material/addMaterial/addMaterial";
import ListApplicationArea from "../../pages/applicationArea/listApplicationArea/listApplicationArea";
import AddApplicationArea from "../../pages/applicationArea/addApplicationArea/addApplicationArea";
import AddSystem from "../../pages/system/addSystem";
import Login from "../../pages/login";

import {APPLICATION_AREA_CREATE, APPLICATION_AREA_LIST, LOGIN, MATERIAL_CREATE, MATERIAL_LIST, SYSTEM_CREATE, SYSTEM_LIST} from "../../utils/constants";

type MenuProps = {
  isOpen: boolean;
  setOpen: CallableFunction;
};

//Opciones que serán renderizadas en el menú
// TODO: cambiar este objeto para un archivo aparte??
export const menuOptions = [
  {
    name: "Agregar material",
    icon: <ArrowRightIcon />,
    path: MATERIAL_CREATE,
    component: AddMaterial,
  },
  {
    name: "Agregar campo de aplicación",
    icon: <ArrowRightIcon />,
    path: APPLICATION_AREA_CREATE,
    component: AddApplicationArea,
  },
  {
    name: "Agregar sistema",
    icon: <ArrowRightIcon />,
    path: SYSTEM_CREATE,
    component: AddSystem,
  },
  {
    name: "Listado de materiales",
    icon: <ArrowRightIcon />,
    path: MATERIAL_LIST,
    component: ListMaterial,
  },
  {
    name: "Listado de campo de aplicación",
    icon: <ArrowRightIcon />,
    path: APPLICATION_AREA_LIST,
    component: ListApplicationArea,
  },
  // {
  //   name: "Listado de sistemas",
  //   icon: <ArrowRightIcon />,
  //   path: SYSTEM_LIST,
  //   component: ListSystem,
  // },
  {
    name: "Login",
    icon: <ArrowRightIcon />,
    path: LOGIN,
    component: Login,
  },
];

export const CustomMenu: React.FC<MenuProps> = ({ isOpen, setOpen }) => {
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
      sx={{ width: 250 }}
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
