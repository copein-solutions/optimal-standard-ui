import React, { useState } from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  Drawer,
  FormControl,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
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
import CustomModal from "../modal/customModal";
import BarChartIcon from "@mui/icons-material/BarChart";
import ModalChildren from "./modalVariablesChildren";
import "./Menu.css";
import {
  getLaborCost,
  getQuotationDollar,
  saveDollarRate,
} from "../../services/ApiService";

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

  const [openModal, setOpenModal] = useState(false);

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
      className="menu-wrapper"
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuOptions.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton href={item.path}>
              <ListItemIcon className="menu-icon">{item.icon}</ListItemIcon>
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
      {userRole === ADMIN_ROL && (
        <Button
          onClick={openVariablesModal}
          startIcon={<BarChartIcon />}
          color="inherit"
          className="global-variables-button"
        >
          Variables globales
        </Button>
      )}
    </Box>
  );

  // ------------------ MODAL DE VARIABLES ------------------
  const [dollarRateDataBase, setDollarRateDataBase] = useState("");
  const [dollarRateValue, setDollarRateValue] = useState("");
  const [laborCostDataBase, setLaborCostDataBase] = useState("");
  const [laborCostValue, setLaborCostValue] = useState("");

  const openVariablesModal = async () => {
    let dollarRateResponse = await getQuotationDollar();
    let laborCostResponse = await getLaborCost();

    if (dollarRateResponse.data) {
      setDollarRateDataBase(dollarRateResponse.data);
    }
    if (laborCostResponse.data) {
      setLaborCostDataBase(laborCostResponse.data);
    }
    setOpenModal(true);
  };

  const onCloseModal = () => {
    setOpenModal(false);
    setLaborCostValue("");
    setDollarRateValue("");
  };

  const handleDollarRate = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setDollarRateValue(event.target.value);
  };

  const handleLaborCost = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setLaborCostValue(event.target.value);
  };

  const handleDollarRateSubmit = async () => {
    console.log(dollarRateValue);

    const response = (await saveDollarRate(dollarRateValue)) as any;
    if (response.status !== 200) {
      alert("Error!!!!!!!!!!!!!");
    } else {
      alert("éxito pa");
    }
  };

  const handleLaborCostSubmit = () => {
    console.log(laborCostValue);
  };

  const modalChildren = (
    <ModalChildren
      dollarRateTxt={`Cotización actual del dólar: ${dollarRateDataBase}`}
      laborCostTxt={`Valor actual de mano de obra: ${laborCostDataBase}`}
      handleDollarRate={handleDollarRate}
      handleLaborCost={handleLaborCost}
      dollarRateValue={dollarRateValue}
      laborCostValue={laborCostValue}
      handleDollarRateSubmit={handleDollarRateSubmit}
      handleLaborCostSubmit={handleLaborCostSubmit}
    />
  );

  return (
    <React.Fragment>
      <Drawer anchor={"left"} open={isOpen} onClose={toggleDrawer(false)}>
        {getList()}
      </Drawer>
      {openModal && (
        <CustomModal
          open={openModal}
          onClose={onCloseModal}
          title="Definir variables"
          children={modalChildren}
        />
      )}
      ;
    </React.Fragment>
  );
};
