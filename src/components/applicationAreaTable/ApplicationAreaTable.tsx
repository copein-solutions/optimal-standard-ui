import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import "./ApplicationAreaTable.css";
import { ApplicationAreaForm } from "../applicationAreaForm/ApplicationAreaForm";
import { getApplicationArea } from "../../services/ApiService";
import { MainContainer } from "../mainContainer/MainContainer";
import { GridCustom } from "../grid/Grid";

export const ApplicationAreaTable = () => {
  const [applicationAreas, setApplicationAreas] = useState([]);
  const [isFormOpen, setFormOpen] = useState(false);

  const columns = [
    { name: "Nombre", value: "name" },
    { name: "Especificación", value: "specification" },
    { name: "Consideración", value: "considerations" },
  ];

  useEffect(() => {
    // Carga los datos del JSON
    async function fetchData() {
      const response = await getApplicationArea();
      console.log(response.data);
      setApplicationAreas(response.data);
    }
    fetchData();
  }, []);

  const handleOpenForm = () => {
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
  };

  return (
    <div>
      {isFormOpen ? (
        <ApplicationAreaForm onCancel={handleCloseForm} />
      ) : (
        <MainContainer cardTitle="Campo de aplicación">
          <div>
            <Button
              variant="contained"
              color="success"
              onClick={handleOpenForm}
            >
              Agregar campo de aplicación
            </Button>
            <GridCustom
              header={columns}
              body={applicationAreas}
              hasEdit
              hasDelete
            />
          </div>
        </MainContainer>
      )}
    </div>
  );
};
