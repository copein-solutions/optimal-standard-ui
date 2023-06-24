import { MainContainer } from "../mainContainer/MainContainer";
import { TextField } from "@mui/material";
import { useRef, useState } from "react";
import "./ApplicationAreaForm.css";

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

export const ApplicationAreaForm = () => {
  const [formErrors, setFormErrors] = useState<FormError[]>([]);
  const [backendErrors, setBackendErrors] = useState<BackendError[]>([]);
  
  const appAreaNameRef = useRef<HTMLInputElement>(null);
  const appAreaSpecificationRef = useRef<HTMLInputElement>(null);
  const appAreaConsiderationsRef = useRef<HTMLInputElement>(null);

  const handleCancel = () => {
    console.log("handleCancel");
  };

  const verifyFormErrors = (formErrors: FormError[]) => {
    
  };

  const handleAccept = async () => {
    const formErrors: FormError[] = [];
    const backendErrors: BackendError[] = [];
    verifyFormErrors(formErrors);

    if (formErrors.length === 0) {
      const response: any = await createApplicationArea({
        name: appAreaNameRef.current?.value,
        specification: appAreaSpecificationRef.current?.value,
        considerations: appAreaConsiderationsRef.current?.value
      });
      console.log("respuesta back", response);

      if (response.status !== 200) {
        backendErrors.push({
          field: "appAreaName",
          message: "El material ya esta en uso",
          showError: true,
        });
        setBackendErrors(backendErrors);
      } else {
        // Lógica para manejar una respuesta exitosa desde el backend
        console.log("Formulario enviado con éxito");
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
      cardTitle="Alta de Campo de Aplicacion"
    >
      <div className="container">
        {/* ------------- Nombre ------------- */}
        <div className="row mb-3">
          <div className="col-lg-6 col-sm-6">
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
          {/* ------------- Especificacion ------------- */}
          <div className="col-lg-6 col-sm-6">
            <TextField
              name="appAreaSpecification"
              fullWidth
              inputRef={appAreaSpecificationRef}
              label="Especificacion"
              variant="outlined"
              onChange={handleInputChange}
              error={
                formErrors.find((error) => error.field === "appAreaSpecification")
                  ?.showError ||
                backendErrors.find((error) => error.field === "appAreaSpecification")
                  ?.showError
              }
              helperText={
                formErrors.find((error) => error.field === "appAreaSpecification")
                  ?.message ||
                backendErrors.find((error) => error.field === "appAreaSpecification")
                  ?.message
              }
            />
          </div>
        </div>
        <div className="row mt-3">
          {/* ------------- Consideraciones ------------- */}
          <div className="col-lg-4 col-sm-6">
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
