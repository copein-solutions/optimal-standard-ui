import { connect } from 'react-redux';
import { useEffect } from "react";
import { Button } from "@mui/material";
import "./listMaterial.css";
import { getMaterials } from "../../services/ApiService";
import { MainContainer } from "../../components/mainContainer/MainContainer";
import { GridCustom } from "../../components/grid/Grid";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/reducers/reducer";
import { useNavigate } from "react-router-dom";
import EditMaterial from '../editMaterial';

export const ListMaterial = () => {
  const materials = useSelector((state: RootState) => state.materials);
  const dispatch = useDispatch();

  const navigator = useNavigate();

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
            unitPrice: string;
            presentationPrice: number;
            presentationQuantity: number;
            presentationUnit: string;
          }) => {
            mat.unitPrice =
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
    navigator("/material");
  };

  return (
    <MainContainer cardTitle="Listado de material">
      <Button variant="text" color="success" onClick={handleOpenForm}>
        Agregar material
      </Button>
      <GridCustom
        header={header}
        body={materials}
        hasEdit
        hasDelete
        editNav="material"
      />
    </MainContainer>
  );
};

export default connect()(ListMaterial);
