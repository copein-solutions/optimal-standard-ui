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
    { name: "Malla 100%", value: "materialMeshName", width: 350 },
    {
      name: "Precio unitario malla",
      value: "materialMeshUnitPrice",
      width: 150,
    },
    // Malla 50%
    { name: "Malla Parcial", value: "materialPartialMeshName", width: 350 },
    {
      name: "Precio unitario",
      value: "materialPartialMeshUnitPrice",
      width: 150,
    },
    { name: "Coef. por m2", value: "materialPartialMeshCoef", width: 150 },
    // Material complementario 1
    { name: "Complemento del sistema", value: "materialPlugin1Name", width: 350 },
    { name: "Descripción", value: "materialPlugin1Description", width: 150 },
    { name: "Precio unitario", value: "materialPlugin1UnitPrice", width: 150 },
    { name: "Coef. por m2", value: "materialPlugin1Coef", width: 150 },
    // Material complementario 2
    { name: "Complemento del sistema 2", value: "materialPlugin2Name", width: 350 },
    { name: "Descripción", value: "materialPlugin2Description", width: 150 },
    { name: "Precio unitario", value: "materialPlugin2UnitPrice", width: 150 },
    { name: "Coef. por m2", value: "materialPlugin2Coef", width: 150 },
    // Material complementario 3
    { name: "Complemento del sistema 3", value: "materialPlugin3Name", width: 350 },
    { name: "Descripción", value: "materialPlugin3Description", width: 150 },
    { name: "Precio unitario", value: "materialPlugin3UnitPrice", width: 150 },
    { name: "Coef. por m2", value: "materialPlugin3Coef", width: 150 },
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
            materialMeshName: string;
            materialMeshUnitPrice: any;
            materialMeshType: string;
            materialMeshComponent: string;
            materialPartialMeshName: string;
            materialPartialMeshUnitPrice: any;
            materialPartialMeshType: string;
            materialPartialMeshCoef: string;
            materialPlugin1Name: string;
            materialPlugin1UnitPrice: any;
            materialPlugin1Description: string;
            materialPlugin1Coef: string;
            materialPlugin2Name: string;
            materialPlugin2UnitPrice: any;
            materialPlugin2Description: string;
            materialPlugin2Coef: string;
            materialPlugin3Name: string;
            materialPlugin3UnitPrice: any;
            materialPlugin3Description: string;
            materialPlugin3Coef: string;
          }) => {
            system.applicationAreaName = system.applicationArea?.name;
            system.cured = system.cured ? "Si" : "No";
            let components: number = 0;
            system.materials.map(
              (material: { typeOfUse: string; coefficient: any; material: any; materialDescription: any }) => {
                if (material.typeOfUse === "BASE") {
                  // Material base
                  system.materialBaseName = material.material.product;
                  system.materialBaseUnitPrice = `${material.material.unitPrice} ${material.material.currency}/${material.material.presentationUnit}`;
                  system.materialBaseType = material.material.type;
                  system.materialBaseComponent = material.material.component;
                } else if (material.typeOfUse === "TOTAL_MESH") {
                  // Malla
                  system.materialMeshName = material.material.product;
                  system.materialMeshUnitPrice = `${material.material.unitPrice} ${material.material.currency}/${material.material.presentationUnit}`;
                  system.materialMeshType = material.material.type;
                  system.materialMeshComponent = material.material.component;
                } else if (material.typeOfUse === "PARTIAL_MESH") {
                  // Malla 50%
                  system.materialPartialMeshName = material.material.product;
                  system.materialPartialMeshUnitPrice = `${material.material.unitPrice} ${material.material.currency}/${material.material.presentationUnit}`;
                  system.materialPartialMeshType = material.material.type;
                  system.materialPartialMeshCoef = material.coefficient;
                } else if (material.typeOfUse === "PLUGIN_MATERIAL") {
                  if (components === 0) {
                    // Material comp 1
                    system.materialPlugin1Name = material.material.product;
                    system.materialPlugin1UnitPrice = `${material.material.unitPrice} ${material.material.currency}/${material.material.presentationUnit}`;
                    system.materialPlugin1Description = material.materialDescription;
                    system.materialPlugin1Coef =
                      material.coefficient;
                  } else if (components === 1) {
                    // Material comp 2
                    system.materialPlugin2Name = material.material.product;
                    system.materialPlugin2UnitPrice = `${material.material.unitPrice} ${material.material.currency}/${material.material.presentationUnit}`;
                    system.materialPlugin2Description = material.materialDescription;
                    system.materialPlugin2Coef =
                      material.coefficient;
                  } else if (components === 2) {
                    // Material comp 3
                    system.materialPlugin3Name = material.material.product;
                    system.materialPlugin3UnitPrice = `${material.material.unitPrice} ${material.material.currency}/${material.material.presentationUnit}`;
                    system.materialPlugin3Description = material.materialDescription;
                    system.materialPlugin3Coef =
                      material.coefficient;
                  }
                  components++;
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
