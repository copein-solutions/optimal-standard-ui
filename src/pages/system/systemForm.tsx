import { useEffect, useRef, useState } from "react";
import { MainContainer } from "../../components/mainContainer/MainContainer";
import {
  Divider,
  Typography,
  TextField,
  InputAdornment,
  FormControlLabel,
  FormLabel,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from "@mui/material";
import CustomTextField from "../../components/TextField";
import CustomSelectField from "../../components/customSelectField";
import { Controller, useForm } from "react-hook-form";

// Services
import { getMaterials } from "../../services/ApiService";

// Constants
import { APPLICATION_MODE, MATERIAL_UNIT, SI_NO } from "../../utils/constants";

// Interfaces
import { ResponseApi } from "../../interfaces/service/ApiInterfaces";
import { useNavigate } from "react-router-dom";
import { systemFormInputs } from "../../interfaces/form/FormInterfaces";

export const SystemForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<systemFormInputs>();

  const [materials, setMaterials] = useState([]);
  const [showMeshHhundredPercentInput, setShowMeshHhundredPercentInput] =
    useState(false);
  const [showParcialMeshHInputs, setShowParcialMeshHInputs] = useState(false);

  const navigator = useNavigate();

  //función que se ejecuta cuando presiona el botón cancelar
  const handleCancel = () => {};

  const handleAccept = async () => {};

  const onSubmit = async (data: systemFormInputs) => {
    console.log(data);
    // const response = await updateMaterial(Number(id), apiDataMapper(data));
    // console.log(response);
    // if (response.data.error) {
    //   if (response.data.details) {
    //     alert("Error: " + response.data.details.join(" "));
    //   } else {
    //     alert("Error: " + response.data.message);
    //   }
    // } else {
    //   alert("Formulario enviado con éxito");
    // }
  };

  // Obtengo materiales del back
  useEffect(() => {
    async function fetchData() {
      const response = await getMaterials();
      if (response && response.data) {
        const backendMaterials = response.data;

        const formattedMaterials = backendMaterials.map(
          (material: { id: any; name: any; brand: any }) => ({
            value: material.id,
            label: `${material.name} ${material.brand}`,
          })
        );
        setMaterials(formattedMaterials);
      }
    }
    fetchData();
  }, []);

  // Muestro campos de malla 100% si corresponde
  const watchedMeshHhundredPercent = watch("systemMeshHhundredPercent");
  useEffect(() => {
    const showMeshHhundredPercentInput =
      watchedMeshHhundredPercent === "si" ? true : false;
    setShowMeshHhundredPercentInput(showMeshHhundredPercentInput);
  }, [watchedMeshHhundredPercent]);

  // Muestro campos de malla parcial si corresponde
  const watchedParcialMesh = watch("systemParcialMesh");
  useEffect(() => {
    const showParcialMeshInputs = watchedParcialMesh === "si" ? true : false;
    setShowParcialMeshHInputs(showParcialMeshInputs);
  }, [watchedParcialMesh]);

  return (
    <MainContainer cardTitle="Agregar sistema">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ------------- Campo de aplicación ------------- */}
        <div className="row mb-3">
          <div className="col-lg-8 col-sm-6">
            <FormControl fullWidth error={!!errors.systemApplicacionArea}>
              <InputLabel id="custom-select-label">
                Campo de aplicación
              </InputLabel>
              <Controller
                name="systemApplicacionArea"
                control={control}
                defaultValue=""
                rules={{ required: "Campo de aplicación requerido" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Campo de aplicación"
                    onChange={(e) => {
                      const value = e.target.value as string;
                      field.onChange(value);
                    }}
                  >
                    {MATERIAL_UNIT.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.systemApplicacionArea && (
                <Typography
                  variant="caption"
                  align="left"
                  sx={{ marginLeft: "14px" }}
                  color="error"
                >
                  {errors.systemApplicacionArea.message}
                </Typography>
              )}
            </FormControl>
          </div>
          {/* ------------- Materiales ------------- */}
        </div>
        <div className="row mb-3">
          <div className="col-lg-6 col-sm-6">
            <CustomSelectField
              name="systemMaterial"
              control={control}
              rules={{ required: "Material requerido." }}
              label="Material"
              error={errors.systemMaterial}
              options={materials}
            />
          </div>
        </div>
        <Typography
          align="left"
          variant="subtitle1"
          component="div"
          sx={{ mt: 3 }}
        >
          Aplicación
        </Typography>
        <Divider />
        {/* ------------- Consumo total ------------- */}
        <div className="row mt-3">
          <div className="col-lg-6 col-sm-6">
            <CustomTextField
              name="systemTotalConsumption"
              control={control}
              rules={{ required: "Consumo total requerido." }}
              label="Consumo total k/m2"
              variant="outlined"
              fullWidth
              error={errors.systemTotalConsumption}
              helperText={errors.systemTotalConsumption?.message}
            />
          </div>
          {/* ------------- Cantidad de manos ------------- */}
          <div className="col-lg-6 col-sm-6">
            <CustomTextField
              name="systemMaterialLayers"
              control={control}
              rules={{ required: "Cantidad de manos requerida." }}
              label="Cantidad de manos"
              variant="outlined"
              fullWidth
              type="number"
              error={errors.systemMaterialLayers}
              helperText={errors.systemMaterialLayers?.message}
            />
          </div>
        </div>

        <div className="row mt-3">
          {/* ------------- Modo de aplicación ------------- */}
          <div className="col-lg-6 col-sm-6">
            <CustomSelectField
              name="systemApplicationMode"
              control={control}
              rules={{ required: "Modo de aplicación requerido." }}
              label="Modo de aplicación"
              error={errors.systemApplicationMode}
              options={APPLICATION_MODE}
            />
          </div>
          {/* ------------- Curado ------------- */}
          <div className="col-lg-6 col-sm-6">
            <CustomSelectField
              name="systemCured"
              control={control}
              rules={{ required: "Curado requerido." }}
              label="Curado"
              error={errors.systemCured}
              options={SI_NO}
            />
          </div>
        </div>
        <Typography
          align="left"
          variant="subtitle1"
          component="div"
          sx={{ mt: 3 }}
        >
          Mallas 100%
        </Typography>
        <Divider />
        {/* ------------- Si / No ------------- */}
        <div className="row mt-3">
          <div className="col-lg-2 col-sm-6">
            <CustomSelectField
              name="systemMeshHhundredPercent"
              control={control}
              rules={{ required: "Material complementario requerido." }}
              label="Si / No"
              error={errors.systemMeshHhundredPercent}
              options={SI_NO}
            />
          </div>
          {/* ------------- Nombre malla 100% ------------- */}
          {showMeshHhundredPercentInput && (
            <div className="col-lg-6 col-sm-6">
              <CustomSelectField
                name="systemMeshHhundredPercentName"
                control={control}
                rules={{ required: "Malla requerida." }}
                label="Malla"
                error={errors.systemMeshHhundredPercentName}
                //TODO: filtrar materiales por tipo: malla
                options={materials}
              />
            </div>
          )}
        </div>
        <Typography
          align="left"
          variant="subtitle1"
          component="div"
          sx={{ mt: 3 }}
        >
          Malla parcial
        </Typography>
        <Divider />
        <div className="row mt-3">
          {/* ------------- Malla parcial si / no ------------- */}
          <div className="col-lg-2 col-sm-6">
            <CustomSelectField
              name="systemParcialMesh"
              control={control}
              rules={{ required: "Malla requerida." }}
              label="Si / No"
              error={errors.systemParcialMesh}
              options={SI_NO}
            />
          </div>
          {/* ------------- Nombre malla parcial ------------- */}
          {showParcialMeshHInputs && (
            <>
              <div className="col-lg-6 col-sm-6">
                <CustomSelectField
                  name="systemParcialMeshName"
                  control={control}
                  rules={{ required: "Nombre de malla requerido." }}
                  label="Malla"
                  error={errors.systemParcialMeshName}
                  //TODO: filtrar materiales por tipo: malla
                  options={materials}
                />
              </div>
              {/* ------------- Consumo total k/m2 ------------- */}
              <div className="col-lg-4 col-sm-6">
                <CustomTextField
                  name="systemParcialMeshCoefficient"
                  control={control}
                  rules={{ required: "Consumo total requerido." }}
                  label="Consumo total k/m2"
                  variant="outlined"
                  fullWidth
                  type="number"
                  error={errors.systemParcialMeshCoefficient}
                  helperText={errors.systemParcialMeshCoefficient?.message}
                />
              </div>
            </>
          )}
        </div>
        {showParcialMeshHInputs && (
          <div className="row mt-3">
            <div className="col-lg-12 col-sm-6">
              <CustomTextField
                name="systemParcialMeshComents"
                control={control}
                // rules={{ required: "Consumo total requerido." }}
                label="Comentarios"
                variant="outlined"
                fullWidth
                // error={errors.systemParcialMeshComents}
                // helperText={errors.systemParcialMeshComents?.message}
              />
            </div>
          </div>
        )}
        <Typography
          align="left"
          variant="subtitle1"
          component="div"
          sx={{ mt: 3 }}
        >
          Otros complementos
        </Typography>
        <Divider />
        {/* ------------- Botones formulario ------------- */}
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
