import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import "./ApplicationAreaTable.css";
import { ApplicationAreaForm } from "../applicationAreaForm/ApplicationAreaForm";
import { getApplicationArea } from "../../services/ApiService";
import { MainContainer } from "../mainContainer/MainContainer";
import { GridCustom } from "../grid/Grid";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/reducers/reducer";

export const ApplicationAreaTable = () => {
  const [isFormOpen, setFormOpen] = useState(false);
  const applicationAreas = useSelector((state: RootState) => state.applicationAreas);
  const dispatch = useDispatch();

  const columns = [
    { name: "Nombre", value: "name" },
    { name: "Consideración", value: "considerations" },
  ];

  useEffect(() => {
    // Carga los datos del JSON
    async function fetchData() {
      const response = await getApplicationArea();

      console.log(response.data);
      dispatch({ type: "SET_APPLICATION_AREA", payload: response.data });
    }
    fetchData();
  }, [dispatch]);

  const handleOpenForm = () => {
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
  };

  return (
    <div>
      {isFormOpen ? (
        <ApplicationAreaForm onClose={handleCloseForm} />
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
              columns={columns}
              rows={applicationAreas}
              hasEdit
              hasDelete
            />
          </div>
        </MainContainer>
      )}
    </div>
  );
};
