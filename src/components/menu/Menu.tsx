import * as React from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

type MenuProps = {
  isOpen: boolean;
  setOpen: CallableFunction;
}

//options that will be rendered on menu
const menuOptions = [
  {
    name: "Opción 1",
    icon: <ArrowRightIcon />,
    navigateTo: "https://peñarol.org"
  },
  {
    name: "Opción 2",
    icon: <ArrowRightIcon />,
    navigateTo: "https://peñarol.org"
  },
  {
    name: "Opción 3",
    icon: <ArrowRightIcon />,
    navigateTo: "https://peñarol.org"
  },
  {
    name: "Opción 4",
    icon: <ArrowRightIcon />,
    navigateTo: "https://peñarol.org"
  }
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
            <ListItemButton href={item.navigateTo}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
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
