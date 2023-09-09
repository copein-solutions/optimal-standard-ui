import React, { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import { Divider, Button, Typography, InputAdornment, styled, TooltipProps, Tooltip, tooltipClasses } from "@mui/material";
import CustomTextField from "../../../components/TextField";
import CustomSelectField from "../../../components/customSelectField";
import CustomDivider from "../../../components/divider";
import MaterialData from "../../system/materialData/materialData";
import Toast from "../../../components/toast";
import InfoIcon from "@mui/icons-material/Info";

import { useForm } from "react-hook-form";
import "./systemForm.css";

// Services
import {
  getApplicationArea,
  getMaterials,
  getMaterialsByType,
  createSystem,
  updateSystem,
  getLaborCost,
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
import {
  calculatePricePerCoefficientParcialMesh,
  formatMaterialLaborCost,
  getTotalLaborCost,
  getUnitPriceBaseMaterialSystem,
  truncateDecimals,
} from "../../../utils/mathUtils";
import ListSystemComments from "../listSystemComments/listSystemComments";
import { useDispatch } from "react-redux";

import { initMaterialObject } from "../../../utils/initValueUtils";

export const SystemForm: React.FC<SystemFormProps> = ({
  data,
  isUpdateForm,
}) => {
  const {
    handleSubmit,
    watch,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm<SystemFormInputs>();

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [materialsSelect, setMaterialsSelect] = useState<Options[]>([]);
  const [globalMaterials, setGlobalMaterials] = useState<Material[]>([]);
  const [applicationAreas, setApplicationAreas] = useState([]);
  const [materialsTypeMesh, setMaterialsTypeMesh] = useState<Material[]>([]);
  const [formattedMeshSelect, setFormattedMeshSelect] = useState([]);
  const [showMeshTotalPercentInput, setShowMeshTotalPercentInput] =
    useState(false);
  const [showParcialMeshInputs, setShowParcialMeshInputs] = useState(false);
  const [showRestrictions, setShowRestrictions] = useState(false);
  const [materialCount, setMaterialCount] = useState(0);
  const [baseMaterialTotalPrice, setBaseMaterialTotalPrice] = useState(0);
  const [totalLaborCost, setTotalLaborCost] = useState(0);
  const [systemTotalPrice, setSystemTotalPrice] = useState(0);
  // VARIABLES GLOBALES
  const [laborCost, setLaborCost] = useState("");
  // MATERIAL BASE
  const [materialDataVisible, setMaterialDataVisible] = useState(false);

  const [selectedBaseMaterialDetail, setSelectedBaseMaterialDetail] =
    useState<BaseMaterial>(initMaterialObject);
  const [baseMaterialPrice, setBaseMaterialPrice] = useState("");
  const [baseMaterialLaborCost, setBaseMaterialLaborCost] = useState("");
  // MALLA 100%
  const [totalMeshUnityPriceVisible, setTotalMeshUnityPriceVisible] =
    useState(false);
  const [selectedTotalMeshPrice, setSelectedTotalMeshPrice] = useState("");
  const [selectedTotalMeshLaborCost, setSelectedTotalMeshLaborCost] =
    useState("");
  // MALLA PARCIAL
  const [partialMeshUnityPriceVisible, setPartialMeshUnityPriceVisible] =
    useState(false);
  const [selectedPartialMeshPrice, setSelectedPartialMeshPrice] =
    useState<string>("");
  const [
    selectedPartialMeshPricePerCoefficient,
    setSelectedPartialMeshPricePerCoefficient,
  ] = useState("");
  const [selectedParcialMeshLaborCost, setSelectedParcialMeshLaborCost] =
    useState("");
  // OTROS COMPLEMENTOS
  const [pluginMaterialDataVisible, setPluginMaterialDataVisible] =
    useState(false);
  const [
    selectedPluginMaterialPricePerCoefficient0,
    setSelectedPluginMaterialPricePerCoefficient0,
  ] = useState("");
  const [
    selectedPluginMaterialPricePerCoefficient1,
    setSelectedPluginMaterialPricePerCoefficient1,
  ] = useState("");
  const [
    selectedPluginMaterialPricePerCoefficient2,
    setSelectedPluginMaterialPricePerCoefficient2,
  ] = useState("");
  const [
    selectedPluginMaterialLaborCost0,
    setSelectedPluginMaterialLaborCost0,
  ] = useState("");
  const [
    selectedPluginMaterialLaborCost1,
    setSelectedPluginMaterialLaborCost1,
  ] = useState("");
  const [
    selectedPluginMaterialLaborCost2,
    setSelectedPluginMaterialLaborCost2,
  ] = useState("");

  const [selectedPluginMaterialDetail1, setSelectedPluginMaterialDetail1] =
    useState<BaseMaterial>(initMaterialObject);
  const [selectedPluginMaterialDetail2, setSelectedPluginMaterialDetail2] =
    useState<BaseMaterial>(initMaterialObject);
  const [selectedPluginMaterialDetail3, setSelectedPluginMaterialDetail3] =
    useState<BaseMaterial>(initMaterialObject);

  const navigator = useNavigate();
  const dispatch = useDispatch();

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
      totalPrice: baseMaterialTotalPrice,
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
      performance: data.baseMaterialPerformance,
    });

    if (data.systemMeshTotalPercent === "si") {
      constructionSystem.materials.push({
        id: data.systemMeshTotalPercentId,
        materialId: data.systemMeshTotalPercentName,
        typeOfUse: "TOTAL_MESH",
        performance: data.totalMeshPerformance,
      });
    }

    if (data.systemParcialMesh === "si") {
      constructionSystem.materials.push({
        id: data.systemParcialMeshId,
        materialId: data.systemParcialMeshName,
        typeOfUse: "PARTIAL_MESH",
        coefficient: data.systemParcialMeshCoefficient,
        materialDescription: data.systemPartialMeshDescription,
        performance: data.partialMeshPerformance,
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
        performance: data[`systemOthersPluginsPerformance${i}`],
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
      setBaseMaterialTotalPrice(Number(data.totalPrice));
      setValue("totalConsumption", data.totalConsumption);
      setValue("supportConditions", data.supportConditions);
      setValue("baseConditions", data.baseConditions);
      setSelectedBaseMaterialDetail(data.materials[0].material);
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
          setValue("baseMaterialPerformance", m.performance);
          handleBaseMaterial(m.material.id, "isUpdate");
        } else if (m.typeOfUse === "TOTAL_MESH") {
          setValue("systemMeshTotalPercent", "si");
          setValue("systemMeshTotalPercentId", m.id);
          setValue("systemMeshTotalPercentName", m.material.id);
          setValue("totalMeshPerformance", m.performance);
          handleTotalMesh(Number(m.material.id), "isUpdate");
          setSelectedTotalMeshPrice(String(m.material.unitPrice));
        } else if (m.typeOfUse === "PARTIAL_MESH") {
          setValue("systemParcialMesh", "si");
          setValue("systemParcialMeshId", m.id);
          setValue("systemParcialMeshName", m.material.id);
          setValue("systemParcialMeshCoefficient", m.coefficient);
          setValue("systemPartialMeshDescription", m.materialDescription);
          setValue("partialMeshPerformance", m.performance);
          setSelectedPartialMeshPrice(String(m.material.unitPrice));
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
          setValue(
            `systemOthersPluginsPerformance${pluginMaterialC}`,
            m.performance
          );
          pluginMaterialC++;
        }
      });
      dispatch({ type: "SET_COMMENTS", payload: data.comments });
    }
  }, [setValue, data]);

  useEffect(() => {
    async function fetchData() {
      // Obtengo campos de aplicación del back
      const applicationAreasResponse = await getApplicationArea();
      if (applicationAreasResponse && applicationAreasResponse.data) {
        const backendApplicationAreas = applicationAreasResponse.data;
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

      // Obtengo materiales del back
      const materialsResponse = await getMaterials();
      if (materialsResponse && materialsResponse.data) {
        const backendMaterials = materialsResponse.data;
        const formattedMaterials = backendMaterials.map(
          (material: { id: any; product: any; brand: any }) => ({
            value: material.id,
            label: `${material.brand} - ${material.product}`,
          })
        );
        setMaterialsSelect(formattedMaterials);
        setGlobalMaterials(backendMaterials);
      } else {
        handleOpenToast("No se pueden recuperar materiales del back");
      }

      // Obtengo el costo laboral del back
      const laborCostResponse = await getLaborCost();
      if (laborCostResponse && laborCostResponse.data) {
        const laborCost = laborCostResponse.data;
        setLaborCost(laborCost);
      } else {
        handleOpenToast("No se puede recuperar el costo laboral del back");
      }
    }

    fetchData();
  }, []);

  const detailsMapper = (material: Material) => {
    return {
      brand: material.brand,
      component: material.component,
      currency: material.currency,
      presentationPrice: material.presentationPrice,
      presentationQuantity: material.presentationQuantity,
      presentationUnit: material.presentationUnit,
      unitPrice: material.unitPrice,
      type: material.type,
      priceDate: material.priceDate,
      potLife: material.potLife ? String(material.potLife) : "-",
      minApplicableTemp: material.minApplicableTemp
        ? String(material.minApplicableTemp)
        : "-",
    };
  };

  const setBaseMaterialDetail = (material: Material) => {
    setSelectedBaseMaterialDetail(detailsMapper(material));
  };

  const updateMaterialDetail1 = (material: Material) => {
    setSelectedPluginMaterialDetail1(detailsMapper(material));
  };

  const updateMaterialDetail2 = (material: Material) => {
    setSelectedPluginMaterialDetail2(detailsMapper(material));
  };

  const updateMaterialDetail3 = (material: Material) => {
    setSelectedPluginMaterialDetail3(detailsMapper(material));
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

  function handleBaseMaterial(value: number, origin: string) {
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

  // Obtengo precio unitario malla 100 %
  function handleTotalMesh(value: number, origin: string) {
    setTotalMeshUnityPriceVisible(true);
    const selectedMesh = materialsTypeMesh.find((item) => item.id === value);
    if (selectedMesh) {
      const price = truncateDecimals(Number(selectedMesh.unitPrice), 2);
      setSelectedTotalMeshPrice(String(price));
    }
  }

  // Obtengo precio unitario malla parcial
  function handlePartialMesh(value: number) {
    setPartialMeshUnityPriceVisible(true);
    const selectedMesh = materialsTypeMesh.find((item) => item.id === value);
    if (selectedMesh) {
      const unitPrice = truncateDecimals(Number(selectedMesh.unitPrice), 2);
      setSelectedPartialMeshPrice(String(unitPrice));
      const pricePerCoefficient = calculatePricePerCoefficientParcialMesh(
        Number(systemParcialMeshCoefficientValue),
        unitPrice
      );
      setSelectedPartialMeshPricePerCoefficient(String(pricePerCoefficient));
    }
  }

  function handlePluginsMaterial(value: number, index: number, origin: string) {
    setPluginMaterialDataVisible(true);
    setBaseMaterialTotalPrice(0);
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
    let materialData;
    if (index === 0) {
      materialData = selectedPluginMaterialDetail1;
    } else if (index === 1) {
      materialData = selectedPluginMaterialDetail2;
    } else if (index === 2) {
      materialData = selectedPluginMaterialDetail3;
    }
    return <MaterialData material={materialData} />;
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
    if (watchedMeshTotalPercent === "si") {
      setShowMeshTotalPercentInput(true);
    } else {
      setShowMeshTotalPercentInput(false);
      setTotalMeshUnityPriceVisible(false);
      setValue("systemMeshTotalPercentName", "");
      setValue("totalMeshPerformance", "");
      setSelectedTotalMeshPrice("");
    }
  }, [watchedMeshTotalPercent]);

  // Muestro inputs de malla parcial si corresponde
  const watchedParcialMesh = watch("systemParcialMesh");
  useEffect(() => {
    if (watchedParcialMesh === "si") {
      setShowParcialMeshInputs(true);
    } else {
      setShowParcialMeshInputs(false);
      setPartialMeshUnityPriceVisible(false);
      setValue("systemParcialMeshName", "");
      setValue("systemParcialMeshCoefficient", "");
      setValue("partialMeshPerformance", "");
      setSelectedPartialMeshPricePerCoefficient("");
    }
  }, [watchedParcialMesh]);

  // Muestro input de restriction si corresponde
  const watchedRestriction = watch("materialAreaRestrictions");
  useEffect(() => {
    setShowRestrictions(watchedRestriction === "si" ? true : false);
  }, [watchedRestriction]);

  const calculateBaseMaterialTotalPrice = () => {
    const formValues = getValues();

    const price = getUnitPriceBaseMaterialSystem(
      formValues,
      selectedBaseMaterialDetail.unitPrice,
      selectedTotalMeshPrice,
      selectedPartialMeshPrice,
      selectedPluginMaterialDetail1.unitPrice,
      selectedPluginMaterialDetail2.unitPrice,
      selectedPluginMaterialDetail3.unitPrice
    );

    setBaseMaterialTotalPrice(price);
  };

  // Cuando cambia un input implicado en el precio unitario del sistema,
  // vuelve a calcular el systemUnitPrice
  const watchedFields = watch([
    "totalConsumption",
    "systemParcialMeshCoefficient",
    "systemOthersPluginsMaterialCoefficient0",
    "systemOthersPluginsMaterialCoefficient1",
    "systemOthersPluginsMaterialCoefficient2",
  ]);
  useEffect(() => {
    if (watchedFields) {
      calculateBaseMaterialTotalPrice();
    }
  }, [watchedFields]);

  // Costo material base
  const totalConsumptionWatched = watch("totalConsumption");
  useEffect(() => {
    const baseMaterialPrice = selectedBaseMaterialDetail.unitPrice;
    const price = Number(baseMaterialPrice) * Number(totalConsumptionWatched);
    const stringPrice = String(truncateDecimals(price, 2));
    setBaseMaterialPrice(stringPrice);
  }, [totalConsumptionWatched, selectedBaseMaterialDetail.unitPrice]);

  //#region CALCULO DE COSTO MANO DE OBRA
  //Costo mano de obra material base
  const baseMaterialPerformanceWatched = watch("baseMaterialPerformance");
  const layersWatched = watch("layers");
  useEffect(() => {
    const totalCost =
      Number(baseMaterialPerformanceWatched) *
      Number(layersWatched) *
      Number(laborCost);
    const stringTotalCost = String(truncateDecimals(totalCost, 2));
    setBaseMaterialLaborCost(stringTotalCost);
  }, [baseMaterialPerformanceWatched, layersWatched, laborCost]);

  // Costo mano de obra malla 100%
  const totalMeshPerformanceWatched = watch("totalMeshPerformance");
  useEffect(() => {
    formatMaterialLaborCost(
      laborCost,
      totalMeshPerformanceWatched,
      setSelectedTotalMeshLaborCost
    );
  }, [totalMeshPerformanceWatched]);

  // Costo mano de obra malla parcial
  const partialMeshPerformanceWatched = watch("partialMeshPerformance");
  useEffect(() => {
    formatMaterialLaborCost(
      laborCost,
      partialMeshPerformanceWatched,
      setSelectedParcialMeshLaborCost
    );
  }, [partialMeshPerformanceWatched]);

  // Costo mano de obra otros complementos
  const systemOthersPluginsPerformanceWatched0 = watch(
    "systemOthersPluginsPerformance0"
  );
  useEffect(() => {
    formatMaterialLaborCost(
      laborCost,
      systemOthersPluginsPerformanceWatched0,
      setSelectedPluginMaterialLaborCost0
    );
  }, [systemOthersPluginsPerformanceWatched0]);

  const systemOthersPluginsPerformanceWatched1 = watch(
    "systemOthersPluginsPerformance1"
  );
  useEffect(() => {
    formatMaterialLaborCost(
      laborCost,
      systemOthersPluginsPerformanceWatched1,
      setSelectedPluginMaterialLaborCost1
    );
  }, [systemOthersPluginsPerformanceWatched1]);

  const systemOthersPluginsPerformanceWatched2 = watch(
    "systemOthersPluginsPerformance2"
  );
  useEffect(() => {
    formatMaterialLaborCost(
      laborCost,
      systemOthersPluginsPerformanceWatched2,
      setSelectedPluginMaterialLaborCost2
    );
  }, [systemOthersPluginsPerformanceWatched2]);

  // si cambia un costo de mano de obra,
  //se calcula nuevamente el costo total de mano de obra
  const watchedPerformanceFields = watch([
    "baseMaterialPerformance",
    "totalMeshPerformance",
    "partialMeshPerformance",
    "systemOthersPluginsPerformance0",
    "systemOthersPluginsPerformance1",
    "systemOthersPluginsPerformance2",
  ]);
  useEffect(() => {
    if (watchedPerformanceFields) {
      const price = getTotalLaborCost(
        Number(baseMaterialLaborCost),
        Number(selectedTotalMeshLaborCost),
        Number(selectedParcialMeshLaborCost),
        Number(selectedPluginMaterialLaborCost0),
        Number(selectedPluginMaterialLaborCost1),
        Number(selectedPluginMaterialLaborCost2)
      );
      setTotalLaborCost(price);
    }
  }, [watchedPerformanceFields]);

  //#endregion

  // Costo Total del sistema
  useEffect(() => {
    const price = baseMaterialTotalPrice + totalLaborCost;
    setSystemTotalPrice(truncateDecimals(price, 2));
  }, [baseMaterialTotalPrice, totalLaborCost]);

  // Precio por m² de malla parcial
  const systemParcialMeshCoefficientValue = watch(
    "systemParcialMeshCoefficient"
  );
  useEffect(() => {
    const price = calculatePricePerCoefficientParcialMesh(
      Number(systemParcialMeshCoefficientValue),
      Number(selectedPartialMeshPrice)
    );
    setSelectedPartialMeshPricePerCoefficient(String(price));
  }, [systemParcialMeshCoefficientValue]);

  // Precio por m² de material complementario 1
  const pluginMaterial1CoefficientValue = watch(
    "systemOthersPluginsMaterialCoefficient0"
  );
  useEffect(() => {
    const price = calculatePricePerCoefficientParcialMesh(
      Number(pluginMaterial1CoefficientValue),
      Number(selectedPluginMaterialDetail1.unitPrice)
    );
    setSelectedPluginMaterialPricePerCoefficient0(String(price));
  }, [
    pluginMaterial1CoefficientValue,
    selectedPluginMaterialDetail1.unitPrice,
  ]);

  // Precio por m² de material complementario 2
  const pluginMaterial2CoefficientValue = watch(
    "systemOthersPluginsMaterialCoefficient1"
  );
  useEffect(() => {
    const price = calculatePricePerCoefficientParcialMesh(
      Number(pluginMaterial2CoefficientValue),
      Number(selectedPluginMaterialDetail2.unitPrice)
    );
    setSelectedPluginMaterialPricePerCoefficient1(String(price));
  }, [
    pluginMaterial2CoefficientValue,
    selectedPluginMaterialDetail2.unitPrice,
  ]);

  // Precio por m² de material complementario 3
  const pluginMaterial3CoefficientValue = watch(
    "systemOthersPluginsMaterialCoefficient2"
  );
  useEffect(() => {
    const price = calculatePricePerCoefficientParcialMesh(
      Number(pluginMaterial3CoefficientValue),
      Number(selectedPluginMaterialDetail3.unitPrice)
    );
    setSelectedPluginMaterialPricePerCoefficient2(String(price));
  }, [
    pluginMaterial3CoefficientValue,
    selectedPluginMaterialDetail3.unitPrice,
  ]);

  // Evento de botón agregar - otros complementos
  const handleAddMaterial = () => {
    if (materialCount > 2) {
      handleOpenToast(
        "No se pueden agregar más de tres materiales complementarios"
      );
    } else {
      setMaterialCount((prevCount) => prevCount + 1);
    }
    if (materialCount === 0) setSelectedPluginMaterialPricePerCoefficient0("0");
    if (materialCount === 1) setSelectedPluginMaterialPricePerCoefficient1("0");
    if (materialCount === 2) setSelectedPluginMaterialPricePerCoefficient2("0");
  };

  const resetDynamicInputs = (index: number) => {
    setValue(`systemOthersPluginsMaterials${index}`, "");
    setValue(`systemOthersPluginsMaterialCoefficient${index}`, "");
    setValue(`systemOthersPluginsMaterialDescription${index}`, "");
    setValue(`systemOthersPluginsMaterialCoefficientDescription${index}`, "");
    setValue(`systemOthersPluginsMaterialCoefficient${index}`, "");
    setValue(`systemOthersPluginsMaterialCoefficient${index}`, "");
    setValue(`systemOthersPluginsMaterialCoefficient${index}`, "");
    setValue(`systemOthersPluginsPerformance${index}`, "");
  };

  // Evento de botón eliminar - otros complementos
  const handleDeleteMaterial = () => {
    if (materialCount === 0) {
      handleOpenToast("No hay materiales para eliminar");
    } else {
      if (materialCount === 1) {
        setSelectedPluginMaterialDetail1(initMaterialObject);
        setSelectedPluginMaterialLaborCost0("");
        resetDynamicInputs(materialCount - 1);
      }
      if (materialCount === 2) {
        setSelectedPluginMaterialDetail2(initMaterialObject);
        setSelectedPluginMaterialLaborCost1("");
        resetDynamicInputs(materialCount - 1);
      }
      if (materialCount === 3) {
        setSelectedPluginMaterialDetail3(initMaterialObject);
        setSelectedPluginMaterialLaborCost2("");
        resetDynamicInputs(materialCount - 1);
      }

      setMaterialCount((prevCount) => Math.max(prevCount - 1, 0));
    }
  };

  // #region TOOLTIP
  const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 600,
    },
  });

  const pluginMaterialPerformanceExplanation = (
    <CustomWidthTooltip
      title={
        <span style={{ fontSize: "1rem", maxWidth: "600px" }}>
          ACÁ VA A IR EL TEXTO PROPORCIONADO POR GONZALO
        </span>
      }
      placement="bottom"
    >
      <InfoIcon />
    </CustomWidthTooltip>
  );
  //#endregion


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* ------------- Campo de aplicación ------------- */}
      <div className="row mb-3">
        <div className="col-lg-7 col-sm-9">
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
      {/* ------------- Material base ------------- */}
      <div className="row mb-3">
        <div className="col-lg-5 col-sm-6">
          <CustomSelectField
            name="systemMaterial"
            control={control}
            rules={{ required: "Material requerido." }}
            label="Material"
            error={errors.systemMaterial}
            options={materialsSelect}
            onSelectOption={(value) => handleBaseMaterial(value, "select")}
          />
        </div>
        {/* ------------- Costo materiales ------------- */}
        <div className="col-lg-2 col-sm-3 mb-3 d-flex">
          <CustomTextField
            name="systemTotalPrice"
            className="readOnly total-cost"
            control={control}
            label="Costo materiales"
            value={baseMaterialTotalPrice}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography>$/m²</Typography>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              onClick: (e) => e.preventDefault(),
            }}
          />
        </div>
        {/* ------------- Costo mano de obra ------------- */}
        <div className="col-lg-2 col-sm-3 mb-3 d-flex">
          <CustomTextField
            name="systemTotalPrice"
            className="readOnly total-cost"
            control={control}
            label="Costo mano de obra"
            value={totalLaborCost}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography>$/m²</Typography>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              onClick: (e) => e.preventDefault(),
            }}
          />
        </div>
        {/* ------------- Costo total ------------- */}
        <div className="col-lg-2 col-sm-3 mb-3 d-flex">
          <CustomTextField
            name="systemTotalPrice"
            className="readOnly total-cost custom-color"
            control={control}
            label="Costo total"
            value={systemTotalPrice}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography>$/m²</Typography>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              onClick: (e) => e.preventDefault(),
            }}
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
        <div className="col-lg-2 col-sm-2">
          <CustomTextField
            name="totalConsumption"
            control={control}
            rules={{ required: "Consumo total requerido." }}
            label="Consumo total kg/m²"
            variant="outlined"
            fullWidth
            type="number"
            inputProps={{
              min: 0,
            }}
            error={errors.totalConsumption}
            helperText={errors.totalConsumption?.message}
          />
        </div>
        {/* ------------- Rendimiento (material base) ------------- */}
        <div className="col-lg-2 col-sm-2">
          <CustomTextField
            name="baseMaterialPerformance"
            control={control}
            rules={{ required: "Rendimiento requerido." }}
            label="Rendimiento hrs/m²"
            variant="outlined"
            fullWidth
            type="number"
            error={errors.baseMaterialPerformance}
            helperText={errors.baseMaterialPerformance?.message}
          />
        </div>
        {/* ------------- Cantidad de manos ------------- */}
        <div className="col-lg-2 col-sm-2">
          <CustomTextField
            name="layers"
            control={control}
            rules={{ required: "Cantidad de manos requerida." }}
            label="Cantidad de manos"
            variant="outlined"
            fullWidth
            type="number"
            inputProps={{
              min: 0,
            }}
            error={errors.layers}
            helperText={errors.layers?.message}
          />
        </div>
        {/* ------------- Modo de aplicación ------------- */}
        <div className="col-lg-2 col-sm-3">
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
        <div className="col-lg-2 col-sm-3">
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
      {/* ------------- Info bloque Aplicación------------- */}
      <div className="row mt-3">
        <div className="col-lg-4 col-sm-8">
          <div className="material-data-container">
            <div className="data-div ml-2">
              <Typography mr={1} variant="body1">
                Costo mat.: $/m²
              </Typography>
              <Typography mr={5} fontWeight="700" variant="body1">
                {baseMaterialPrice}
              </Typography>
              <Typography mr={1} variant="body1">
                Costo MO: $/m²
              </Typography>
              <Typography fontWeight="700" variant="body1">
                {baseMaterialLaborCost}
              </Typography>
            </div>
          </div>
        </div>
      </div>
      {/* ------------- Mallas 100% ------------- */}
      <CustomDivider text="Mallas 100%" />
      {/* ------------- Si / No ------------- */}
      <div className="row mt-3">
        <div className="col-lg-2 col-sm-2">
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
          <>
            <div className="col-lg-6 col-sm-7">
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
            {/* ------------- Rendimiento malla 100% ------------- */}
            <div className="col-lg-2 col-sm-3">
              <CustomTextField
                name="totalMeshPerformance"
                control={control}
                rules={{ required: "Rendimiento requerido." }}
                label="Rendimiento hrs/m²"
                variant="outlined"
                fullWidth
                type="number"
                error={errors.totalMeshPerformance}
                helperText={errors.totalMeshPerformance?.message}
              />
            </div>
          </>
        )}
      </div>
      {/* ------------- Info malla 100% seleccionada ------------- */}
      <div className="row mt-3">
        {totalMeshUnityPriceVisible && showMeshTotalPercentInput && (
          <div className="col-lg-4 col-sm-8">
            <div className="material-data-container">
              <div className="data-div ml-2">
                <Typography mr={1} variant="body1">
                  Costo mat.: $/m²
                </Typography>
                <Typography fontWeight="700" variant="body1">
                  {selectedTotalMeshPrice}
                </Typography>
                <Typography ml={5} variant="body1">
                  Costo MO: $/m²
                </Typography>
                <Typography ml={1} fontWeight="700" variant="body1">
                  {selectedTotalMeshLaborCost}
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
        <div className="col-lg-2 col-sm-2">
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
            {/* ------------- Coeficiente por m² ------------- */}
            <div className="col-lg-2 col-sm-2">
              <CustomTextField
                name="systemParcialMeshCoefficient"
                control={control}
                rules={{ required: "Coeficiente requerido." }}
                label="Coef. m²"
                variant="outlined"
                fullWidth
                type="number"
                inputProps={{
                  min: 0,
                }}
                error={errors.systemParcialMeshCoefficient}
                helperText={errors.systemParcialMeshCoefficient?.message}
              />
            </div>
            {/* ------------- Rendimiento malla parcial ------------- */}
            <div className="col-lg-2 col-sm-2">
              <CustomTextField
                name="partialMeshPerformance"
                control={control}
                rules={{ required: "Rendimiento requerido." }}
                label="Rendimiento hrs/ml"
                variant="outlined"
                fullWidth
                type="number"
                error={errors.partialMeshPerformance}
                helperText={errors.partialMeshPerformance?.message}
              />
            </div>
          </>
        )}
      </div>
      <div className="row mt-3">
        {/* ------------- Info malla parcial seleccionada ------------- */}
        {partialMeshUnityPriceVisible && showParcialMeshInputs && (
          <div className="col-lg-6 col-sm-11 mt-16">
            <div className="material-data-container">
              <div className="data-div ml-2">
                <Typography fontWeight="500" mr={1} variant="body1">
                  Costo mat.: $/ml
                </Typography>
                <Typography fontWeight="700" variant="body1">
                  {selectedPartialMeshPrice}
                </Typography>
                <Typography fontWeight="500" ml={5} mr={1} variant="body1">
                  Costo mat.: $/m²
                </Typography>
                <Typography fontWeight="700" variant="body1">
                  {selectedPartialMeshPricePerCoefficient}
                </Typography>
                <Typography fontWeight="500" ml={5} mr={1} variant="body1">
                  Costo MO: $/m²
                </Typography>
                <Typography fontWeight="700" variant="body1">
                  {selectedParcialMeshLaborCost}
                </Typography>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* ------------- descripción coef malla parcial ------------- */}
      {showParcialMeshInputs && (
        <div className="row mt-3">
          <div className="col-lg-12 col-sm-12">
            <CustomTextField
              multiline
              minRows={2}
              name="systemPartialMeshDescription"
              control={control}
              label="Descripción coef. m²"
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
            <div className="col-lg-5 col-sm-6">
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
            {/* ------------- Coeficiente por m² (otros complementos) ------------- */}
            <div className="col-lg-2 col-sm-3">
              <CustomTextField
                name={`systemOthersPluginsMaterialCoefficient${index}`}
                control={control}
                label="Coef. m²"
                variant="outlined"
                fullWidth
                type="number"
                inputProps={{
                  min: 0,
                }}
                rules={{ required: "Coeficiente requerido." }}
                error={errors[`systemOthersPluginsMaterialCoefficient${index}`]}
                helperText={
                  errors[`systemOthersPluginsMaterialCoefficient${index}`]
                    ?.message
                }
              />
            </div>
            {/* ------------- Rendimiento (otros complementos) ------------- */}
            <div className="col-lg-2 col-sm-3">
              <CustomTextField
                name={`systemOthersPluginsPerformance${index}`}
                control={control}
                rules={{ required: "Rendimiento requerido." }}
                label="Rendimiento hrs/m²"
                variant="outlined"
                fullWidth
                type="number"
                error={errors[`systemOthersPluginsPerformance${index}`]}
                helperText={
                  errors[`systemOthersPluginsPerformance${index}`]?.message
                }
                InputProps={{
                  readOnly: true,
                  startAdornment: "$",
                  endAdornment: (
                    <InputAdornment sx={{ marginRight: "5px" }} position="end">
                      {pluginMaterialPerformanceExplanation}
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="col-lg-3 col-sm-8 mt-16">
              {/* ------------- Info (otros complementos) ------------- */}
              <div className="material-data-container">
                <div className="data-div ml-2">
                  <Typography variant="body1" mr={1}>
                    Costo mat.: $/m²
                  </Typography>
                  <Typography fontWeight="700" variant="body1">
                    {index === 0
                      ? selectedPluginMaterialPricePerCoefficient0
                      : index === 1
                      ? selectedPluginMaterialPricePerCoefficient1
                      : selectedPluginMaterialPricePerCoefficient2}
                  </Typography>
                </div>
                <div className="data-div ml-2">
                  <Typography variant="body1" mr={1}>
                    Costo MO: $/m²
                  </Typography>
                  <Typography fontWeight="700" variant="body1">
                    {index === 0
                      ? selectedPluginMaterialLaborCost0
                      : index === 1
                      ? selectedPluginMaterialLaborCost1
                      : selectedPluginMaterialLaborCost2}
                  </Typography>
                </div>
              </div>
            </div>
            {/* ------------- Descripción complemento (otros complementos) ------------- */}
            <div className="col-lg-6 col-sm-12 mt-3">
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
            {/* ------------- Descripción coef m² (otros complementos) ------------- */}
            <div className="col-lg-6 col-sm-12 mt-3">
              <CustomTextField
                multiline
                minRows={3}
                name={`systemOthersPluginsMaterialCoefficientDescription${index}`}
                control={control}
                label="Descripción coeficiente m²"
                variant="outlined"
                fullWidth
              />
            </div>
          </div>
          <div className="row mt-3">
            {pluginMaterialDataVisible && renderPluginMaterialDetails(index)}
          </div>
          {index < materialCount - 1 && <Divider className="mt-3" />}
        </div>
      ))}
      <CustomDivider text="Sistema de capas" />
      <div className="row mt-3">
        {/* ------------- Condiciones de base ------------- */}
        <div className="col-lg-12 col-sm-12">
          <CustomTextField
            name="baseConditions"
            multiline
            minRows={2}
            control={control}
            rules={{ required: "Condiciones de base requeridas." }}
            label="Condiciones de base"
            variant="outlined"
            fullWidth
            error={errors.baseConditions}
            helperText={errors.baseConditions?.message}
          />
        </div>
        {/* ------------- Condiciones como soporte ------------- */}
        <div className="col-lg-12 col-sm-12 mt-3">
          <CustomTextField
            name="supportConditions"
            multiline
            minRows={2}
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
        <div className="col-lg-3 col-sm-3">
          <CustomSelectField
            name="materialAreaRestrictions"
            control={control}
            rules={{ required: "Seleccione una opción." }}
            label="Si / No / N/E"
            error={errors.materialAreaRestrictions}
            options={SI_NO_NE}
          />
        </div>
        {/* ------------- Por área m² ------------- */}
        {showRestrictions && (
          <div className="col-lg-3 col-sm-6">
            <CustomTextField
              name="materialAreaRestrictionValue"
              control={control}
              rules={{ required: "Restricción por área requerida." }}
              label="Por área m²"
              variant="outlined"
              fullWidth
              type="number"
              inputProps={{
                min: 0,
              }}
              error={errors.materialAreaRestrictionValue}
              helperText={errors.materialAreaRestrictionValue?.message}
            />
          </div>
        )}
      </div>
      {/* ------------- Otras restricciones ------------- */}
      <div className="row mt-3">
        <div className="col-lg-12 col-sm-12">
          <CustomTextField
            multiline
            minRows={2}
            name="materialAreaDescription"
            control={control}
            label="Otras restricciones"
            variant="outlined"
            fullWidth
          />
        </div>
      </div>
      {/* ------------- Comentarios sobre el sistema ------------- */}
      {isUpdateForm && <CustomDivider text="Comentarios" />}
      {isUpdateForm && <ListSystemComments id={data?.id} />}
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
