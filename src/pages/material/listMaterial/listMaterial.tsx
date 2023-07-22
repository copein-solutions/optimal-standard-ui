import { useEffect } from "react";
import { Button } from "@mui/material";
import "./listMaterial.css";
import { getMaterials } from "../../../services/ApiService";
import { MainContainer } from "../../../components/mainContainer/MainContainer";
import { GridCustom } from "../../../components/grid/Grid";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/reducers/reducer";
import { useNavigate } from "react-router-dom";
import { MATERIAL_CREATE } from "../../../utils/constants";
import { format, parseISO } from "date-fns";
import { getUnitPrice } from "../../../utils/mathUtils";

const ListMaterial = () => {
  const materials = useSelector((state: RootState) => state.materials);
  const dispatch = useDispatch();

  const navigator = useNavigate();

  const header = [
    { name: "Producto", value: "product" },
    { name: "Precio Unitario", value: "unitPrice" },
    { name: "Marca", value: "brand" },
    { name: "Tipo", value: "type" },
    { name: "Composición", value: "component" },
    { name: "Fecha", value: "priceDate" },
  ];

  useEffect(() => {
    // Carga los datos del JSON
    async function fetchData() {
      const response = await getMaterials();
      let listMaterials: any = [];
      if (response && response.data !== "" && response.data.length > 0) {
        listMaterials = response.data;
        listMaterials.map(
          (material: {
            unitPrice: string;
            presentationPrice: number;
            presentationQuantity: number;
            presentationUnit: string;
            priceDate: string;
          }) => {
            // Genero dinamicamente el precio unitario para cada row.
            material.unitPrice = getUnitPrice(
              material.presentationPrice,
              material.presentationQuantity,
              material.presentationUnit,
              true,
            );

            // Convierte la fecha a nuestra horaria.
            const parsedDate = parseISO(material.priceDate);
            // Formateo la fecha para que quede mejor visualmente.
            material.priceDate = format(new Date(parsedDate), "dd/MM/yyyy");
          }
        );
      }

      dispatch({ type: "SET_MATERIALS", payload: listMaterials });
    }
    fetchData();
  }, [dispatch]);

  const handleOpenForm = () => {
    navigator(MATERIAL_CREATE);
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

export default ListMaterial;
