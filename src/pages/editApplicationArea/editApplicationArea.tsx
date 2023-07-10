import { MainContainer } from "../../components/mainContainer/MainContainer";
import { ApplicationAreaForm } from "../../components/applicationAreaForm/applicationAreaForm";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./editApplicationArea.css";

// Redux
import { useDispatch } from "react-redux";

// Services
import { createApplicationArea, getApplicationAreaByID } from "../../services/ApiService";

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

export const EditApplicationArea = () => {
  const [formErrors, setFormErrors] = useState<FormError[]>([]);
  const [backendErrors, setBackendErrors] = useState<BackendError[]>([]);

  const dispatch = useDispatch();
  const navigator = useNavigate();
  
  const appAreaNameRef = useRef<HTMLInputElement>(null);
  const appAreaConsiderationsRef = useRef<HTMLInputElement>(null);
  
  const { id } = useParams();
  
  useEffect(() => {
    // Carga los datos del JSON
    async function fetchData() {
      console.log("id", id);

      const response = await getApplicationAreaByID(Number(id));
      if (response?.data.error || response === undefined) {
        alert(
          "Error: " + !response?.data.message
            ? "Network error"
            : response.data.message
        );
      } else {
        loadApplicationAreaValues(response.data);
      }
    }
    fetchData();
  }, []);

  const loadApplicationAreaValues = (appArea: any) => {
    console.log(appArea);
    
  }

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

    console.log("formerrores length", formErrors);

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
        dispatch({ type: "SAVE_APPLICATION_AREA", payload: formatterForm() });
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
      cardTitle="Alta de campo de aplicación"
    >
      <div className="col-12">
        <ApplicationAreaForm
          appAreaNameRef={appAreaNameRef}
          appAreaConsiderationsRef={appAreaConsiderationsRef}
          formErrors={formErrors}
          backendErrors={backendErrors}
        />
      </div>
    </MainContainer>
  );
};
