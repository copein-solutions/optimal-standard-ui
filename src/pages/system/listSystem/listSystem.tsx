import { useEffect } from "react";
import { Button } from "@mui/material";
import "./listSystem.css";
import { getSystems } from "../../../services/ApiService";
import { MainContainer } from "../../../components/mainContainer/MainContainer";
import { GridCustom } from "../../../components/grid/Grid";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/reducers/reducer";
import { useNavigate } from "react-router-dom";
import { SYSTEM_CREATE } from "../../../utils/constants";

const ListSystem = () => {
  const systems = useSelector(
    (state: RootState) => state.systems
  );

  const dispatch = useDispatch();
  const navigator = useNavigate();

  const header = [
    // TODO: Ver que campos mostrar
    // { name: "Id", value: "id" },
    { name: "Campo de aplicacion", value: "applicationAreaName" },
    { name: "Curado", value: "cured" },
    { name: "Manos", value: "layers" },
    { name: "Consumo total", value: "totalConsumption" },
  ];

  useEffect(() => {
    async function fetchData() {
      const response = await getSystems();
      
      if(response && response.data !== "") {
        let listSystems: any = response.data;
        listSystems.map((system: {cured: any}) => {
          system.cured = system.cured ? 'si' : 'no';
        });
        dispatch({ type: "SET_SYSTEM", payload: response.data });
      }      
    }
    fetchData();
  }, [dispatch]);

  const handleOpenForm = () => {
    navigator(SYSTEM_CREATE);
  };

  return (
    <MainContainer cardTitle="Sistema">
      <div>
        <Button variant="text" color="success" onClick={handleOpenForm}>
          Agregar sistema
        </Button>
        <GridCustom
          header={header}
          body={systems}
          hasEdit
          hasDelete
          navigateTo="system"
        />
      </div>
    </MainContainer>
  );
};

export default ListSystem;