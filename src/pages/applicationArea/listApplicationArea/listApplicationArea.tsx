import { useEffect } from "react";
import { Button } from "@mui/material";
import { getApplicationArea } from "../../../services/ApiService";
import { MainContainer } from "../../../components/mainContainer/MainContainer";
import { GridCustom } from "../../../components/grid/Grid";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/reducers/reducer";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROL, APPLICATION_AREA_CREATE } from "../../../utils/constants";
import "./listApplicationArea.css";

const ListApplicationArea = () => {
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
      if (response && response.data !== "") {
        dispatch({ type: "SET_APPLICATION_AREA", payload: response.data });
      }
    }
    fetchData();
  }, [dispatch]);

  const handleOpenForm = () => {
    navigator(APPLICATION_AREA_CREATE);
  };

  const userRole = localStorage.getItem("userRole");
  return (
    <MainContainer cardTitle="Campo de aplicación">
      <div>
        {userRole === ADMIN_ROL && (
          <div className="add-application-area-button">
            <Button variant="text" color="success" onClick={handleOpenForm}>
              Agregar campo de aplicación
            </Button>
          </div>
        )}
        <GridCustom
          header={header}
          body={applicationAreas}
          hasEdit={userRole === ADMIN_ROL}
          hasDelete={userRole === ADMIN_ROL}
          navigateTo="application_area"
        />
      </div>
    </MainContainer>
  );
};

export default ListApplicationArea;
