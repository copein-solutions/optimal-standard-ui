import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import "./MaterialTable.css";
import { AddMaterial } from "../../pages/addMaterial/addMaterial";
import { getMaterials } from "../../services/ApiService";
import { MainContainer } from "../mainContainer/MainContainer";
import { GridCustom } from "../grid/Grid";

export const MaterialTable = () => {
  const [materials, setMaterials] = useState([]);
  const [isFormOpen, setFormOpen] = useState(false);

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
      setMaterials(updateMaterials);
      console.log(materials);
    }
    fetchData();
  }, []);

  const handleOpenForm = () => {
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
  };

  // const onEdit = async () => {
  //   navigator('/login')
  // };

  return (
    <div>
      {isFormOpen ? (
        <AddMaterial onCancel={handleCloseForm} />
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
            <GridCustom header={header} body={materials} hasEdit hasDelete />
          </div>
        </MainContainer>
      )}
    </div>
  );
};
