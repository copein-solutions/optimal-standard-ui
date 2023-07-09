import { MainContainer } from "../../components/mainContainer/MainContainer";
import { ApplicationAreaForm } from "../../components/applicationAreaForm/applicationAreaForm";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./addApplicationArea.css";

// Redux
import { useDispatch } from "react-redux";

// Services
import { createApplicationArea } from "../../services/ApiService";

interface FormError {
  field: string;
  message: string;
  showError: boolean;
}

interface BackendError {
  field: string;
  message: string;
  showError: boolean;
}

export const AddApplicationArea = () => {
  const [formErrors, setFormErrors] = useState<FormError[]>([]);
  const [backendErrors, setBackendErrors] = useState<BackendError[]>([]);

  const dispatch = useDispatch();
  const navigator = useNavigate();
  
  const appAreaNameRef = useRef<HTMLInputElement>(null);
  const appAreaConsiderationsRef = useRef<HTMLInputElement>(null);

  const handleCancel = () => {
    navigator("/application_areas");
  };

  const verifyFormErrors = (formErrors: FormError[]) => {
    if (
      appAreaNameRef.current?.value === "" ||
      appAreaNameRef.current?.value == null
    ) {
      formErrors.push({
        field: "appAreaName",
        message: "Nombre requerido",
        showError: true,
      });
    }
  };

  const formatterForm = () => {
    return {
      name: appAreaNameRef.current?.value,
      considerations: appAreaConsiderationsRef.current?.value,
    };
  };

  const handleAccept = async () => {
    const formErrors: FormError[] = [];
    const backendErrors: BackendError[] = [];
    verifyFormErrors(formErrors);

    console.log('formerrores length', formErrors);
    
    if (formErrors.length === 0) {
      const response: any = await createApplicationArea(formatterForm());
      console.log("respuesta back", response);

      if (response.status !== 200) {
        backendErrors.push({
          field: "appAreaName",
          message: "",
          showError: true,
        });
        setBackendErrors(backendErrors);
      } else {
        dispatch({ type: "SAVE_APPLICATION_AREA", payload: formatterForm()});
        alert("Formulario enviado con éxito");
        navigator("/application_areas");
      }
    }
    setFormErrors(formErrors);
  };

  return (
    <MainContainer
      onCancel={handleCancel}
      onAccept={handleAccept}
      hasFooterButons
      cardTitle="Alta de Campo de Aplicación"
    >
      <ApplicationAreaForm></ApplicationAreaForm>
    </MainContainer>
  );
};
