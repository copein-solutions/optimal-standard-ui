import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button, Dialog } from "@mui/material";
import ApplicationAreaRow from "./applicationAreaRow/ApplicationAreaRow";
import "./ApplicationAreaTable.css";
import { ApplicationAreaForm } from "../applicationAreaForm/ApplicationAreaForm";
import { get } from "../../services/ApiService";
import { MainContainer } from "../mainContainer/MainContainer";

export const ApplicationAreaTable = () => {
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [applicationAreas, setApplicationAreas] = useState([]);

  useEffect(() => {
    // Carga los datos del JSON
    get("/application_areas").then((response) => {
      setApplicationAreas(response.data);
    });
  }, []);

  const newApplicationArea = () => {
    setOpen(true);
    setModalType("applicationArea");
  };

  const handleClose = () => {
		setOpen(false);
	};

  return (
    <MainContainer
      cardTitle="Listado de Campo de Aplicación"
    >
      <div>
        <Button variant="contained" color="success" onClick={newApplicationArea}>
          Nuevo Campo de Aplicación
        </Button>
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Especificaciones</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {applicationAreas.map(
            ({
              name,
              specification
            }) => (
              <ApplicationAreaRow
                applicationAreaName={name}
                applicationAreaSpecification={specification}
              />
            )
          )}
        </tbody>
      </table>
      <Dialog open={open} maxWidth={false}>
        {modalType === "applicationArea" && <ApplicationAreaForm />}
      </Dialog>
    </MainContainer>
  );
};
