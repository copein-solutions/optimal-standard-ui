import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import "./MaterialTable.css";
import { AddMaterial } from "../../pages/addMaterial/addMaterial";
import { getMaterials } from "../../services/ApiService";
import { MainContainer } from "../mainContainer/MainContainer";
import { GridCustom } from "../grid/Grid";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/reducers/reducer";

export const MaterialTable = () => {
  const [isFormOpen, setFormOpen] = useState(false);
  const materials = useSelector((state: RootState) => state.materials);
  const dispatch = useDispatch();

  const header = [
    { name: "Nombre", value: "name" },
    { name: "Precio Unitario", value: "unitPrice" },
    { name: "Marca", value: "brand" },
    { name: "Tipo", value: "type" },
    { name: "Fecha", value: "priceDate" },
  ];

  const truncarDecimales = (numero: number, cantidadDecimales: number) => {
    const multiplicador = Math.pow(10, cantidadDecimales);
    const numeroTruncado = Math.floor(numero * multiplicador) / multiplicador;
    return numeroTruncado;
  };

  useEffect(() => {
    // Carga los datos del JSON
    async function fetchData() {
      const response = await getMaterials();
      const updateMaterials = response.data;
      if (updateMaterials) {
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
              String(
                truncarDecimales(
                  mat.presentationPrice / mat.presentationQuantity,
                  2
                )
              );
          }
        );
      }

      console.log(updateMaterials);
      dispatch({ type: "SET_MATERIALS", payload: updateMaterials });
    }
    fetchData();
  }, [dispatch]);

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
        <AddMaterial onClose={handleCloseForm} />
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
