import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import NumberFormat, { NumberFormatValues } from "react-number-format";
import Toast, { ToastType } from "../../../components/toast/toast";

import {
  Button,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Divider,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
} from "@mui/material";
import "./materialForm.css";

// Import FilePond
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import "filepond/dist/filepond.min.css";
import { FilePondFile } from "filepond";

// Imports Utils
import {
  MATERIAL_TYPE,
  CURRENCY,
  MATERIAL_UNIT,
  MATERIAL_COMPONENTS,
  MATERIAL_LIST,
} from "../../../utils/constants";
import { getUnitPrice } from "../../../utils/mathUtils";
import { loadTodayDate } from "../../../utils/dateUtils";

import { MaterialInputs, Files } from "../../../interfaces/form/FormInterfaces";
import {
  createMaterial,
  updateMaterial,
  getMaterialFileById,
  getQuotationDollar,
  API_BASE_URL,
} from "../../../services/ApiService";
import CustomTextField from "../../../components/TextField";
import CustomSelectField from "../../../components/customSelectField";

type MaterialFromProps = {
  data?: MaterialInputs;
  isUpdateForm?: boolean;
};

const MaterialForm: React.FC<MaterialFromProps> = ({ data, isUpdateForm }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<MaterialInputs>();
  registerPlugin(FilePondPluginFileValidateType);
  const [inputValueUnitPrice, setInputValueUnitPrice] =
    useState<string | undefined>("0,00");
  const [inputValueNumberFormat, setInputValueNumberFormat] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [headers, setHeaders] = useState<any>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<ToastType>("success");

  const navigator = useNavigate();

  const loadFiles = (files: Files[]) => {
    return files.map((file) => {
      return {
        source: file.id,
        options: {
          type: "local",
          file: {
            name: file.name,
            size: file.size,
            type: file.type,
          },
        },
      };
    });
  };

  const getFileId = (file: any) => {
    if (typeof file.serverId === "string") {
      let aux = JSON.parse(file.serverId);
      return aux.id;
    }
    return file.serverId;
  };

  const getMaterialFiles = (): Files[] => {
    return files.map((item) => {
      return {
        id: getFileId(item),
        name: item.file.name,
        size: item.file.size,
        type: item.file.type,
      };
    });
  };

  const handleFileClick = async (file: FilePondFile) => {
    try {
      let response = await getMaterialFileById(getFileId(file))
      const blob = new Blob([ response.data ], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error al obtener el archivo:", error);
    }
  };

  useEffect(() => {
    if (data) {
      setValue("product", data.product);
      setValue("brand", data.brand);
      setValue("presentationQuantity", data.presentationQuantity);
      setValue("presentationPrice", String(data.presentationPrice));
      setValue("type", data.type);
      setValue("presentationUnit", data.presentationUnit);
      setValue("component", data.component);
      setValue("currency", data.currency);
      setValue("priceDate", data.priceDate);
      setValue("potLife", data.potLife);
      setValue("minApplicableTemp", data.minApplicableTemp);
      setFiles(loadFiles(data.files ? data.files : []));
    } else {
      setValue("priceDate", loadTodayDate());
    }
    const credencials = localStorage.getItem("credentials");
    if (credencials) {
      setHeaders({
        Authorization: `Bearer ${JSON.parse(credencials)}`,
        Accept: "*/*",
      });
    }
  }, [setValue, data]);

  const handleCloseToast = () => {
    setShowToast(false);
  };

  function handleValueChange(values: NumberFormatValues) {
    const { formattedValue } = values;
    setInputValueNumberFormat(formattedValue);
  }

  const handleUpdateFiles = (fileItems: any[]) => {
    setFiles(fileItems);
  };

  const handleSelectChange = (e: any) => {
    if (e.target.name === "presentationPrice") {
      setValue("presentationPrice", e.target.value as string, {
        shouldValidate: true,
      });
    }
  };

  //función que se ejecuta cuando presiona el botón cancelar
  const handleCancel = () => {
    navigator(MATERIAL_LIST);
  };

  const convertCurrency = async (materialPrice: number) => {
    let finalMaterialprice = materialPrice;

    let response = await getQuotationDollar();
    if (response.data) {
      return materialPrice * response.data;
    }
    return finalMaterialprice;
  };

  // Obtengo el prefijo del precio unitario
  const unity = watch("presentationUnit");
  const prefix = unity != null ? `$/${unity}` : "";
  const watchedValues = watch([
    "presentationPrice",
    "presentationQuantity",
    "currency",
  ]);
  const materialPriceWatch = watchedValues[0];
  const materialQuantityWatch = watchedValues[1];
  const currencyWatch = watchedValues[2];

  useEffect(() => {
    async function fetchData() {
      let materialPrice: number = 0;
      let materialQuantity: number = 0;
      setInputValueNumberFormat(materialPriceWatch);
      if (materialPriceWatch) {
        materialPrice = Number(materialPriceWatch);
      }
      if (materialQuantityWatch) {
        materialQuantity = Number(materialQuantityWatch);
      }
      if ("USD" === currencyWatch) {
        materialPrice = await convertCurrency(materialPrice);
      }
      setInputValueUnitPrice(getUnitPrice(materialPrice, materialQuantity));
    }
    fetchData();
  }, [data, materialPriceWatch, materialQuantityWatch, currencyWatch]);

  const onSubmit = async (formData: MaterialInputs) => {
    let response: any;
    formData.files = getMaterialFiles();
    if (isUpdateForm) {
      response = await updateMaterial(Number(data?.id), formData);
    } else {
      response = await createMaterial(formData);
    }

    if (response.status !== 200) {
      if (response.data.details) {
        setToastMsg(`Error: ${response.data.details.join(" ")}`);
        setToastType("error");
        setShowToast(true);
      } else {
        setToastMsg(`Error:  ${response.data.message}`);
        setToastType("error");
        setShowToast(true);
      }
    } else {
      setToastMsg("Material agregado con éxito");
      setToastType("success");
      setShowToast(true);
      setTimeout(() => {
        navigator(MATERIAL_LIST);
      }, 2000);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ------------- Nombre ------------- */}
        <div className="row mb-3">
          <div className="col-lg-6 col-sm-6">
            <CustomTextField
              name="product"
              control={control}
              rules={{ required: "Producto requerido." }}
              label="Producto"
              variant="outlined"
              fullWidth
              error={errors.product}
              helperText={errors.product?.message}
            />
          </div>
          {/* ------------- Marca ------------- */}
          <div className="col-lg-6 col-sm-6">
            <CustomTextField
              name="brand"
              control={control}
              rules={{ required: "Marca requerida." }}
              label="Marca"
              variant="outlined"
              fullWidth
              error={errors.brand}
              helperText={errors.brand?.message}
            />
          </div>
        </div>
        {/* ------------- Precio unitario READONLY ------------- */}
        <div className="row">
          <div className="col-lg-3 col-sm-6 mb-3">
            <CustomTextField
              name="unitPrice"
              control={control}
              label="Precio unitario"
              value={inputValueUnitPrice}
              variant="outlined"
              fullWidth
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment sx={{ marginRight: "5px" }} position="end">
                    {prefix}
                  </InputAdornment>
                ),
              }}
            />
          </div>
          {/* ------------- Fecha ------------- */}
          <div className="col-lg-3 col-sm-3">
            <CustomTextField
              name="priceDate"
              control={control}
              rules={{ required: "Fecha requerida." }}
              label="Fecha"
              variant="outlined"
              type="date"
              fullWidth
              error={errors.priceDate}
              helperText={errors.priceDate?.message}
            />
          </div>
        </div>
        <Typography
          align="left"
          variant="subtitle1"
          component="div"
          sx={{ mt: 3 }}
        >
          Presentación
        </Typography>
        <Divider />
        <div className="row mt-3">
          {/* ------------- Cantidad ------------- */}
          <div className="col-lg-3 col-sm-6">
            <CustomTextField
              name="presentationQuantity"
              control={control}
              rules={{ required: "Cantidad requerida." }}
              label="Cantidad"
              variant="outlined"
              type="number"
              inputProps={{ min: 1 }}
              fullWidth
              error={errors.presentationQuantity}
              helperText={errors.presentationQuantity?.message}
            />
          </div>
          {/* ------------- Unidad ------------- */}
          <div className="col-lg-3 col-sm-6">
            <CustomSelectField
              name="presentationUnit"
              control={control}
              rules={{ required: "Unidad requerida." }}
              label="Unidad"
              error={errors.presentationUnit}
              options={MATERIAL_UNIT}
            />
          </div>
          {/* ------------- Precio ------------- */}
          <div className="col-lg-3 col-sm-3 mt-16">
            <NumberFormat
              size="small"
              label="Precio"
              {...register("presentationPrice", {
                required: "Precio requerido.",
              })}
              error={!!errors.presentationPrice}
              helperText={errors.presentationPrice?.message}
              customInput={TextField}
              displayType={"input"}
              fixedDecimalScale={true}
              decimalScale={2}
              decimalSeparator={"."}
              inputMode="numeric"
              value={inputValueNumberFormat}
              onChange={handleSelectChange}
              onValueChange={handleValueChange}
            />
          </div>
          {/* ------------- Moneda ------------- */}
          <div className="col-lg-3 col-sm-4 mt-16">
            <FormControl>
              <FormLabel id="material-currency-label">Moneda</FormLabel>
              <Controller
                name="currency"
                control={control}
                defaultValue="$"
                render={({ field }) => (
                  <RadioGroup
                    row
                    aria-labelledby="material-currency-label"
                    {...field}
                  >
                    {CURRENCY.map((option, index) => (
                      <FormControlLabel
                        control={<Radio />}
                        label={option.label}
                        key={index}
                        value={option.value}
                      />
                    ))}
                  </RadioGroup>
                )}
              />
            </FormControl>
          </div>
        </div>
        {/* ------------- Tipo ------------- */}
        <div className="row mt-3">
          <div className="col-lg-4 col-sm-6 ">
            <CustomSelectField
              name="type"
              control={control}
              rules={{ required: "Tipo requerido." }}
              label="Tipo"
              error={errors.type}
              options={MATERIAL_TYPE}
            />
          </div>
          {/* ------------- Composición ------------- */}
          <div className="col-lg-4 col-sm-6">
            <CustomSelectField
              name="component"
              control={control}
              rules={{ required: "Composición requerida." }}
              label="Composición"
              error={errors.component}
              options={MATERIAL_COMPONENTS}
            />
          </div>
        </div>
        <Typography
          align="left"
          variant="subtitle1"
          component="div"
          sx={{ mt: 3 }}
        >
          Restricciones
        </Typography>
        <Divider />
        <div className="row mt-3">
          <div className="col-lg-3 col-sm-3">
            <CustomTextField
              name="potLife"
              control={control}
              label="Vida útil (hrs)"
              type="number"
              variant="outlined"
              fullWidth
            />
          </div>
          {/* ------------- Temperatura mínima de aplicación ------------- */}
          <div className="col-lg-3 col-sm-3">
            <CustomTextField
              name="minApplicableTemp"
              control={control}
              label="Temp mín de aplicación (°C)"
              variant="outlined"
              type="number"
              fullWidth
            />
          </div>
        </div>
        <Typography
          align="left"
          variant="subtitle1"
          component="div"
          sx={{ mt: 3 }}
        >
          Ficha Técnica
        </Typography>
        <Divider />
        <div className="App">
          {/* ------------- File upload ------------- */}
          <FilePond
            files={files}
            onupdatefiles={handleUpdateFiles}
            allowMultiple={true}
            maxFiles={4}
            name="files"
            ignoredFiles={[".ds_store", "thumbs.db", "desktop.ini"]}
            acceptedFileTypes={["application/pdf"]}
            labelIdle='Arrastrar y soltar o <span class="filepond--label-action">Explorar</span>'
            server={{
              url: API_BASE_URL + "/admin/file",
              process: {
                url: `/upload${isUpdateForm ? `?material_id=${data?.id}` : ""}`,
                headers: headers,
                method: "POST",
                withCredentials: false,
                onload: (res) => res,
              },
              revert: {
                url: "/delete",
                headers: {
                  ...headers,
                  "Content-type": "application/json",
                },
                method: "DELETE",
                withCredentials: false,
              },
              load: {
                url: "/load?file_id=",
                headers: headers,
                method: "GET",
                withCredentials: false,
              },
            }}
            onactivatefile={(file) => handleFileClick(file)}
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
      <Toast
        type={toastType}
        message={toastMsg}
        open={showToast}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default MaterialForm;
