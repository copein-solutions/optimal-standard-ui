import { useEffect } from "react";
import { Button } from "@mui/material";
import "./listSystem.css";
import { getSystems } from "../../../services/ApiService";
import { MainContainer } from "../../../components/mainContainer/MainContainer";
import { GridCustom } from "../../../components/grid2/Grid";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/reducers/reducer";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROL, SYSTEM_CREATE } from "../../../utils/constants";

const ListSystem = () => {
  const systems = useSelector((state: RootState) => state.systems);

  const dispatch = useDispatch();
  const navigator = useNavigate();

  const header = [
    { name: "Campo de aplicación", value: "applicationAreaName", width: 350 },
    { name: "Precio unitario", value: "systemUnitPrice", width: 150 }, // TODO: falta hacer la cuenta total del sistema
    { name: "Consumo total", value: "totalConsumption", width: 100 },
    { name: "Manos", value: "layers", width: 75 },
    { name: "Modo de aplicación", value: "applicationMode", width: 150 },
    { name: "Curado", value: "cured", width: 75 },
    { name: "Condiciones de base", value: "baseConditions", width: 225 },
    { name: "Condiciones de soporte", value: "supportConditions", width: 225 },
    { name: "Por área m2", value: "materialAreaRestrictions", width: 225 },
    {
      name: "Otras restricciones",
      value: "materialAreaDescription",
      width: 225,
    },
    // Material base
    { name: "Material base", value: "materialBaseName", width: 250 },
    {
      name: "Tipo",
      value: "materialBaseType",
      description: "(Acrílicos, siliconados, cementosos, poliuretánicos)",
      width: 250,
    },
    {
      name: "Precio unitario base",
      value: "materialBaseUnitPrice",
      width: 150,
    },
    { name: "Composición", value: "materialBaseComponent", width: 150 },
    // Malla 100%
    { name: "Malla 100%", value: "materialPartialName", width: 150 },
    { name: "Tipo", value: "materialPartialType", width: 150 },
    {
      name: "Precio unitario malla",
      value: "materialPartialUnitPrice",
      width: 150,
    },
    { name: "Composición", value: "materialPartialComponent", width: 150 },
  ];

  useEffect(() => {
    async function fetchData() {
      const response = await getSystems();
      if (response && response.data !== "") {
        let listSystems: any = response.data;
        listSystems.map(
          (system: {
            applicationArea: any;
            materials: any;
            cured: any;
            applicationAreaName: string;
            materialBaseName: string;
            materialBaseType: string;
            materialBaseUnitPrice: any;
            materialBaseComponent: string;
            materialPartialName: string;
            materialPartialType: string;
            materialPartialUnitPrice: any;
            materialPartialComponent: string;
          }) => {
            system.applicationAreaName = system.applicationArea?.name;
            system.cured = system.cured ? "Si" : "No";
            system.materials.map(
              (material: { typeOfUse: string; material: any }) => {
                if (material.typeOfUse === "BASE") {
                  // Material base
                  system.materialBaseName = material.material.product;
                  system.materialBaseUnitPrice = `${material.material.unitPrice} ${material.material.currency}/${material.material.presentationUnit}`;
                  system.materialBaseType = material.material.type;
                  system.materialBaseComponent = material.material.component;
                } else if (material.typeOfUse === "TOTAL_MESH") {
                  // Malla
                  system.materialPartialName = material.material.product;
                  system.materialPartialUnitPrice = `${material.material.unitPrice} ${material.material.currency}/${material.material.presentationUnit}`;
                  system.materialPartialType = material.material.type;
                  system.materialPartialComponent = material.material.component;
                } else if (material.typeOfUse === "PARTIAL_MESH") {
                  // Malla 50%
                } else if (material.typeOfUse === "PLUGIN_MATERIAL") {
                  // Material comp 1
                  // Material comp 2
                  // Material comp 3
                }
              }
            );
          }
        );
        dispatch({ type: "SET_SYSTEM", payload: response.data });
      }
    }
    fetchData();
  }, [dispatch]);

  const handleAddSystem = () => {
    navigator(SYSTEM_CREATE);
  };

  const userRole = localStorage.getItem("userRole");

  return (
    <MainContainer cardTitle="Sistema">
      <div>
        {userRole === ADMIN_ROL && (
          <Button variant="text" color="success" onClick={handleAddSystem}>
            Agregar sistema
          </Button>
        )}
        <GridCustom
          header={header}
          body={systems}
          hasEdit={userRole === ADMIN_ROL}
          hasDelete={userRole === ADMIN_ROL}
          navigateTo="system"
        />
      </div>
    </MainContainer>
  );
};

export default ListSystem;
