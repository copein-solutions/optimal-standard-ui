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
import {
  columnGroupingModel,
  header,
} from "../listSystemUtils/listSystemUtils";

const ListSystem = () => {
  const systems = useSelector((state: RootState) => state.systems);

  const dispatch = useDispatch();
  const navigator = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const response = await getSystems();
      if (response && response.data !== "") {
        let listSystems: any = response.data;
        listSystems.map(
          (system: {
            id: any;
            applicationArea: any;
            materials: any;
            cured: any;
            totalPrice: any;
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
            materialPotLife: any;
            materialMinApplicableTemp: any;
          }) => {
            system.id = system.id;
            system.applicationAreaName = system.applicationArea?.name;
            system.cured = system.cured ? "Si" : "No";
            system.totalPrice = `${system.totalPrice.toFixed(2)} $/m2`;
            let components: number = 0;
            system.materials.map(
              (material: {
                typeOfUse: string;
                coefficient: any;
                material: any;
                materialDescription: any;
              }) => {
                if (material.typeOfUse === "BASE") {
                  // Material base
                  system.materialBaseName = material.material.product;
                  system.materialBaseUnitPrice = `${material.material.unitPrice.toFixed(
                    2
                  )} ${material.material.currency}/${
                    material.material.presentationUnit
                  }`;
                  system.materialBaseType = material.material.type;
                  system.materialBaseComponent = material.material.component;
                  system.materialPotLife = material.material.motLife;
                  system.materialMinApplicableTemp =
                    material.material.minApplicableTemp;
                } else if (material.typeOfUse === "TOTAL_MESH") {
                  // Malla
                  system.materialMeshName = material.material.product;
                  system.materialMeshUnitPrice = `${material.material.unitPrice.toFixed(
                    2
                  )} ${material.material.currency}/${
                    material.material.presentationUnit
                  }`;
                  system.materialMeshType = material.material.type;
                  system.materialMeshComponent = material.material.component;
                } else if (material.typeOfUse === "PARTIAL_MESH") {
                  // Malla 50%
                  system.materialPartialMeshName = material.material.product;
                  system.materialPartialMeshUnitPrice = `${material.material.unitPrice.toFixed(
                    2
                  )} ${material.material.currency}/${
                    material.material.presentationUnit
                  }`;
                  system.materialPartialMeshType = material.material.type;
                  system.materialPartialMeshCoef = material.coefficient;
                } else if (material.typeOfUse === "PLUGIN_MATERIAL") {
                  if (components === 0) {
                    // Material comp 1
                    system.materialPlugin1Name = material.material.product;
                    system.materialPlugin1UnitPrice = `${material.material.unitPrice.toFixed(
                      2
                    )} ${material.material.currency}/${
                      material.material.presentationUnit
                    }`;
                    system.materialPlugin1Description =
                      material.materialDescription;
                    system.materialPlugin1Coef = material.coefficient;
                  } else if (components === 1) {
                    // Material comp 2
                    system.materialPlugin2Name = material.material.product;
                    system.materialPlugin2UnitPrice = `${material.material.unitPrice.toFixed(
                      2
                    )} ${material.material.currency}/${
                      material.material.presentationUnit
                    }`;
                    system.materialPlugin2Description =
                      material.materialDescription;
                    system.materialPlugin2Coef = material.coefficient;
                  } else if (components === 2) {
                    // Material comp 3
                    system.materialPlugin3Name = material.material.product;
                    system.materialPlugin3UnitPrice = `${material.material.unitPrice.toFixed(
                      2
                    )} ${material.material.currency}/${
                      material.material.presentationUnit
                    }`;
                    system.materialPlugin3Description =
                      material.materialDescription;
                    system.materialPlugin3Coef = material.coefficient;
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

  const colorExplanation = (
    <div className="color-explanation">
      <text>Estándar óptimo</text>
      <div className="optimal-standard"></div>
      <text>Estándar óptimo alternativo</text>
      <div className="alternative-optimal-standard"></div>
    </div>
  );

  return (
    <>
      <MainContainer cardTitle="Sistemas">
        <div>{colorExplanation}</div>
        <div>
          {userRole === ADMIN_ROL && (
            <Button variant="text" color="success" onClick={handleAddSystem}>
              Agregar sistema
            </Button>
          )}
          <GridCustom
            columnGroupingModel={columnGroupingModel}
            header={header}
            body={systems}
            hasEdit={userRole === ADMIN_ROL}
            hasDelete={userRole === ADMIN_ROL}
            hasCategory={userRole === ADMIN_ROL}
            navigateTo="system"
          />
        </div>
      </MainContainer>
    </>
  );
};

export default ListSystem;
