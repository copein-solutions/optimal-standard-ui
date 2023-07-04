import { MainContainer } from "../mainContainer/MainContainer";
import { TextField } from "@mui/material";
import { useRef, useState } from "react";
import "./ApplicationAreaForm.css";

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

interface ApplicationAreaProps {
  onClose: () => void;
}

export const ApplicationAreaForm: React.FC<ApplicationAreaProps> = ({ onClose }) => {
  const [formErrors, setFormErrors] = useState<FormError[]>([]);
  const [backendErrors, setBackendErrors] = useState<BackendError[]>([]);

  const dispatch = useDispatch();
  
  const appAreaNameRef = useRef<HTMLInputElement>(null);
  const appAreaConsiderationsRef = useRef<HTMLInputElement>(null);

  const handleCancel = () => {
    onClose();
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
        onClose()
      }
    }
    setFormErrors(formErrors);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const errors: FormError[] = [];
    const fieldName = event.target?.name; // valor de la propiedad name del input
    const validationMessage = event.target?.validationMessage; // mensaje de error de validaciones que no son de backend, ej: el error del regex
    console.log("validationMessage", validationMessage);

    if (!event.target?.validity?.valid) {
      errors.push({
        field: fieldName,
        message: validationMessage,
        showError: true,
      });
    }

    setFormErrors(errors);
    setBackendErrors(errors);
  };

  return (
    <MainContainer
      onCancel={handleCancel}
      onAccept={handleAccept}
      hasFooterButons
      cardTitle="Alta de Campo de Aplicación"
    >
      <div className="container">
        {/* ------------- Nombre ------------- */}
        <div className="row mb-3">
          <div className="col-lg-6 col-sm-12">
            <TextField
              name="appAreaName"
              required
              fullWidth
              inputRef={appAreaNameRef}
              label="Nombre"
              variant="outlined"
              onChange={handleInputChange}
              error={
                formErrors.find((error) => error.field === "appAreaName")
                  ?.showError ||
                backendErrors.find((error) => error.field === "appAreaName")
                  ?.showError
              }
              helperText={
                formErrors.find((error) => error.field === "appAreaName")
                  ?.message ||
                backendErrors.find((error) => error.field === "appAreaName")
                  ?.message
              }
            />
          </div>
          {/* ------------- Consideraciones ------------- */}
          <div className="col-lg-6 col-sm-12">
            <TextField
              name="appAreaConsiderations"
              fullWidth
              multiline
              inputRef={appAreaConsiderationsRef}
              label="Consideraciones"
              variant="outlined"
              onChange={handleInputChange}
              error={
                formErrors.find((error) => error.field === "appAreaConsiderations")
                  ?.showError ||
                backendErrors.find((error) => error.field === "appAreaConsiderations")
                  ?.showError
              }
              helperText={
                formErrors.find((error) => error.field === "appAreaConsiderations")
                  ?.message ||
                backendErrors.find((error) => error.field === "appAreaConsiderations")
                  ?.message
              }
            />
          </div>
        </div>
      </div>
    </MainContainer>
  );
};
