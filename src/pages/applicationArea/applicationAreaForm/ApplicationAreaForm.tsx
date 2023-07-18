import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import CustomTextfield from "../../../components/TextField";
import { Button } from "@mui/material";
import { ApplicationAreaInputs } from "../../../interfaces/form/FormInterfaces";

// Services
import { updateApplicationArea, createApplicationArea } from "../../../services/ApiService";

// Redux
import { useDispatch } from "react-redux";

type ApplicationAreaFormProps = {
    data?: ApplicationAreaInputs | undefined;
    isUpdateForm: boolean;
  }

const ApplicationAreaForm: React.FC<ApplicationAreaFormProps> = ({ data, isUpdateForm }) => {
  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<ApplicationAreaInputs>({});

  const navigator = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      setValue("name", data.name);
      setValue("considerations", data.considerations);
    }
  }, [setValue, data]);

  const onSubmit = async (formData: ApplicationAreaInputs) => {
    let response: any;
    if(isUpdateForm) {
      response = await updateApplicationArea(Number(data?.id), formData);
      console.log(response);
    } else {
      //TODO: addApplicationArea
      response = await createApplicationArea(formData);
    }


    if (response.status !== 200) {
      alert("Error: " + response.data.details.join(" "));
    } else {
      if(!isUpdateForm) { 
        dispatch({ type: "SAVE_APPLICATION_AREA", payload: response.data });
      }      
      alert("Formulario enviado con éxito");
      navigator("/application_areas");
    }
  };

  const handleCancel = () => {
    navigator("/application_areas");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="col-lg-6 col-sm-6 mb-3">
        <CustomTextfield
          name="name"
          defaultValue={data?.name}
          control={control}
          rules={{ required: "Nombre requerido." }}
          label="Nombre"
          variant="outlined"
          fullWidth
          error={errors.name}
          helperText={errors.name?.message}
        />
      </div>
      <div className="col-lg-12 col-sm-12">
        <CustomTextfield
          name="considerations"
          defaultValue={data?.considerations}
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
    </form>
  );
};

export default ApplicationAreaForm;
