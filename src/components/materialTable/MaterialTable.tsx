import { useEffect, useState } from "react";
import { Button, Dialog } from "@mui/material";
import "./MaterialTable.css";
import { MaterialForm } from "../materialForm/MaterialForm";
import { get } from "../../services/ApiService";
import { MainContainer } from "../mainContainer/MainContainer";
import { GridCustom } from "../grid/Grid";
import Skeleton from "../skeleton";
import { bottom } from "@popperjs/core";

export const MaterialTable = () => {
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [materials, setMaterials] = useState([]);
  const [fetching, setFetching] = useState(false);

  const columns = [
    { name: "Nombre", value: "name" },
    { name: "Precio Unitario", value: "unityPrice" },
    { name: "Marca", value: "brand" },
    // { name: "Cantidad", value: "presentationQuantity" },
    // { name: "Moneda", value: "currency" },
    // { name: "Precio", value: "presentationPrice" },
    { name: "Tipo", value: "type" },
    // { name: "Unidad", value: "presentationUnit" },
    { name: "Fecha", value: "priceDate" },
  ];

  useEffect(() => {
    setFetching(true);
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
      setFetching(false);
    });
  }, []);

  const newMaterial = () => {
    setOpen(true);
    setModalType("material");
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    // {fetching && <Skeleton />}
    <MainContainer cardTitle="Listado de material">
      <div>
        <Button
          variant="contained"
          color="success"
          onClick={newMaterial}
        >
          Nuevo Material
        </Button>
        
        <GridCustom columns={columns} rows={materials} hasEdit hasDelete />
      </div>

      <Dialog open={open} maxWidth={false}>
        {modalType === "material" && <MaterialForm />}
      </Dialog>
    </MainContainer>
  );
};
