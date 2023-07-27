import { MainContainer } from "../../../components/mainContainer/MainContainer";
import { systemFormInputs } from "../../../interfaces/form/FormInterfaces";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./editSystem.css";

// Services
import {
  getSystemByID,
} from "../../../services/ApiService";
import SystemForm from "../systemForm";

export const EditSystem = () => {
  const [formData, setFormData] = useState<systemFormInputs>();
  const { id } = useParams();

  useEffect(() => {
    // Carga los datos del JSON
    async function fetchData() {
      const response = await getSystemByID(Number(id));
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
  }, []);

  return (
    <MainContainer cardTitle="Editar sistema">
      <SystemForm data={formData} isUpdateForm={ true }/>
    </MainContainer>
  );
};
