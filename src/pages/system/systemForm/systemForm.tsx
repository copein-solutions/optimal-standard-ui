import { ReactNode, useEffect, useState } from "react";
import { Divider, Button, Typography } from "@mui/material";
import CustomTextField from "../../../components/TextField";
import CustomSelectField from "../../../components/customSelectField";
import CustomDivider from "../../../components/divider";
import { useForm } from "react-hook-form";
import "./systemForm.css";

// Services
import {
  getApplicationArea,
  getMaterialByID,
  getMaterials,
  getMaterialsByType,
  createSystem,
  updateSystem,
} from "../../../services/ApiService";

// Constants
import { APPLICATION_MODE, SI_NO, SYSTEM_LIST } from "../../../utils/constants";

// Interfaces
import { useNavigate } from "react-router-dom";
import { SystemFormInputs } from "../../../interfaces/form/FormInterfaces";
import { getUnitPrice } from "../../../utils/mathUtils";
import Toast from "../../../components/toast";

type Material = {
  brand: string;
  component: string;
  presentationPrice: string;
  presentationQuantity: string;
  presentationUnit: string;
  type: string;
  priceDate: string;
};

type SystemFormProps = {
  data?: SystemFormInputs | undefined;
  isUpdateForm: boolean;
};

export const SystemForm: React.FC<SystemFormProps> = ({
  data,
  isUpdateForm,
}) => {
  const {
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<SystemFormInputs>();

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState(String);
  const [materials, setMaterials] = useState([]);
  const [applicationAreas, setApplicationAreas] = useState([]);
  const [materialsTypeMesh, setMaterialsTypeMesh] = useState([]);
  const [showMeshHundredPercentInput, setShowMeshHundredPercentInput] =
    useState(false);
  const [showParcialMeshInputs, setShowParcialMeshInputs] = useState(false);
  const [materialCount, setMaterialCount] = useState(0);
  const [materialDataVisible, setMaterialDataVisible] = useState(false);
  const [materialUnityPriceVisible, setMaterialUnityPriceVisible] =
    useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material>({
    brand: "",
    component: "",
    presentationPrice: "",
    presentationQuantity: "",
    presentationUnit: "",
    type: "",
    priceDate: "",
  });
  const [selectedHoundredMeshPrice, setSelectedHoundredMeshPrice] =
    useState("");

  const navigator = useNavigate();

  const handleOpenToast = (msg: any) => {
    setToastMsg(msg);
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  //función que se ejecuta cuando presiona el botón cancelar
  const handleCancel = () => {
    navigator(SYSTEM_LIST);
  };

  // TODO: si los name de los campos son = que en la BD queda mejor el código
  const processFormData = (data: SystemFormInputs) => {
    let materialsArray = [
      {
        id: data.systemMaterialId,
        materialId: data.systemMaterial,
        typeOfUse: "BASE",
        coefficient: "",
        materialDescription: "",
        coefficientDescription: "",
      },
    ];

    if (data.systemMeshHundredPercentName) {
      materialsArray.push({
        id: data.systemMeshHundredPercentId,
        materialId: data.systemMeshHundredPercentName,
        typeOfUse: "TOTAL_MESH",
        coefficient: "",
        materialDescription: "",
        coefficientDescription: "",
      });
    }

    if (data.systemParcialMeshName) {
      materialsArray.push({
        id: data.systemParcialMeshId,
        materialId: data.systemParcialMeshName,
        typeOfUse: "PARTIAL_MESH",
        coefficient: data.systemParcialMeshCoefficient,
        materialDescription: data.systemPartialMeshDescription,
        coefficientDescription: "",
      });
    }

    // Ver como manejar los plugin 1, 2
    if (data.systemOthersPluginsMaterials0) {
      materialsArray.push({
        id: data.systemOthersPluginsMaterialsId0,
        materialId: data.systemOthersPluginsMaterials0,
        typeOfUse: "PLUGIN_MATERIAL",
        coefficient: data.systemOthersPluginsMaterialCoefficient0,
        materialDescription: data.systemOthersPluginsMaterialDescription0,
        coefficientDescription:
          data.systemOthersPluginsMaterialCoefficientDescription0,
      });
    }

    data.materials = materialsArray;
    data.cured = data.cured === 'si';

    console.log(data);
    
    return data;
  };

  const onSubmit = async (formData: SystemFormInputs) => {
    if (formData) {
      let response: any;
      
      if (isUpdateForm) {
        response = await updateSystem(
          Number(data?.id),
          processFormData(formData)
        );
      } else {
        response = await createSystem(processFormData(formData));
      }

      console.log(response);
      if (response.status !== 200) {
        handleOpenToast("Failure");
      } else {
        handleOpenToast("Success");
        navigator(SYSTEM_LIST);
      }
    }
  };

  // Pre cargo formulario en caso de ser update
  useEffect(() => {
    if (data) {
      console.log('pre cargo data', data);
      
      setValue("applicationAreaId", data.applicationArea.Id);
      setValue("applicationAreaName", data.applicationArea.Id);
      setValue("applicationMode", data.applicationMode);
      setValue("cured", data.cured ? "si" : "no");
      setValue("layers", data.layers);
      setValue("totalConsumption", data.totalConsumption);
      setValue("supportConditions", data.supportConditions);
      setValue("baseConditions", data.baseConditions);
      setValue("materialAreaRestrictions", data.materialAreaRestrictions);

      setValue("systemMeshHundredPercent", 'no');
      setValue("systemParcialMesh", 'no');

      let pluginMaterialC = 0;
      data.materials?.map((m: any) => {
        if (m.typeOfUse === "BASE") {
          setValue("systemMaterialId", m.id);
          setValue("systemMaterial", m.material.id);
          setSelectedMaterialOption(m.material.id)
        } else if (m.typeOfUse === "TOTAL_MESH") {
          setValue("systemMeshHundredPercent", 'si');
          setValue("systemMeshHundredPercentId", m.id);
          setValue("systemMeshHundredPercentName", m.material.id);
          setSelectedHoundredMesh(Number(m.material.id));
        } else if (m.typeOfUse === "PARTIAL_MESH") {
          setValue("systemParcialMesh", 'si');
          setValue("systemParcialMeshId", m.id);
          setValue("systemParcialMeshName", m.material.id);
          setValue("systemParcialMeshCoefficient", m.coefficient);
          setValue("systemPartialMeshDescription", m.materialDescription);
        } else if (m.typeOfUse === "PLUGIN_MATERIAL") {
          handleAddMaterial();
          setValue("systemOthersPluginsMaterialsId" + pluginMaterialC, m.id);
          setValue("systemOthersPluginsMaterials" + pluginMaterialC, m.material.id);
          setValue("systemOthersPluginsMaterialCoefficient" + pluginMaterialC, m.coefficient);
          setValue("systemOthersPluginsMaterialDescription" + pluginMaterialC, m.materialDescription);
          setValue("systemOthersPluginsMaterialCoefficientDescription" + pluginMaterialC, m.coefficientDescription);
          
          pluginMaterialC++;
        }
      });
    }
  }, [setValue, data]);

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
        // alert("No se pueden recuperar campos de aplicación del back");
        handleOpenToast("No se pueden recuperar campos de aplicación del back");
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
          (material: { id: any; product: any; brand: any }) => ({
            value: material.id,
            label: `${material.product} ${material.brand}`,
          })
        );
        setMaterials(formattedMaterials);
      } else {
        // alert("No se pueden recuperar materiales del back");
        handleOpenToast("No se pueden recuperar materiales del back");
      }
    }
    fetchData();
  }, []);

  async function setSelectedMaterialOption(value: number) {
    setMaterialDataVisible(true);
    const response = await getMaterialByID(value);
    if (response && response.data) {
      const backendMaterial = response.data;
      setSelectedMaterial({
        brand: backendMaterial.brand,
        component: backendMaterial.component,
        presentationPrice: backendMaterial.presentationPrice,
        presentationQuantity: backendMaterial.presentationQuantity,
        presentationUnit: backendMaterial.presentationUnit,
        type: backendMaterial.type,
        priceDate: backendMaterial.priceDate,
      });
    }
  }

  async function setSelectedHoundredMesh(value: number) {
    setMaterialUnityPriceVisible(true);
    const response = await getMaterialByID(value);
    if (response && response.data) {
      const backendMesh = response.data;

      const materialHoundredMesh = getUnitPrice(
        backendMesh.presentationPrice,
        backendMesh.presentationQuantity,
        backendMesh.presentationUnit,
        true
      );
      console.log("materialHoundredMesh", materialHoundredMesh);
      setSelectedHoundredMeshPrice(materialHoundredMesh);
    }
  }

  const renderMaterialData = (): ReactNode => {
    return (
      <div className="col-lg-12">
        <div className="material-data-container">
          <div className="col-lg-2 col-sm-2 data-div">
            <Typography fontWeight="700" variant="body1">
              {`Marca: ${selectedMaterial.brand}`}
            </Typography>
          </div>
          <div className="col-lg-2 col-sm-2 data-div">
            <Typography fontWeight="700" variant="body1">
              {`Tipo: ${selectedMaterial.type}`}
            </Typography>
          </div>
          <div className="col-lg-2 col-sm-2 data-div">
            <Typography fontWeight="700" variant="body1">
              {`Composición: ${selectedMaterial.component}`}
            </Typography>
          </div>
          <div className="col-lg-2 col-sm-2 data-div">
            <Typography fontWeight="700" variant="body1">
              {`Precio de presentación: ${selectedMaterial.presentationPrice}`}
            </Typography>
          </div>
          <div className="col-lg-2 col-sm-2 data-div">
            <Typography fontWeight="700" variant="body1">
              {`Cantidad de presentación: ${selectedMaterial.presentationQuantity}`}
            </Typography>
          </div>
          <div className="col-lg-2 col-sm-2 data-div">
            <Typography fontWeight="700" variant="body1">
              {`Unidad de presentación: ${selectedMaterial.presentationUnit}`}
            </Typography>
          </div>
          <div className="col-lg-2 col-sm-2 data-div">
            <Typography fontWeight="700" variant="body1">
              {`Fecha del precio: ${selectedMaterial.priceDate}`}
            </Typography>
          </div>
        </div>
      </div>
    );
  };

  // Obtengo materiales type=malla del back
  useEffect(() => {
    async function fetchData() {
      const response = await getMaterialsByType("malla");
      if (response && response.data) {
        const backendMaterialsByType = response.data;
        console.log(backendMaterialsByType);
        
        const formattedMaterialsByType = backendMaterialsByType.map(
          (material: { id: any; product: any; brand: any }) => ({
            value: material.id,
            label: `${material.product} ${material.brand}`,
          })
        );
        setMaterialsTypeMesh(formattedMaterialsByType);
      } else {
        // alert("No se pueden recuperar materiales de tipo malla del back");
        handleOpenToast(
          "No se pueden recuperar materiales de tipo malla del back"
        );
      }
    }
    fetchData();
  }, []);

  // Muestro inputs de malla 100% si corresponde
  const watchedMeshHhundredPercent = watch("systemMeshHundredPercent");
  useEffect(() => {
    const showMeshHhundredPercentInput =
      watchedMeshHhundredPercent === "si" ? true : false;
    setShowMeshHundredPercentInput(showMeshHhundredPercentInput);
  }, [watchedMeshHhundredPercent]);

  // Muestro inputs de malla parcial si corresponde
  const watchedParcialMesh = watch("systemParcialMesh");
  useEffect(() => {
    const showParcialMeshInputs = watchedParcialMesh === "si" ? true : false;
    setShowParcialMeshInputs(showParcialMeshInputs);
  }, [watchedParcialMesh]);

  // Evento de botón agregar - otros complementos
  const handleAddMaterial = () => {
    if (materialCount > 2) {
      // alert("No se pueden agregar más de tres materiales complementarios");
      handleOpenToast(
        "No se pueden agregar más de tres materiales complementarios"
      );
    } else {
      setMaterialCount((prevCount) => prevCount + 1);
    }
  };

  // Evento de botón eliminar - otros complementos
  const handleDeleteMaterial = () => {
    if (materialCount === 0) {
      // alert("No hay materiales para eliminar");
      handleOpenToast("No hay materiales para eliminar");
    } else {
      setMaterialCount((prevCount) => Math.max(prevCount - 1, 0));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* ------------- Campo de aplicación ------------- */}
      <div className="row mb-3">
        <div className="col-lg-8 col-sm-6">
          <CustomSelectField
            name="applicationAreaId"
            control={control}
            rules={{ required: "Campo de aplicación requerido" }}
            label="Campo de aplicación"
            error={errors.applicationAreaId}
            options={applicationAreas}
          />
        </div>
      </div>
      {/* ------------- Materiales ------------- */}
      <div className="row mb-3">
        <div className="col-lg-6 col-sm-6">
          <CustomSelectField
            name="systemMaterial"
            control={control}
            rules={{ required: "Material requerido." }}
            label="Material"
            error={errors.systemMaterial}
            options={materials}
            onSelectOption={(value) => setSelectedMaterialOption(value)}
          />
        </div>
      </div>
      {/* ------------- Info del material seleccionado ------------- */}
      <div className="row mb-3">
        {materialDataVisible && renderMaterialData()}
      </div>
      <CustomDivider text="Aplicación" />
      {/* ------------- Consumo total ------------- */}
      <div className="row mt-3">
        <div className="col-lg-3 col-sm-6">
          <CustomTextField
            name="totalConsumption"
            control={control}
            rules={{ required: "Consumo total requerido." }}
            label="Consumo total k/m2"
            variant="outlined"
            fullWidth
            error={errors.totalConsumption}
            helperText={errors.totalConsumption?.message}
          />
        </div>
        {/* ------------- Cantidad de manos ------------- */}
        <div className="col-lg-3 col-sm-6">
          <CustomTextField
            name="layers"
            control={control}
            rules={{ required: "Cantidad de manos requerida." }}
            label="Cantidad de manos"
            variant="outlined"
            fullWidth
            type="number"
            error={errors.layers}
            helperText={errors.layers?.message}
          />
        </div>
        {/* ------------- Modo de aplicación ------------- */}
        <div className="col-lg-3 col-sm-6">
          <CustomSelectField
            name="applicationMode"
            control={control}
            rules={{ required: "Modo de aplicación requerido." }}
            label="Modo de aplicación"
            error={errors.applicationMode}
            options={APPLICATION_MODE}
          />
        </div>
        {/* ------------- Curado ------------- */}
        <div className="col-lg-3 col-sm-6">
          <CustomSelectField
            name="cured"
            control={control}
            rules={{ required: "Curado requerido." }}
            label="Curado"
            error={errors.cured}
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
            name="systemMeshHundredPercent"
            control={control}
            rules={{ required: "Seleccione una opción." }}
            label="Si / No"
            error={errors.systemMeshHundredPercent}
            options={SI_NO}
          />
        </div>
        {/* ------------- Nombre malla 100% ------------- */}
        {showMeshHundredPercentInput && (
          <div className="col-lg-6 col-sm-6">
            <CustomSelectField
              name="systemMeshHundredPercentName"
              control={control}
              rules={{ required: "Nombre malla requerido." }}
              label="Malla"
              error={errors.systemMeshHundredPercentName}
              options={materialsTypeMesh}
              onSelectOption={(value) => setSelectedHoundredMesh(value)}
            />
          </div>
        )}
      </div>
      {/* ------------- Info malla 100% seleccionada ------------- */}
      <div className="row mt-3">
        {materialUnityPriceVisible && showMeshHundredPercentInput && (
          <div className="col-lg-3 col-sm-4">
            <div className="material-data-container">
              <div className="data-div ml-2">
                <Typography fontWeight="700" variant="body1">
                  {`Precio: ${selectedHoundredMeshPrice}`}
                </Typography>
              </div>
            </div>
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
        {showParcialMeshInputs && (
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
            {/* ------------- Coeficiente por m2 ------------- */}
            <div className="col-lg-4 col-sm-6">
              <CustomTextField
                name="systemParcialMeshCoefficient"
                control={control}
                rules={{ required: "Coeficiente requerido." }}
                label="Coeficiente por m2"
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
      {showParcialMeshInputs && (
        <div className="row mt-3">
          <div className="col-lg-12 col-sm-6">
            <CustomTextField
              multiline
              minRows={2}
              name="systemPartialMeshDescription"
              control={control}
              label="Descripción"
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
                error={errors[`systemOthersPluginsMaterialCoefficient${index}`]}
                helperText={
                  errors[`systemOthersPluginsMaterialCoefficient${index}`]
                    ?.message
                }
              />
            </div>
            {/* ------------- Descripción complemento (otros complementos) ------------- */}
            <div className="col-lg-6 col-sm-6 mt-3">
              <CustomTextField
                multiline
                minRows={3}
                name={`systemOthersPluginsMaterialDescription${index}`}
                control={control}
                label="Descripción complemento"
                variant="outlined"
                fullWidth
              />
            </div>
            {/* ------------- Descripción coef m2 (otros complementos) ------------- */}
            <div className="col-lg-6 col-sm-6 mt-3">
              <CustomTextField
                multiline
                minRows={3}
                name={`systemOthersPluginsMaterialCoefficientDescription${index}`}
                control={control}
                label="Descripción coeficiente m2"
                variant="outlined"
                fullWidth
              />
            </div>
          </div>
          {index < materialCount - 1 && <Divider className="mt-3"/>}
        </div>
      ))}
      <CustomDivider text="Sistema de capas" />
      <div className="row mt-3">
        <div className="col-lg-12 col-sm-6">
          <CustomTextField
            name="baseConditions"
            control={control}
            rules={{ required: "Condiciones de base requeridas." }}
            label="Condiciones de base"
            variant="outlined"
            fullWidth
            error={errors.baseConditions}
            helperText={errors.baseConditions?.message}
          />
        </div>
        <div className="col-lg-12 col-sm-6 mt-3">
          <CustomTextField
            name="supportConditions"
            control={control}
            rules={{ required: "Condiciones como soporte requeridas." }}
            label="Condiciones como soporte"
            variant="outlined"
            fullWidth
            error={errors.supportConditions}
            helperText={errors.supportConditions?.message}
          />
        </div>
      </div>
      <CustomDivider text="Restricciones" />
      <div className="row mt-3">
        <div className="col-lg-3 col-sm-6">
          <CustomTextField
            name="materialAreaRestrictions"
            control={control}
            rules={{ required: "Restricción por área requerida." }}
            label="Por área m2"
            variant="outlined"
            fullWidth
            type="number"
            error={errors.materialAreaRestrictions}
            helperText={errors.materialAreaRestrictions?.message}
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
      <Toast
        type="error"
        message={toastMsg}
        open={showToast}
        onClose={handleCloseToast}
      />
    </form>
  );
};
