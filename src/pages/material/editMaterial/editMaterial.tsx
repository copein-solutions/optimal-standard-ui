import { useEffect, useState } from "react";

import { MainContainer } from "../../../components/mainContainer/MainContainer";
import "./editMaterial.css";

import { MaterialInputs } from "../../../interfaces/form/FormInterfaces";
import { getMaterialByID } from "../../../services/ApiService";

import { useParams } from "react-router-dom";
import MaterialForm from "../materialForm";

export const EditMaterial = () => {
  const [formData, setFormData] = useState<MaterialInputs>();
  const { id } = useParams();

  useEffect(() => {
    // Carga los datos del JSON
    async function fetchData() {
      console.log("id", id);

      const response = await getMaterialByID(Number(id));
      if (response?.data.error || response === undefined) {
        alert(
          "Error: " + !response?.data.message
            ? "Network error"
            : response.data.message
        );
      } else {
        setFormData(response.data);
      }
    }
    fetchData();
  }, [id]);

  return (
    <MainContainer cardTitle="Editar material">
      <MaterialForm data={formData} isUpdateForm={ true }/>
    </MainContainer>
  );
};
