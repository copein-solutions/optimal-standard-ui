import { MainContainer } from "../../../components/mainContainer/MainContainer";
import ApplicationAreaForm from "../applicationAreaForm/ApplicationAreaForm"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./editApplicationArea.css";
// import CustomTextfield from "../../../components/TextField";
// import { Button } from "@mui/material";
import { ApplicationAreaInputs } from "../../../interfaces/form/FormInterfaces";
// import { useForm } from "react-hook-form";

// Redux
// import { useDispatch } from "react-redux";

// Services
import {
  getApplicationAreaByID,
  // updateApplicationArea,
} from "../../../services/ApiService";

export const EditApplicationArea = () => {
  // const {
  //   handleSubmit,
  //   setValue,
  //   control,
  //   formState: { errors },
  // } = useForm<ApplicationAreaInputs>();

  // const dispatch = useDispatch();
  // const navigator = useNavigate();
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
        // console.log(response.data);
        // loadApplicationAreaValues(response.data);
      }
    }
    fetchData();
  }, []);

  // function loadApplicationAreaValues(appArea: any) {
  //   console.log(appArea.name);
  //   console.log(appArea.considerations);

  //   setValue("appAreaName", appArea.name);
  //   setValue("appAreaConsiderations", appArea.considerations);
  // }

  // const handleCancel = () => {
  //   navigator("/application_areas");
  // };

  // const apiDataMapper = (data: ApplicationAreaInputs) => {
  //   return {
  //     name: data.appAreaName,
  //     considerations: data.appAreaConsiderations,
  //   };
  // };

  // const onSubmit = async (data: ApplicationAreaInputs) => {
  //   console.log(data);
    
  //   const response: any = await updateApplicationArea(Number(id), apiDataMapper(data));
  //   console.log(response);
    
  //   if (response.status !== 200) {
  //     alert("Error: " + response.data.details.join(" "));
  //   } else {
  //     dispatch({ type: "SAVE_APPLICATION_AREA", payload: data });
  //     alert("Formulario enviado con éxito");
  //     navigator("/application_areas");
  //   }
  // };

  return (
    <MainContainer cardTitle="Editar campo de aplicación">
      <ApplicationAreaForm data={formData} isUpdateForm={ true }/>
      {/* <form onSubmit={handleSubmit(onSubmit)}>
        <div className="col-lg-6 col-sm-6 mb-3">
          <CustomTextfield
            name="appAreaName"
            control={control}
            rules={{ required: "Nombre requerido." }}
            label="Nombre"
            variant="outlined"
            fullWidth
            error={errors.appAreaName}
            helperText={errors.appAreaName?.message}
          />
        </div>
        <div className="col-lg-12 col-sm-12">
          <CustomTextfield
            name="appAreaConsiderations"
            control={control}
            label="Consideraciones"
            variant="outlined"
            fullWidth
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
      </form> */}
    </MainContainer>
  );
};
