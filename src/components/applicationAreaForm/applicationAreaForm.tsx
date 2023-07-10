import { TextField } from "@mui/material";
import { BackendError, FormError } from "../../interfaces/form/FormInterfaces";

interface ApplicationAreaFormProps {
  appAreaNameRef: React.RefObject<HTMLInputElement>;
  appAreaConsiderationsRef: React.RefObject<HTMLInputElement>;
  formErrors: FormError[];
  backendErrors: BackendError[];
}

export const ApplicationAreaForm: React.FC<ApplicationAreaFormProps> = ({
  appAreaNameRef,
  appAreaConsiderationsRef,
  formErrors,
  backendErrors,
}) => {
  return (
    <div>
      <div className="col-lg-6 col-sm-12">
        <TextField
          name="appAreaName"
          required
          fullWidth
          inputRef={appAreaNameRef}
          label="Nombre"
          variant="outlined"
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
      <div className="col-lg-6 col-sm-12">
        <TextField
          name="appAreaConsiderations"
          fullWidth
          multiline
          inputRef={appAreaConsiderationsRef}
          label="Consideraciones"
          variant="outlined"
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
  );
};
