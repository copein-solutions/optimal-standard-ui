import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useEffect } from "react";

type MenuProps = {
  isOpen: boolean;
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

export const CustomMenu: React.FC<MenuProps> = ({ isOpen }) => {
  const [open, setOpen] = React.useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

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
      {/* <Button onClick={() => setOpen(true)}>Abrir menú</Button> */}
      <Drawer anchor={"left"} open={open} onClose={toggleDrawer(false)}>
        {getList()}
      </Drawer>
    </React.Fragment>
  );
}
