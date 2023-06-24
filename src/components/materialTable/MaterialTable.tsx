import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import "./MaterialTable.css";
import { MaterialForm } from "../materialForm/MaterialForm";
import { get } from "../../services/ApiService";
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
    get("/materials").then((response) => {
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
    });
  }, []);

  const handleOpenForm = () => {
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
  };

  return (
    // {fetching && <Skeleton />}
    <div>
      {isFormOpen ? (
        <MaterialForm onCancel={handleCloseForm} />
      ) : (
        <MainContainer cardTitle="Listado de material">
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
