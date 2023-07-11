import { useEffect, useState } from "react";
import { MainContainer } from "../../components/mainContainer/MainContainer";
import { Divider, Button } from "@mui/material";
import CustomTextField from "../../components/TextField";
import CustomSelectField from "../../components/customSelectField";
import CustomDivider from "../../components/divider";
import { useForm } from "react-hook-form";

// Services
import {
  getApplicationArea,
  getMaterials,
  getMaterialsByType,
} from "../../services/ApiService";

// Constants
import { APPLICATION_MODE, SI_NO } from "../../utils/constants";

// Interfaces
import { useNavigate } from "react-router-dom";
import { systemFormInputs } from "../../interfaces/form/FormInterfaces";

export const SystemForm = () => {
  const {
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<systemFormInputs>();

  const [materials, setMaterials] = useState([]);
  const [applicationAreas, setApplicationAreas] = useState([]);
  const [materialsTypeMesh, setMaterialsTypeMesh] = useState([]);
  const [showMeshHhundredPercentInput, setShowMeshHhundredPercentInput] =
    useState(false);
  const [showParcialMeshHInputs, setShowParcialMeshHInputs] = useState(false);
  const [materialCount, setMaterialCount] = useState(0);

  const navigator = useNavigate();

  //función que se ejecuta cuando presiona el botón cancelar
  const handleCancel = () => {};

  const onSubmit = async (data: systemFormInputs) => {
    // TODO: agregar metodo post en backend e insertar data en front
    console.log(data);
  };

  // Obtengo campos de aplicación del back
  useEffect(() => {
    async function fetchData() {
      const response = await getApplicationArea();
      if (response && response.data) {
        const backendApplicationAreas = response.data;
        const formattedApplicationAreas = backendApplicationAreas.map(
          (item: { id: any; name: any }) => ({
            value: item.id,
            label: item.name,
          })
        );
        setApplicationAreas(formattedApplicationAreas);
      } else {
        alert("No se pueden recuperar campos de aplicación del back");
      }
    }
    fetchData();
  }, []);

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
      } else {
        alert("No se pueden recuperar materiales del back");
      }
    }
    fetchData();
  }, []);

  // Obtengo materiales type=malla del back
  useEffect(() => {
    async function fetchData() {
      const response = await getMaterialsByType("malla");
      if (response && response.data) {
        const backendMaterialsByType = response.data;
        console.log("backendMaterialsByType", backendMaterialsByType);
        const formattedMaterialsByType = backendMaterialsByType.map(
          (material: { id: any; name: any; brand: any }) => ({
            value: material.id,
            label: `${material.name} ${material.brand}`,
          })
        );
        console.log(formattedMaterialsByType);
        setMaterialsTypeMesh(formattedMaterialsByType);
      } else {
        alert("No se pueden recuperar materiales de tipo malla del back");
      }
    }
    fetchData();
  }, []);

  // Muestro inputs de malla 100% si corresponde
  const watchedMeshHhundredPercent = watch("systemMeshHhundredPercent");
  useEffect(() => {
    const showMeshHhundredPercentInput =
      watchedMeshHhundredPercent === "si" ? true : false;
    setShowMeshHhundredPercentInput(showMeshHhundredPercentInput);
  }, [watchedMeshHhundredPercent]);

  // Muestro inputs de malla parcial si corresponde
  const watchedParcialMesh = watch("systemParcialMesh");
  useEffect(() => {
    const showParcialMeshInputs = watchedParcialMesh === "si" ? true : false;
    setShowParcialMeshHInputs(showParcialMeshInputs);
  }, [watchedParcialMesh]);

  // Evento de botón agregar - otros complementos
  const handleAddMaterial = () => {
    setMaterialCount((prevCount) => prevCount + 1);
  };

  // Evento de botón eliminar - otros complementos
  const handleDeleteMaterial = () => {
    if (materialCount === 0) {
      alert("No hay materiales para eliminar");
    } else {
      setMaterialCount((prevCount) => Math.max(prevCount - 1, 0));
    }
  };

  return (
    <MainContainer cardTitle="Agregar sistema">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ------------- Campo de aplicación ------------- */}
        <div className="row mb-3">
          <div className="col-lg-8 col-sm-6">
            <CustomSelectField
              name="systemApplicacionArea"
              control={control}
              rules={{ required: "Campo de aplicación requerido" }}
              label="Campo de aplicación"
              error={errors.systemApplicacionArea}
              options={applicationAreas}
            />
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
        <CustomDivider text="Aplicación" />
        {/* ------------- Consumo total ------------- */}
        <div className="row mt-3">
          <div className="col-lg-3 col-sm-6">
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
          <div className="col-lg-3 col-sm-6">
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
          {/* ------------- Modo de aplicación ------------- */}
          <div className="col-lg-3 col-sm-6">
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
          <div className="col-lg-3 col-sm-6">
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
        {/* ------------- Mallas 100% ------------- */}
        <CustomDivider text="Mallas 100%" />
        {/* ------------- Si / No ------------- */}
        <div className="row mt-3">
          <div className="col-lg-2 col-sm-6">
            <CustomSelectField
              name="systemMeshHhundredPercent"
              control={control}
              rules={{ required: "Seleccione una opción." }}
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
                rules={{ required: "Nombre malla requerido." }}
                label="Malla"
                error={errors.systemMeshHhundredPercentName}
                options={materialsTypeMesh}
              />
            </div>
          )}
        </div>
        {/* ------------- Malla parcial ------------- */}
        <CustomDivider text="Malla parcial" />
        <div className="row mt-3">
          {/* ------------- Malla parcial si / no ------------- */}
          <div className="col-lg-2 col-sm-6">
            <CustomSelectField
              name="systemParcialMesh"
              control={control}
              rules={{ required: "Seleccione una opción." }}
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
                  options={materialsTypeMesh}
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
                label="Comentarios"
                variant="outlined"
                fullWidth
              />
            </div>
          </div>
        )}
        <CustomDivider
          hasButtons
          addButtonText="Agregar"
          deleteButtonText="Eliminar"
          addButtonHandleEvent={handleAddMaterial}
          deleteButtonHandleEvent={handleDeleteMaterial}
          text="Otros complementos"
        />
        {Array.from({ length: materialCount }).map((_, index) => (
          <div key={index}>
            <div className="row mt-3">
              <div className="col-lg-6 col-sm-6">
                {/* ------------- Materiales (otros complementos) ------------- */}
                <CustomSelectField
                  name={`systemOthersPluginsMaterials${index}`}
                  control={control}
                  rules={{ required: "Material requerido." }}
                  label={`Material ${index + 1}`}
                  error={errors[`systemOthersPluginsMaterials${index}`]}
                  options={materials}
                />
              </div>
              {/* ------------- Coeficiente por m2 (otros complementos) ------------- */}
              <div className="col-lg-3 col-sm-6">
                <CustomTextField
                  name={`systemOthersPluginsMaterialCoefficient${index}`}
                  control={control}
                  label="Coeficiente por m2"
                  variant="outlined"
                  fullWidth
                  rules={{ required: "Coeficiente requerido." }}
                  error={
                    errors[`systemOthersPluginsMaterialCoefficient${index}`]
                  }
                  helperText={
                    errors[`systemOthersPluginsMaterialCoefficient${index}`]
                      ?.message
                  }
                />
              </div>
              {/* ------------- Comentarios (otros complementos) ------------- */}
              <div className="col-lg-12 col-sm-6 my-3">
                <CustomTextField
                  name={`systemOthersPluginsMaterialComments${index}`}
                  control={control}
                  label="Comentarios"
                  variant="outlined"
                  fullWidth
                />
              </div>
            </div>
            {index < materialCount - 1 && <Divider />}
          </div>
        ))}
        <CustomDivider text="Sistema de capas" />
        <div className="row mt-3">
          <div className="col-lg-12 col-sm-6">
            <CustomTextField
              name="systemBasicConditions"
              control={control}
              rules={{ required: "Condiciones de base requeridas." }}
              label="Condiciones de base"
              variant="outlined"
              fullWidth
              error={errors.systemBasicConditions}
              helperText={errors.systemBasicConditions?.message}
            />
          </div>
          <div className="col-lg-12 col-sm-6 mt-3">
            <CustomTextField
              name="systemSupportConditions"
              control={control}
              rules={{ required: "Condiciones como soporte requeridas." }}
              label="Condiciones como soporte"
              variant="outlined"
              fullWidth
              error={errors.systemSupportConditions}
              helperText={errors.systemSupportConditions?.message}
            />
          </div>
        </div>
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
