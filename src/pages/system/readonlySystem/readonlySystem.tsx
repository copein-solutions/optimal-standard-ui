import { ReactNode, useEffect, useState } from "react";
import {
  Divider,
  Button,
  Typography,
  InputAdornment,
  Tooltip,
  TooltipProps,
  tooltipClasses,
  styled,
  TextField,
} from "@mui/material";
import CustomTextField from "../../../components/TextField";
import CustomSelectField from "../../../components/customSelectField";
import CustomDivider from "../../../components/divider";
import MaterialData from "../../system/materialData/materialData";
import { MainContainer } from "../../../components/mainContainer/MainContainer";

import { useForm } from "react-hook-form";
import "./readonlySystem.css";

// Services
import { getSystemByID } from "../../../services/ApiService";

// Constants
import { SYSTEM_LIST } from "../../../utils/constants";

// Interfaces
import { useNavigate, useParams } from "react-router-dom";
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
  getUnitPriceBaseMaterialSystem,
  truncateDecimals,
} from "../../../utils/mathUtils";
import ListSystemComments from "../listSystemComments/listSystemComments";
import { useDispatch } from "react-redux";

import { initMaterialObject } from "../../../utils/initValueUtils";

const ReadonlySystem = () => {
  const {
    watch,
    setValue,
    control,
    getValues,
    formState: { errors },
  } = useForm<SystemFormInputs>();

  const { id } = useParams();

  const [formData, setFormData] = useState<SystemFormInputs>();
  const [applicationArea, setApplicationAreaName] = useState("");
  const [material, setMaterial] = useState("");
  const [applicationMode, setApplicationMode] = useState("");
  const [cured, setCured] = useState("");
  const [restrictions, setRestrictions] = useState("");

  const [showMeshTotalPercentInput, setShowMeshTotalPercentInput] =
    useState(false);
  const [showParcialMeshInputs, setShowParcialMeshInputs] = useState(false);
  const [showRestrictions, setShowRestrictions] = useState(false);
  const [materialCount, setMaterialCount] = useState(0);
  const [systemTotalPrice, setSystemTotalPrice] = useState(0);
  // MATERIAL BASE
  // const [baseMaterialUnitPrice, setBaseMaterialUnitPrice] = useState("");
  const [materialDataVisible, setMaterialDataVisible] = useState(false);
  const [selectedBaseMaterialDetail, setSelectedBaseMaterialDetail] =
    useState<BaseMaterial>(initMaterialObject);
  // MALLA 100%
  const [totalMeshUnityPriceVisible, setTotalMeshUnityPriceVisible] =
    useState(false);
  const [selectedTotalMeshPrice, setSelectedTotalMeshPrice] = useState("");
  const [systemMeshTotalPercentName, setSystemMeshTotalPercentName] =
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
  const [systemParcialMesh, setSystemParcialMesh] = useState(false);
  const [systemParcialMeshName, setSystemParcialMeshName] = useState("");
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
  const [selectedPluginMaterialDetail1, setSelectedPluginMaterialDetail1] =
    useState<BaseMaterial>(initMaterialObject);
  const [selectedPluginMaterialDetail2, setSelectedPluginMaterialDetail2] =
    useState<BaseMaterial>(initMaterialObject);
  const [selectedPluginMaterialDetail3, setSelectedPluginMaterialDetail3] =
    useState<BaseMaterial>(initMaterialObject);

  const navigator = useNavigate();
  const dispatch = useDispatch();

  function capitalizeFirstLetter(inputString: string): string {
    if (inputString.length === 0) {
      return inputString; // Devuelve el string original si está vacío.
    }

    const firstLetter = inputString.substring(0, 1).toUpperCase();
    const restOfString = inputString.substring(1).toLowerCase();

    return firstLetter + restOfString;
  }

  useEffect(() => {
    // Carga los datos del JSON
    async function fetchData() {
      const response = await getSystemByID(Number(id));
      if (response?.data.error || response === undefined) {
        alert(
          "Error: " + !response?.data.message
            ? "Network error"
            : response.data.message
        );
      } else {
        setFormData(response.data);
      }
    }
    fetchData();
  }, []);

  const handleReturn = () => {
    navigator(SYSTEM_LIST);
  };

  // Pre cargo formulario en caso de ser update
  useEffect(() => {
    if (formData) {
      console.log("formData", formData);

      setSystemTotalPrice(truncateDecimals(Number(formData.totalPrice), 2));
      setApplicationAreaName(String(formData.applicationArea.name));
      const material = `${formData?.materials[0].material.product} - ${formData?.materials[0].material.brand}`;
      setMaterial(material);
      setApplicationMode(capitalizeFirstLetter(formData.applicationMode));
      setCured(formData.cured ? "Si" : "No");
      setValue("supportConditions", formData.supportConditions);
      setValue("layers", formData.layers);
      setValue("totalConsumption", formData.totalConsumption);
      setValue("baseConditions", formData.baseConditions);
      setSelectedBaseMaterialDetail(formData.materials[0].material);

      setValue("materialAreaDescription", formData.materialAreaDescription);
      setValue("applicationAreaId", formData.applicationArea.id);
      setValue("applicationMode", formData.applicationMode);
      setValue(
        "materialAreaRestrictionValue",
        formData.materialAreaRestrictions
      );
      if (
        formData.materialAreaRestrictions !== null &&
        formData.materialAreaRestrictions !== "n/e"
      ) {
        setValue("materialAreaRestrictions", "Si");
        setShowRestrictions(true);
      } else {
        setValue("materialAreaRestrictions", formData.materialAreaRestrictions);
        setShowRestrictions(false);
      }

      if (formData.materialAreaRestrictions === null) {
        setRestrictions("No");
        setShowRestrictions(false);
      } else if (formData.materialAreaRestrictions === "n/e") {
        setRestrictions("No especifica");
        setShowRestrictions(false);
      } else {
        setRestrictions("Si");
        setShowRestrictions(true);
      }

      let pluginMaterialC = 0;
      formData.materials?.map((m: any) => {
        if (m.typeOfUse === "BASE") {
        } else if (m.typeOfUse === "TOTAL_MESH") {
          setSystemMeshTotalPercentName(
            `${m.material.brand} - ${m.material.product}`
          );
          setTotalMeshUnityPriceVisible(true);
          setShowMeshTotalPercentInput(true);
          setSelectedTotalMeshPrice(String(m.material.unitPrice));
        } else if (m.typeOfUse === "PARTIAL_MESH") {
          setSystemParcialMesh(true);
          setSystemParcialMeshName(
            `${m.material.brand} - ${m.material.product}`
          );
          setValue("systemParcialMeshCoefficient", m.coefficient);
          setValue("systemPartialMeshDescription", m.materialDescription);
          setSelectedPartialMeshPrice(String(m.material.unitPrice));
        } else if (m.typeOfUse === "PLUGIN_MATERIAL") {
          handleAddMaterial();
          setValue("systemOthersPluginsMaterialsId" + pluginMaterialC, m.id);
          setValue(
            `systemOthersPluginsMaterials${pluginMaterialC}`,
            `${m.material.brand} - ${m.material.product}`
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
          handlePluginsMaterial(Number(m.material.id), pluginMaterialC);
          const price = calculatePricePerCoefficientParcialMesh(
            Number(m.coefficient),
            Number(m.material.unitPrice)
          );
          if (pluginMaterialC === 0)
            setSelectedPluginMaterialPricePerCoefficient0(String(price));
          if (pluginMaterialC === 1)
            setSelectedPluginMaterialPricePerCoefficient1(String(price));
          if (pluginMaterialC === 2)
            setSelectedPluginMaterialPricePerCoefficient2(String(price));
          pluginMaterialC++;
        }
      });
      dispatch({ type: "SET_COMMENTS", payload: formData.comments });
    }
  }, [setValue, formData]);

  function handlePluginsMaterial(value: number, index: number) {
    setPluginMaterialDataVisible(true);
    const typeOfUseMaterial = formData?.materials.find(
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
  }

  // Evento de botón agregar - otros complementos
  const handleAddMaterial = () => {
    setMaterialCount((prevCount) => prevCount + 1);
  };

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

  return (
    <MainContainer cardTitle="Detalle del Sistema">
      {/* ------------- Campo de aplicación ------------- */}
      <div className="row mb-3">
        <div className="col-lg-8 col-sm-9">
          <TextField
            size="small"
            className="readOnly"
            label="Campo de aplicación"
            value={applicationArea}
            variant="outlined"
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              className: "readOnly",
            }}
          />
        </div>
      </div>
      {/* ------------- Material base ------------- */}
      <div className="row mb-3">
        <div className="col-lg-6 col-sm-6">
          <TextField
            size="small"
            className="readOnly"
            label="Material"
            value={material}
            variant="outlined"
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              className: "readOnly",
            }}
          />
        </div>
        <div className="col-lg-2 col-sm-3 mb-3 d-flex">
          {/* ------------- Precio unitario sistema ------------- */}
          <CustomTextField
            name="systemTotalPrice"
            className="readOnly"
            control={control}
            label="Precio unitario sistema"
            value={systemTotalPrice}
            variant="outlined"
            fullWidth
            InputProps={{
              readOnly: true,
              startAdornment: "$",
            }}
            InputLabelProps={{
              className: "readOnly",
            }}
          />
        </div>
      </div>
      {/* ------------- Info del material seleccionado ------------- */}
      <div className="row mb-3">
        <MaterialData material={selectedBaseMaterialDetail} />
      </div>
      <CustomDivider text="Aplicación" />
      {/* ------------- Consumo total ------------- */}
      <div className="row mt-3">
        <div className="col-lg-3 col-sm-6">
          <CustomTextField
            name="totalConsumption"
            control={control}
            className="readOnly"
            label="Consumo total kg/m²"
            variant="outlined"
            fullWidth
            InputProps={{
              readOnly: true,
              startAdornment: "$",
            }}
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
            className="readOnly"
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
        {/* ------------- Modo de aplicación ------------- */}
        <div className="col-lg-3 col-sm-6 mt-16">
          <TextField
            size="small"
            className="readOnly"
            label="Modo de aplicación"
            value={applicationMode}
            variant="outlined"
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              className: "readOnly",
            }}
          />
        </div>
        {/* ------------- Curado ------------- */}
        <div className="col-lg-3 col-sm-6 mt-16">
          <TextField
            size="small"
            className="readOnly"
            label="Curado"
            value={cured}
            variant="outlined"
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              className: "readOnly",
            }}
          />
        </div>
      </div>
      {/* ------------- Mallas 100% ------------- */}
      <CustomDivider text="Mallas 100%" />
      {/* ------------- Si / No ------------- */}
      <div className="row mt-3">
        <div className="col-lg-2 col-sm-6">
          <TextField
            size="small"
            className="readOnly"
            label="Si / No"
            value={totalMeshUnityPriceVisible ? "Si" : "No"}
            variant="outlined"
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              className: "readOnly",
            }}
          />
        </div>
        {/* ------------- Nombre malla 100% ------------- */}
        {showMeshTotalPercentInput && (
          <div className="col-lg-6 col-sm-6">
            <TextField
              value={systemMeshTotalPercentName}
              size="small"
              className="readOnly"
              label="Malla"
              variant="outlined"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                className: "readOnly",
              }}
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
                <Typography fontWeight="500" mr={1} variant="body1">
                  Precio: $/ml
                </Typography>
                <Typography fontWeight="700" variant="body1">
                  {selectedTotalMeshPrice}
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
          <TextField
            name="systemParcialMesh"
            size="small"
            className="readOnly"
            label="Malla"
            variant="outlined"
            fullWidth
            value={systemParcialMesh ? "Si" : "No"}
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              className: "readOnly",
            }}
          />
        </div>
        {/* ------------- Nombre malla parcial ------------- */}
        {systemParcialMesh && (
          <>
            <div className="col-lg-4 col-sm-6">
              <TextField
                name="systemParcialMesh"
                size="small"
                className="readOnly"
                label="Malla"
                variant="outlined"
                fullWidth
                value={systemParcialMeshName}
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  className: "readOnly",
                }}
              />
            </div>
            {/* ------------- Coeficiente por m² ------------- */}
            <div className="col-lg-2 col-sm-2 mt-16">
              <CustomTextField
                name="systemParcialMeshCoefficient"
                control={control}
                rules={{ required: "Coeficiente requerido." }}
                label="Coef. m²"
                variant="outlined"
                fullWidth
                className="readOnly"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
            {/* ------------- Info malla parcial seleccionada ------------- */}
            {systemParcialMesh && (
              <div className="col-lg-3 col-sm-4 mt-16">
                <div className="material-data-container">
                  <div className="data-div ml-2">
                    <Typography fontWeight="500" mr={1} variant="body1">
                      Precio: $/ml
                    </Typography>
                    <Typography fontWeight="700" variant="body1">
                      {selectedPartialMeshPrice}
                    </Typography>
                  </div>
                  <div className="data-div ml-2">
                    <Typography fontWeight="500" mr={1} variant="body1">
                      Precio: $/m²
                    </Typography>
                    <Typography fontWeight="700" variant="body1">
                      {selectedPartialMeshPricePerCoefficient}
                    </Typography>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {/* ------------- descripción coef malla parcial ------------- */}
      {systemParcialMesh && (
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
              className="readOnly"
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
        </div>
      )}
      <CustomDivider text="Otros complementos" />
      {Array.from({ length: materialCount }).map((_, index) => (
        <div key={index}>
          <div className="row mt-3">
            <div className="col-lg-6 col-sm-6">
              {/* ------------- Materiales (otros complementos) ------------- */}
              <CustomTextField
                name={`systemOthersPluginsMaterials${index}`}
                control={control}
                rules={{ required: "Material requerido." }}
                variant="outlined"
                fullWidth
                className="readOnly"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
            {/* ------------- Coeficiente por m² (otros complementos) ------------- */}
            <div className="col-lg-2 col-sm-2">
              <CustomTextField
                name={`systemOthersPluginsMaterialCoefficient${index}`}
                control={control}
                label="Coef. m²"
                variant="outlined"
                fullWidth
                type="number"
                className="readOnly"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
            <div className="col-lg-3 col-sm-4">
              <div className="material-data-container">
                <div className="data-div ml-2">
                  <Typography variant="body1">Precio por m²: $</Typography>
                  <Typography fontWeight="700" variant="body1">
                    {index === 0
                      ? selectedPluginMaterialPricePerCoefficient0
                      : index === 1
                      ? selectedPluginMaterialPricePerCoefficient1
                      : selectedPluginMaterialPricePerCoefficient2}
                  </Typography>
                </div>
              </div>
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
                className="readOnly"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
            {/* ------------- Descripción coef m² (otros complementos) ------------- */}
            <div className="col-lg-6 col-sm-6 mt-3">
              <CustomTextField
                multiline
                minRows={3}
                name={`systemOthersPluginsMaterialCoefficientDescription${index}`}
                control={control}
                label="Descripción coeficiente m²"
                variant="outlined"
                fullWidth
                className="readOnly"
                InputProps={{
                  readOnly: true,
                }}
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
        <div className="col-lg-12 col-sm-12">
          <CustomTextField
            name="baseConditions"
            multiline
            minRows={2}
            control={control}
            label="Condiciones de base"
            variant="outlined"
            fullWidth
            className="readOnly"
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
        <div className="col-lg-12 col-sm-12 mt-3">
          <CustomTextField
            name="supportConditions"
            multiline
            minRows={2}
            control={control}
            label="Condiciones como soporte"
            variant="outlined"
            fullWidth
            className="readOnly"
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
      </div>
      <CustomDivider text="Restricciones" />
      {/* ------------- Si | No | N/E ------------- */}
      <div className="row mt-3">
        <div className="col-lg-3 col-sm-3">
          <TextField
            value={restrictions}
            size="small"
            className="readOnly"
            label="Si / No / N/E"
            variant="outlined"
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{
              className: "readOnly",
            }}
          />
        </div>
        {/* ------------- Campo restriction ------------- */}
        {showRestrictions && (
          <div className="col-lg-3 col-sm-6">
            <CustomTextField
              name="materialAreaRestrictionValue"
              control={control}
              label="Por área m²"
              variant="outlined"
              fullWidth
              type="number"
              className="readOnly"
              InputProps={{
                readOnly: true,
              }}
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
            className="readOnly"
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
      </div>
      {/* ------------- Comentarios sobre el sistema ------------- */}
      <CustomDivider text="Comentarios" />
      <ListSystemComments id={formData?.id} />
      {/* ------------- Botones formulario ------------- */}
      <div className="card-footer text-body-secondary align-right">
        <Button onClick={handleReturn} variant="contained">
          Volver
        </Button>
      </div>
    </MainContainer>
  );
};

export default ReadonlySystem;
