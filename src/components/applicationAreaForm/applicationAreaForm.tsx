import { TextField } from "@mui/material";
import { useRef, useState } from "react";
import "./applicationAreaForm.css";

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
  const appAreaConsiderationsRef = useRef<HTMLInputElement>(null);

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
              formErrors.find(
                (error) => error.field === "appAreaConsiderations"
              )?.showError ||
              backendErrors.find(
                (error) => error.field === "appAreaConsiderations"
              )?.showError
            }
            helperText={
              formErrors.find(
                (error) => error.field === "appAreaConsiderations"
              )?.message ||
              backendErrors.find(
                (error) => error.field === "appAreaConsiderations"
              )?.message
            }
          />
        </div>
      </div>
    </div>
  );
};
