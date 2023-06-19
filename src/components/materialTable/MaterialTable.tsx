import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button, Dialog } from "@mui/material";
import MaterialRow from "./materialRow/MaterialRow";
import "./MaterialTable.css";
import { MaterialForm } from "../materialForm/MaterialForm";
import { get } from "../../services/ApiService";
import { MainContainer } from "../mainContainer/MainContainer";

export const MaterialTable = () => {
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [materiales, setMateriales] = useState([]);

  useEffect(() => {
    // Carga los datos del JSON
    get("/materials").then((response) => {
      setMateriales(response.data);
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
    <MainContainer
      cardTitle="Listado de material"
    >
      <div>
        <Button variant="contained" onClick={newMaterial}>
          Nuevo Material
        </Button>
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Marca</th>
            <th scope="col">Precio</th>
            <th scope="col">Tipo</th>
            <th scope="col">Cantidad</th>
            {/* <th scope="col">Composición</th> */}
            <th scope="col">Unidad</th>
            <th scope="col">Fecha</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {materiales.map(
            ({
              name,
              brand,
              presentationPrice,
              presentationUnit,
              presentationQuantity,
              type,
              component,
              priceDate
            }) => (
              <MaterialRow
                materialName={name}
                materialQuantity={presentationQuantity}
                materialComponent={component}
                materialType={type}
                materialBrand={brand}
                materialPrice={presentationPrice}
                materialUnity={presentationUnit}
                priceDate={priceDate}
              />
            )
          )}
        </tbody>
      </table>
      <Dialog open={open} maxWidth={false}>
        {modalType === "material" && <MaterialForm />}
      </Dialog>
    </MainContainer>
  );
};
