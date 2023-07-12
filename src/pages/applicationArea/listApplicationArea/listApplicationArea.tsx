import { useEffect } from "react";
import { Button } from "@mui/material";
import "./listApplicationArea.css";
import { getApplicationArea } from "../../../services/ApiService";
import { MainContainer } from "../../../components/mainContainer/MainContainer";
import { GridCustom } from "../../../components/grid/Grid";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/reducers/reducer";
import { useNavigate } from "react-router-dom";

export const ListApplicationArea = () => {
  const applicationAreas = useSelector(
    (state: RootState) => state.applicationAreas
  );

  const dispatch = useDispatch();
  const navigator = useNavigate();

  const header = [
    { name: "Nombre", value: "name" },
    { name: "Consideración", value: "considerations" },
  ];

  useEffect(() => {
    async function fetchData() {
      const response = await getApplicationArea();
      dispatch({ type: "SET_APPLICATION_AREA", payload: response.data });
    }
    fetchData();
  }, [dispatch]);

  const handleOpenForm = () => {
    navigator("/application_area");
  };

  return (
    <MainContainer cardTitle="Campo de aplicación">
      <div>
        <Button variant="text" color="success" onClick={handleOpenForm}>
          Agregar campo de aplicación
        </Button>
        <GridCustom
          header={header}
          body={applicationAreas}
          hasEdit
          hasDelete
          editNav="application_area"
        />
      </div>
    </MainContainer>
  );
};
