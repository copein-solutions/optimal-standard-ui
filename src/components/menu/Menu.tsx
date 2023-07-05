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
import { CustomSkeleton } from "../skeleton/Skeleton";
import { ListMaterial } from "../../pages/listMaterial/listMaterial";
import { AddMaterial } from "../../pages/addMaterial/addMaterial";
import { ListApplicationArea } from "../../pages/listApplicationArea/listApplicationArea";
import { AddApplicationArea } from "../../pages/addApplicationArea/addApplicationArea";

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
    path: "/material",
    component: AddMaterial,
  },
  {
    name: "Agregar campo de aplicación",
    icon: <ArrowRightIcon />,
    path: "/application_area",
    component: AddApplicationArea,
  },
  {
    name: "Listado de materiales",
    icon: <ArrowRightIcon />,
    path: "/materials",
    component: ListMaterial,
  },
  {
    name: "Listado de campo de aplicación",
    icon: <ArrowRightIcon />,
    path: "/application_areas",
    component: ListApplicationArea,
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
