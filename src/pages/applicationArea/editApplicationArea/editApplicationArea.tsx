import { MainContainer } from "../../../components/mainContainer/MainContainer";
import ApplicationAreaForm from "../applicationAreaForm/ApplicationAreaForm"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./editApplicationArea.css";
import { ApplicationAreaInputs } from "../../../interfaces/form/FormInterfaces";

// Services
import {
  getApplicationAreaByID,
} from "../../../services/ApiService";

export const EditApplicationArea = () => {
  const [formData, setFormData] = useState<ApplicationAreaInputs>();
  const { id } = useParams();

  useEffect(() => {
    // Carga los datos del JSON
    async function fetchData() {
      const response = await getApplicationAreaByID(Number(id));
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
    <MainContainer cardTitle="Editar campo de aplicación">
      <ApplicationAreaForm data={formData} isUpdateForm={ true }/>
    </MainContainer>
  );
};
