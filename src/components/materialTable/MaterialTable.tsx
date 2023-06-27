import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import "./MaterialTable.css";
import { MaterialForm } from "../materialForm/MaterialForm";
import { getMaterial } from "../../services/ApiService";
import { MainContainer } from "../mainContainer/MainContainer";
import { GridCustom } from "../grid/Grid";

export const MaterialTable = () => {
  const [materials, setMaterials] = useState([]);
  const [isFormOpen, setFormOpen] = useState(false);

  const columns = [
    { name: "Nombre", value: "name" },
    { name: "Precio Unitario", value: "unityPrice" },
    { name: "Marca", value: "brand" },
    { name: "Tipo", value: "type" },
    { name: "Fecha", value: "priceDate" },
  ];

  useEffect(() => {
    // Carga los datos del JSON
    async function fetchData() {
      const response = await getMaterial();
      const updateMaterials = response.data;
      updateMaterials.map(
        (mat: {
          unityPrice: string;
          presentationPrice: number;
          presentationQuantity: number;
          presentationUnit: string;
        }) => {
          mat.unityPrice =
            "$/" +
            mat.presentationUnit +
            " " +
            mat.presentationPrice / mat.presentationQuantity;
        }
      );

      console.log(updateMaterials);
      setMaterials(updateMaterials);
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
        <MaterialForm onCancel={handleCloseForm} />
      ) : (
        <MainContainer cardTitle="Material">
          <div>
            <Button
              variant="contained"
              color="success"
              onClick={handleOpenForm}
            >
              Agregar material
            </Button>
            <GridCustom columns={columns} rows={materials} hasEdit hasDelete />
          </div>
        </MainContainer>
      )}
    </div>
  );
};
