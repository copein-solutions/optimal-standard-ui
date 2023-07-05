import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import "./MaterialTable.css";
import { AddMaterial } from "../../pages/addMaterial/addMaterial";
import { getMaterials } from "../../services/ApiService";
import { MainContainer } from "../mainContainer/MainContainer";
import { GridCustom } from "../grid/Grid";
import { Navigate } from "react-router";
import { useNavigate } from "react-router-dom";

export const MaterialTable = () => {
  const [materials, setMaterials] = useState([]);
  const [isFormOpen, setFormOpen] = useState(false);

  const navigator = useNavigate();

  const header = [
    { name: "Nombre", value: "name" },
    { name: "Precio Unitario", value: "unitPrice" },
    { name: "Marca", value: "brand" },
    { name: "Tipo", value: "type" },
    { name: "Fecha", value: "priceDate" },
  ];

  useEffect(() => {
    // Carga los datos del JSON
    async function fetchData() {
      const response = await getMaterials();
      const updateMaterials = response.data;
      updateMaterials.map(
        (mat: {
          unitPrice: string;
          presentationPrice: number;
          presentationQuantity: number;
          presentationUnit: string;
        }) => {
          mat.unitPrice =
            "$/" +
            mat.presentationUnit +
            " " +
            mat.presentationPrice / mat.presentationQuantity;
        }
      );
      setMaterials(updateMaterials);
      console.log(materials);
    }
    fetchData();
  }, []);

  const handleOpenForm = () => {
    navigator("/material");
  };

  return (
    <MainContainer cardTitle="Listado de material">
      <Button variant="text" color="success" onClick={handleOpenForm}>
        Agregar material
      </Button>
      <GridCustom header={header} body={materials} hasEdit hasDelete />
    </MainContainer>
  );
};
