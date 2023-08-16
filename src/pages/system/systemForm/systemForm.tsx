import { ReactNode, useEffect, useState } from "react";
import { Divider, Button, Typography } from "@mui/material";
import CustomTextField from "../../../components/TextField";
import CustomSelectField from "../../../components/customSelectField";
import CustomDivider from "../../../components/divider";
import MaterialData from "../../system/materialData/materialData";
import Toast from "../../../components/toast";

import { useForm } from "react-hook-form";
import "./systemForm.css";

// Services
import {
  getApplicationArea,
  getMaterials,
  getMaterialsByType,
  createSystem,
  updateSystem,
} from "../../../services/ApiService";

// Constants
import {
  APPLICATION_MODE,
  SI_NO,
  SI_NO_NE,
  SYSTEM_LIST,
} from "../../../utils/constants";

// Interfaces
import { useNavigate } from "react-router-dom";
import {
  Material,
  SystemFormInputs,
  Options,
  SystemFormProps,
  BaseMaterial,
  TypeOfUseOfMaterial,
  ConstructionSystem,
} from "../../../interfaces/form/FormInterfaces";
import { getUnitPrice } from "../../../utils/mathUtils";

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

  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>("");
  const [materialsSelect, setMaterialsSelect] = useState<Options[]>([]);
  const [globalMaterials, setGlobalMaterials] = useState<Material[]>([]);
  const [applicationAreas, setApplicationAreas] = useState([]);
  const [materialsTypeMesh, setMaterialsTypeMesh] = useState<Material[]>([]);
  const [formattedMeshSelect, setFormattedMeshSelect] = useState([]);
  const [showMeshTotalPercentInput, setShowMeshTotalPercentInput] =
    useState<boolean>(false);
  const [showParcialMeshInputs, setShowParcialMeshInputs] =
    useState<boolean>(false);
  const [showRestrictions, setShowRestrictions] = useState<boolean>(false);
  const [materialCount, setMaterialCount] = useState<number>(0);
  // MATERIAL BASE
  const [materialDataVisible, setMaterialDataVisible] =
    useState<boolean>(false);
  const [selectedBaseMaterialDetail, setSelectedBaseMaterialDetail] =
    useState<BaseMaterial>({
      brand: "",
      component: "",
      presentationPrice: "",
      presentationQuantity: "",
      presentationUnit: "",
      type: "",
      priceDate: "",
      potLife: "",
      minApplicableTemp: "",
    });
  // MALLA 100%
  const [totalMeshUnityPriceVisible, setTotalMeshUnityPriceVisible] =
    useState<boolean>(false);
  const [selectedTotalMeshPrice, setSelectedTotalMeshPrice] =
    useState<string>("");
  // MALLA PARCIAL
  const [partialMeshUnityPriceVisible, setPartialMeshUnityPriceVisible] =
    useState<boolean>(false);
  const [selectedPartialMeshPrice, setSelectedPartialMeshPrice] =
    useState<string>("");
  // OTROS COMPLEMENTOS
  const [pluginMaterialDataVisible, setPluginMaterialDataVisible] =
    useState<boolean>(false);
  const [selectedPluginMaterialDetail1, setSelectedPluginMaterialDetail1] =
    useState<BaseMaterial>({
      brand: "",
      component: "",
      presentationPrice: "",
      presentationQuantity: "",
      presentationUnit: "",
      type: "",
      priceDate: "",
      potLife: "",
      minApplicableTemp: "",
    });
  const [selectedPluginMaterialDetail2, setSelectedPluginMaterialDetail2] =
    useState<BaseMaterial>({
      brand: "",
      component: "",
      presentationPrice: "",
      presentationQuantity: "",
      presentationUnit: "",
      type: "",
      priceDate: "",
      potLife: "",
      minApplicableTemp: "",
    });
  const [selectedPluginMaterialDetail3, setSelectedPluginMaterialDetail3] =
    useState<BaseMaterial>({
      brand: "",
      component: "",
      presentationPrice: "",
      presentationQuantity: "",
      presentationUnit: "",
      type: "",
      priceDate: "",
      potLife: "",
      minApplicableTemp: "",
    });

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

  const handleMaterialRestrictions = (
    materialAreaRestrictions: string,
    materialAreaRestrictionValue: string
  ) => {
    let materialRestriction = null;
    if (materialAreaRestrictions === "si") {
      materialRestriction = materialAreaRestrictionValue;
    } else if (materialAreaRestrictions === "n/e") {
      materialRestriction = "n/e";
    }
    return materialRestriction;
  };

  const processFormData = (data: SystemFormInputs) => {
    let constructionSystem: ConstructionSystem = {
      totalConsumption: data.totalConsumption,
      layers: data.layers,
      applicationMode: data.applicationMode,
      cured: data.cured === "si",
      applicationAreaId: data.applicationAreaId,
      baseConditions: data.baseConditions,
      supportConditions: data.supportConditions,
      materialAreaRestrictions: handleMaterialRestrictions(
        data.materialAreaRestrictions,
        data.materialAreaRestrictionValue
      ),
      materialAreaDescription: data.materialAreaDescription,
      materials: [],
    };

    constructionSystem.materials.push({
      id: data.systemMaterialId,
      materialId: data.systemMaterial,
      typeOfUse: "BASE",
    });

    if (data.systemMeshTotalPercent === "si") {
      constructionSystem.materials.push({
        id: data.systemMeshTotalPercentId,
        materialId: data.systemMeshTotalPercentName,
        typeOfUse: "TOTAL_MESH",
      });
    }

    if (data.systemParcialMesh === "si") {
      constructionSystem.materials.push({
        id: data.systemParcialMeshId,
        materialId: data.systemParcialMeshName,
        typeOfUse: "PARTIAL_MESH",
        coefficient: data.systemParcialMeshCoefficient,
        materialDescription: data.systemPartialMeshDescription,
      });
    }

    for (let i = 0; i < materialCount; i++) {
      constructionSystem.materials.push({
        id: data[`systemOthersPluginsMaterialsId${i}`],
        materialId: data[`systemOthersPluginsMaterials${i}`],
        typeOfUse: "PLUGIN_MATERIAL",
        coefficient: data[`systemOthersPluginsMaterialCoefficient${i}`],
        materialDescription: data[`systemOthersPluginsMaterialDescription${i}`],
        coefficientDescription:
          data[`systemOthersPluginsMaterialCoefficientDescription${i}`],
      });
    }

    return constructionSystem;
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
    if (data && isUpdateForm) {
      setValue("applicationAreaId", data.applicationArea.id);
      setValue("applicationMode", data.applicationMode);
      setValue("cured", data.cured ? "si" : "no");
      setValue("layers", data.layers);
      setValue("totalConsumption", data.totalConsumption);
      setValue("supportConditions", data.supportConditions);
      setValue("baseConditions", data.baseConditions);
      if (
        data.materialAreaRestrictions !== null &&
        data.materialAreaRestrictions !== "n/e"
      ) {
        setValue("materialAreaRestrictionValue", data.materialAreaRestrictions);
        setValue("materialAreaRestrictions", "si");
      } else {
        setValue("materialAreaRestrictions", data.materialAreaRestrictions);
      }
      setValue("materialAreaDescription", data.materialAreaDescription);
      setValue("systemMeshTotalPercent", "no");
      setValue("systemParcialMesh", "no");

      let pluginMaterialC = 0;
      data.materials?.map((m: any) => {
        if (m.typeOfUse === "BASE") {
          setValue("systemMaterialId", m.id);
          setValue("systemMaterial", m.material.id);
          setSelectedMaterialOption(m.material.id, "isUpdate");
        } else if (m.typeOfUse === "TOTAL_MESH") {
          setValue("systemMeshTotalPercent", "si");
          setValue("systemMeshTotalPercentId", m.id);
          setValue("systemMeshTotalPercentName", m.material.id);
          handleTotalMesh(Number(m.material.id), "isUpdate");
        } else if (m.typeOfUse === "PARTIAL_MESH") {
          setValue("systemParcialMesh", "si");
          setValue("systemParcialMeshId", m.id);
          setValue("systemParcialMeshName", m.material.id);
          setValue("systemParcialMeshCoefficient", m.coefficient);
          setValue("systemPartialMeshDescription", m.materialDescription);
          handlePartialMesh(m.material.id);
        } else if (m.typeOfUse === "PLUGIN_MATERIAL") {
          handleAddMaterial();
          handlePluginsMaterial(
            Number(m.material.id),
            pluginMaterialC,
            "isUpdate"
          );
          setValue("systemOthersPluginsMaterialsId" + pluginMaterialC, m.id);
          setValue(
            `systemOthersPluginsMaterials${pluginMaterialC}`,
            m.material.id
          );
          setValue(
            `systemOthersPluginsMaterialCoefficient${pluginMaterialC}`,
            m.coefficient
          );
          setValue(
            `systemOthersPluginsMaterialDescription${pluginMaterialC}`,
            m.materialDescription
          );
          setValue(
            `systemOthersPluginsMaterialCoefficientDescription${pluginMaterialC}`,
            m.coefficientDescription
          );
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
        setMaterialsSelect(formattedMaterials);
        setGlobalMaterials(backendMaterials);
      } else {
        handleOpenToast("No se pueden recuperar materiales del back");
      }
    }
    fetchData();
  }, []);

  const setBaseMaterialDetail = (material: Material) => {
    setSelectedBaseMaterialDetail({
      brand: material.brand,
      component: material.component,
      presentationPrice: material.presentationPrice,
      presentationQuantity: material.presentationQuantity,
      presentationUnit: material.presentationUnit,
      type: material.type,
      priceDate: material.priceDate,
      potLife: material.potLife ? String(material.potLife) : "-",
      minApplicableTemp: material.minApplicableTemp
        ? String(material.minApplicableTemp)
        : "-",
    });
  };

  const updateMaterialDetail1 = (material: Material) => {
    setSelectedPluginMaterialDetail1({
      brand: material.brand,
      component: material.component,
      presentationPrice: material.presentationPrice,
      presentationQuantity: material.presentationQuantity,
      presentationUnit: material.presentationUnit,
      type: material.type,
      priceDate: material.priceDate,
      potLife: material.potLife ? String(material.potLife) : "-",
      minApplicableTemp: material.minApplicableTemp
        ? String(material.minApplicableTemp)
        : "-",
    });
  };

  const updateMaterialDetail2 = (material: Material) => {
    setSelectedPluginMaterialDetail2({
      brand: material.brand,
      component: material.component,
      presentationPrice: material.presentationPrice,
      presentationQuantity: material.presentationQuantity,
      presentationUnit: material.presentationUnit,
      type: material.type,
      priceDate: material.priceDate,
      potLife: material.potLife ? String(material.potLife) : "-",
      minApplicableTemp: material.minApplicableTemp
        ? String(material.minApplicableTemp)
        : "-",
    });
  };

  const updateMaterialDetail3 = (material: Material) => {
    setSelectedPluginMaterialDetail3({
      brand: material.brand,
      component: material.component,
      presentationPrice: material.presentationPrice,
      presentationQuantity: material.presentationQuantity,
      presentationUnit: material.presentationUnit,
      type: material.type,
      priceDate: material.priceDate,
      potLife: material.potLife ? String(material.potLife) : "-",
      minApplicableTemp: material.minApplicableTemp
        ? String(material.minApplicableTemp)
        : "-",
    });
  };

  const findFromGlobalMaterialsAndSetDetails = (
    value: number,
    index?: number
  ) => {
    const material = globalMaterials.find(
      (item: Material) => item.id === value
    );

    if (material) {
      if (index === undefined) {
        setBaseMaterialDetail(material);
      } else {
        if (index === 0) {
          updateMaterialDetail1(material);
        } else if (index === 1) {
          updateMaterialDetail2(material);
        } else if (index === 2) {
          updateMaterialDetail3(material);
        }
      }
    }
  };

  function setSelectedMaterialOption(value: number, origin: string) {
    setMaterialDataVisible(true);
    if (isUpdateForm) {
      // pre cuando se llama desde el backend sin recorrer todos los materiales
      if (origin !== "select") {
        const typeOfUseMaterial = data?.materials.find(
          (item: TypeOfUseOfMaterial) => item.material?.id === value
        );

        if (typeOfUseMaterial) {
          setBaseMaterialDetail(typeOfUseMaterial.material);
        }
        // pre cargo cuando se llama desde select recorriendo todos los materiales
      } else if (origin === "select") {
        findFromGlobalMaterialsAndSetDetails(value);
      }
    } else {
      findFromGlobalMaterialsAndSetDetails(value);
    }
  }

  function handlePluginsMaterial(value: number, index: number, origin: string) {
    setPluginMaterialDataVisible(true);
    if (isUpdateForm) {
      if (origin !== "select") {
        const typeOfUseMaterial = data?.materials.find(
          (item: TypeOfUseOfMaterial) => item.material?.id === value
        );

        if (typeOfUseMaterial) {
          if (index === 0) {
            setSelectedPluginMaterialDetail1(typeOfUseMaterial.material);
          } else if (index === 1) {
            setSelectedPluginMaterialDetail2(typeOfUseMaterial.material);
          } else if (index === 2) {
            setSelectedPluginMaterialDetail3(typeOfUseMaterial.material);
          }
        }
      } else if (origin === "select") {
        findFromGlobalMaterialsAndSetDetails(value, index);
      }
    } else {
      findFromGlobalMaterialsAndSetDetails(value, index);
    }
  }

  function renderPluginMaterialDetails(index: number): ReactNode {
    let retorno;
    if (index === 0) {
      retorno = selectedPluginMaterialDetail1;
    } else if (index === 1) {
      retorno = selectedPluginMaterialDetail2;
    } else if (index === 2) {
      retorno = selectedPluginMaterialDetail3;
    }
    return <MaterialData material={retorno} />;
  }

  const findMeshesAndGetUnitPrice = (value: number): string => {
    let result = "";
    const selectedMesh = materialsTypeMesh.find((item) => item.id === value);

    if (selectedMesh) {
      const meshPrice = getUnitPrice(
        Number(selectedMesh.presentationPrice),
        Number(selectedMesh.presentationQuantity),
        selectedMesh.presentationUnit,
        true
      );
      result = meshPrice;
    }
    return result;
  };

  // Obtengo precio unitario malla 100 %
  function handleTotalMesh(value: number, origin: string) {
    setTotalMeshUnityPriceVisible(true);
    const meshPrice = findMeshesAndGetUnitPrice(value);
    setSelectedTotalMeshPrice(meshPrice);
  }

  // Obtengo precio unitario malla parcial
  function handlePartialMesh(value: number) {
    setPartialMeshUnityPriceVisible(true);
    const meshPrice = findMeshesAndGetUnitPrice(value);
    setSelectedPartialMeshPrice(meshPrice);
  }

  // Obtengo materiales type=malla del back
  useEffect(() => {
    async function fetchData() {
      const response = await getMaterialsByType("malla");
      if (response && response.data) {
        const backendMeshMaterials = response.data;

        formatMeshSelect(backendMeshMaterials);
        setMaterialsTypeMesh(backendMeshMaterials);
      } else {
        handleOpenToast(
          "No se pueden recuperar materiales de tipo malla del back"
        );
      }
    }
    fetchData();
  }, []);

  // TODO: arreglar tipado, ver si no se puede hacer sin generar otra const formattedMeshSelect
  function formatMeshSelect(backendMeshMaterials: any) {
    const formattedMaterialsByType = backendMeshMaterials.map(
      (material: { id: any; product: any; brand: any }) => ({
        value: material.id,
        label: `${material.product} ${material.brand}`,
      })
    );
    setFormattedMeshSelect(formattedMaterialsByType);
  }

  // Muestro inputs de malla 100% si corresponde
  const watchedMeshTotalPercent = watch("systemMeshTotalPercent");
  useEffect(() => {
    const showMeshTotalPercentInput =
      watchedMeshTotalPercent === "si" ? true : false;
    setShowMeshTotalPercentInput(showMeshTotalPercentInput);
  }, [watchedMeshTotalPercent]);

  // Muestro inputs de malla parcial si corresponde
  const watchedParcialMesh = watch("systemParcialMesh");
  useEffect(() => {
    setShowParcialMeshInputs(watchedParcialMesh === "si" ? true : false);
  }, [watchedParcialMesh]);

  // Muestro input de restriction si corresponde
  const watchedRestriction = watch("materialAreaRestrictions");
  useEffect(() => {
    setShowRestrictions(watchedRestriction === "si" ? true : false);
  }, [watchedRestriction]);

  // Evento de botón agregar - otros complementos
  const handleAddMaterial = () => {
    if (materialCount > 2) {
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
            options={materialsSelect}
            onSelectOption={(value) =>
              setSelectedMaterialOption(value, "select")
            }
          />
        </div>
      </div>
      {/* ------------- Info del material seleccionado ------------- */}
      <div className="row mb-3">
        {materialDataVisible && (
          <MaterialData material={selectedBaseMaterialDetail} />
        )}
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
            name="systemMeshTotalPercent"
            control={control}
            rules={{ required: "Seleccione una opción." }}
            label="Si / No"
            error={errors.systemMeshTotalPercent}
            options={SI_NO}
          />
        </div>
        {/* ------------- Nombre malla 100% ------------- */}
        {showMeshTotalPercentInput && (
          <div className="col-lg-6 col-sm-6">
            <CustomSelectField
              name="systemMeshTotalPercentName"
              control={control}
              rules={{ required: "Nombre malla requerido." }}
              label="Malla"
              error={errors.systemMeshTotalPercentName}
              options={formattedMeshSelect}
              onSelectOption={(value) => handleTotalMesh(value, "select")}
            />
          </div>
        )}
      </div>
      {/* ------------- Info malla 100% seleccionada ------------- */}
      <div className="row mt-3">
        {totalMeshUnityPriceVisible && showMeshTotalPercentInput && (
          <div className="col-lg-3 col-sm-4">
            <div className="material-data-container">
              <div className="data-div ml-2">
                <Typography fontWeight="700" variant="body1">
                  {`Precio: ${selectedTotalMeshPrice}`}
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
            <div className="col-lg-4 col-sm-6">
              <CustomSelectField
                name="systemParcialMeshName"
                control={control}
                rules={{ required: "Nombre de malla requerido." }}
                label="Malla"
                error={errors.systemParcialMeshName}
                options={formattedMeshSelect}
                onSelectOption={(value) => handlePartialMesh(value)}
              />
            </div>
            {/* ------------- Coeficiente por m2 ------------- */}
            <div className="col-lg-2 col-sm-6">
              <CustomTextField
                name="systemParcialMeshCoefficient"
                control={control}
                rules={{ required: "Coeficiente requerido." }}
                label="Coef. m2"
                variant="outlined"
                fullWidth
                type="number"
                error={errors.systemParcialMeshCoefficient}
                helperText={errors.systemParcialMeshCoefficient?.message}
              />
            </div>
            {/* ------------- Info malla parcial seleccionada ------------- */}
            {partialMeshUnityPriceVisible && showParcialMeshInputs && (
              <div className="col-lg-3 col-sm-4">
                <div className="material-data-container">
                  <div className="data-div ml-2">
                    <Typography fontWeight="700" variant="body1">
                      {`Precio: ${selectedPartialMeshPrice}`}
                    </Typography>
                  </div>
                </div>
              </div>
            )}
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
                options={materialsSelect}
                onSelectOption={(value) =>
                  handlePluginsMaterial(value, index, "select")
                }
              />
            </div>
            {/* ------------- Coeficiente por m2 (otros complementos) ------------- */}
            <div className="col-lg-2 col-sm-6">
              <CustomTextField
                name={`systemOthersPluginsMaterialCoefficient${index}`}
                control={control}
                label="Coef. m2"
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
          <div className="row mt-3">
            {pluginMaterialDataVisible && renderPluginMaterialDetails(index)}
          </div>
          {/* {pluginMaterialDataVisible && renderizameEsto()} */}
          {index < materialCount - 1 && <Divider className="mt-3" />}
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
      {/* ------------- Si | No | N/E ------------- */}
      <div className="row mt-3">
        <div className="col-lg-2 col-sm-6">
          <CustomSelectField
            name="materialAreaRestrictions"
            control={control}
            rules={{ required: "Seleccione una opción." }}
            label="Si / No / N/E"
            error={errors.materialAreaRestrictions}
            options={SI_NO_NE}
          />
        </div>
        {/* ------------- Campo restriction ------------- */}
        {showRestrictions && (
          <div className="col-lg-3 col-sm-6">
            <CustomTextField
              name="materialAreaRestrictionValue"
              control={control}
              rules={{ required: "Restricción por área requerida." }}
              label="Por área m2"
              variant="outlined"
              fullWidth
              type="number"
              error={errors.materialAreaRestrictionValue}
              helperText={errors.materialAreaRestrictionValue?.message}
            />
          </div>
        )}
      </div>

      <div className="row mt-3">
        <div className="col-lg-5 col-sm-6">
          <CustomTextField
            multiline
            minRows={3}
            name="materialAreaDescription"
            control={control}
            label="Otras restricciones"
            variant="outlined"
            fullWidth
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
