import * as React from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import { CustomSkeleton } from "../skeleton/Skeleton";
import { CustomSkeleton2 } from "../skeleton2/Skeleton2";

type MenuProps = {
  isOpen: boolean;
  setOpen: CallableFunction;
}

// TODO: cambiar este objeto para un archivo aparte??
//options that will be rendered on menu
export const menuOptions = [
  {
    name: "Opción 1",
    icon: <ArrowRightIcon />,
    path: "/option1",
    component: CustomSkeleton,
  },
  {
    name: "Opción 2",
    icon: <ArrowRightIcon />,
    path: "/option2",
    component: CustomSkeleton2,
  },
  {
    name: "Opción 3",
    icon: <ArrowRightIcon />,
    path: "https://peñarol.org",
    component: CustomSkeleton, // Esta opción va a llevar a --> https://peñarol.org
  },
  // {
  //   name: "Opción 4",
  //   icon: <ArrowRightIcon />,
  //   path: "https://peñarol.org",
  //   component: ,
  // }
];

export const CustomMenu: React.FC<MenuProps> = ({ isOpen, setOpen }) => {

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
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
              <Link to={item.path} style={{ textDecoration: "none", color: "inherit" }}>
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
}
