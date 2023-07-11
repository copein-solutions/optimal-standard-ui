import { MainContainer } from "../../components/mainContainer/MainContainer";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./editApplicationArea.css";

// Redux
import { useDispatch } from "react-redux";

// Services
import {
  getApplicationAreaByID,
  updateApplicationArea,
} from "../../services/ApiService";
import { Button, TextField } from "@mui/material";
import { ApplicationAreaInputs } from "../../interfaces/form/FormInterfaces";
import { useForm } from "react-hook-form";

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
  const { handleSubmit, setValue } = useForm<ApplicationAreaInputs>();

  const dispatch = useDispatch();
  const navigator = useNavigate();

  const appAreaNameRef = useRef<HTMLInputElement>(null);
  const appAreaConsiderationsRef = useRef<HTMLInputElement>(null);

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
        console.log(response.data);

        loadApplicationAreaValues(response.data);
      }
    }
    fetchData();
  }, [setValue]);

  function loadApplicationAreaValues(appArea: any) {
    console.log(appArea.name);
    console.log(appArea.considerations);

    setValue("appAreaName", appArea.name);
    setValue("appAreaConsiderations", appArea.considerations);
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

  const onSubmit = async (data: ApplicationAreaInputs) => {
    const formErrors: FormError[] = [];
    const backendErrors: BackendError[] = [];
    verifyFormErrors(formErrors);

    if (formErrors.length === 0) {
      const response: any = await updateApplicationArea(Number(id), data);

      if (response.status !== 200) {
        backendErrors.push({
          field: "appAreaName",
          message: "",
          showError: true,
        });
        setBackendErrors(backendErrors);
      } else {
        dispatch({ type: "SAVE_APPLICATION_AREA", payload: data });
        alert("Formulario enviado con éxito");
        navigator("/application_areas");
      }
    }
    setFormErrors(formErrors);
  };

  return (
    <MainContainer cardTitle="Alta de campo de aplicación">
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <div className="card-footer text-body-secondary align-right">
          <Button onClick={handleCancel} variant="text">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            type="submit"
            variant="contained"
          >
            Aceptar
          </Button>
        </div>
      </form>
    </MainContainer>
  );
};
