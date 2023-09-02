import React, { useState } from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
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
import CustomModal from "../modal/customModal";
import BarChartIcon from "@mui/icons-material/BarChart";
import ModalChildren from "./modalVariablesChildren";
import Toast, { ToastType } from "../../components/toast/toast";
import "./Menu.css";

import {
  getLaborCost,
  getQuotationDollar,
  saveDollarRate,
  saveLaborCost,
} from "../../services/ApiService";

type MenuProps = {
  isOpen: boolean;
  setOpen: CallableFunction;
};

export const CustomMenu: React.FC<MenuProps> = ({ isOpen, setOpen }) => {
  const [showToast, setShowToast] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [toastType, setToastType] = useState<ToastType>("success");
  const [toastMsg, setToastMsg] = useState("");

  const handleCloseToast = () => {
    setShowToast(false);
  };

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
    // setToastMsg("");
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

    const response = (await saveDollarRate({ value: dollarRateValue })) as any;
    if (response.status !== 200) {
      setToastMsg("Error al guardar la cotización del dólar");
      setToastType("error");
      setShowToast(true);
    } else {
      setToastMsg("Cotización actualizada con éxito");
      setToastType("success");
      setShowToast(true);
    }
  };

  const handleLaborCostSubmit = async () => {
    console.log(laborCostValue);
    const response = (await saveLaborCost({ value: laborCostValue })) as any;
    if (response.status !== 200) {
      setToastMsg("Error al guardar el costo de mano de obra");
      setToastType("error");
      setShowToast(true);
    } else {
      setToastMsg("Valor de mano de obra actualizada con éxito");
      setToastType("success");
      setShowToast(true);
    }
  };

  const modalChildren = (
    <ModalChildren
      // TODO: ver si ponemos alguna descripción de que pasará cuando se modifiquen estas variables
      // dollarRateTxt={}
      // laborCostTxt={}
      handleDollarRate={handleDollarRate}
      handleLaborCost={handleLaborCost}
      dollarRateValue={dollarRateDataBase}
      laborCostValue={laborCostDataBase}
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
          title="Actualizar variables"
          children={modalChildren}
        />
      )}
      <Toast
        type={toastType}
        message={toastMsg}
        open={showToast}
        onClose={handleCloseToast}
      />
    </React.Fragment>
  );
};
