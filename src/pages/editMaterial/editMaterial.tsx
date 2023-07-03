import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import NumberFormat, { NumberFormatValues } from "react-number-format";

import { MainContainer } from "../../components/mainContainer/MainContainer";
import "./editMaterial.css";
import {
  Button,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

import {
  Divider,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

import {
  MATERIAL_TYPE,
  CURRENCY,
  MATERIAL_UNIT,
  MATERIAL_COMPONENTS,
} from "../../utils/constants";

import { Inputs } from "../../interfaces/form/FormInterfaces";
import { getMaterialByID, updateMaterial } from "../../services/ApiService";
import CustomTextfield from "../../components/TextField";

export const EditMaterial = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<Inputs>();

  const [inputValue, setInputValue] = useState<string | undefined>("0,00");
  const [inputValueNumberFormat, setInputValueNumberFormat] = useState("");
  const [materialId, setMaterialId] = useState(1);

  const materialBrandRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Carga los datos del JSON
    async function fetchData() {
      // TODO: quitar id hardcodeado
      const response = await getMaterialByID(materialId);
      if (response?.data.error || response === undefined) {
        alert(
          "Error: " + !response?.data.message
            ? "Network error"
            : response.data.message
        );
      } else {
        loadMaterialValues(response.data);
      }
    }
    fetchData();
  }, [setValue]);

  function loadMaterialValues(material: any) {
    setValue("materialName", material.name);
    setValue("materialBrand", material.brand);
    setValue("materialQuantity", material.presentationQuantity);
    setValue("materialPrice", String(material.presentationPrice));
    setValue("materialType", material.type);
    setValue("materialUnit", material.presentationUnit);
    setValue("materialType", material.type);
    setValue("materialComponents", material.component);
    setValue("materialCurrency", material.currency);
  }

  function handleValueChange(values: NumberFormatValues) {
    const { formattedValue } = values;
    setInputValueNumberFormat(formattedValue);
  }

  const handleSelectTypeChange = (e: any) => {
    setValue("materialType", e.target.value as string, {
      shouldValidate: true,
    });
  };

  //función que se ejecuta cuando presiona el botón cancelar
  const handleCancel = () => {
    console.log("handleCancel");
  };

  // calculo precio unitario read only
  const handleSelectPriceChange = (e: any) => {
    setValue("materialPrice", e.target.value as string, {
      shouldValidate: true,
    });
  };

  //   Obtengo el prefijo del precio unitario
  const unity = watch("materialUnit");
  const prefix = unity != null ? `$/${unity}` : "";
  const watchedValues = watch(["materialPrice", "materialQuantity"]);

  useEffect(() => {
    const materialPriceWatch = watchedValues[0];
    const materialQuantityWatch = watchedValues[1];
    let materialPrice: number = 0;
    let materialQuantity: number = 0;
    setInputValueNumberFormat(materialPriceWatch);
    if (materialPriceWatch) {
      materialPrice = Number(
        materialPriceWatch.replaceAll(".", "").replace(",", ".")
      );
    }
    if (materialQuantityWatch) {
      materialQuantity = Number(materialQuantityWatch);
    }
    let price = materialPrice / (materialQuantity === 0 ? 1 : materialQuantity);
    let formattedPrice = String(truncarDecimales(price, 2)).replace(".", ",");
    setInputValue(formattedPrice);
  }, [watchedValues]);

  const truncarDecimales = (numero: number, cantidadDecimales: number) => {
    const multiplicador = Math.pow(10, cantidadDecimales);
    const numeroTruncado = Math.floor(numero * multiplicador) / multiplicador;
    return numeroTruncado;
  };

  const apiDataMapper = (data: Inputs) => {
    return {
      name: data.materialName,
      brand: data.materialBrand,
      presentationQuantity: data.materialQuantity,
      presentationUnit: data.materialUnit,
      presentationPrice: data.materialPrice,
      priceDate: "1891-09-28",
      currency: data.materialCurrency,
      type: data.materialType,
      component: data.materialComponents,
    };
  };

  const onSubmit = async (data: Inputs) => {
    console.log(data);
    const response = await updateMaterial(materialId, apiDataMapper(data));
    console.log(response);

    if (response.data.error) {
      if (response.data.details) {
        alert("Error: " + response.data.details.join(" "));
      } else {
        alert("Error: " + response.data.message);
      }
    } else {
      alert("Formulario enviado con éxito");
    }
  };

  return (
    <MainContainer cardTitle="Editar material">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ------------- Nombre ------------- */}
        <div className="row mb-3">
          <div className="col-lg-6 col-sm-6">
            <CustomTextfield
              name="materialName"
              control={control}
              rules={{ required: "Nombre requerido." }}
              label="Nombre"
              variant="outlined"
              fullWidth
              error={errors.materialName}
              helperText={errors.materialName?.message}
            />
          </div>
          {/* ------------- Marca ------------- */}
          <div className="col-lg-6 col-sm-6">
            <CustomTextfield
              name="materialBrand"
              control={control}
              rules={{ required: "Marca requerida." }}
              label="Marca"
              variant="outlined"
              fullWidth
              error={errors.materialBrand}
              helperText={errors.materialBrand?.message}
            />
          </div>
        </div>
        {/* ------------- Precio unitario READONLY ------------- */}
        <div className="row">
          <div className="col-lg-3 col-sm-6 mb-3">
            <TextField
              className="read-only-text-field"
              value={inputValue}
              fullWidth
              label="Precio unitario"
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">{prefix}</InputAdornment>
                ),
              }}
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
            <CustomTextfield
              name="materialQuantity"
              control={control}
              rules={{ required: "Marca requerida." }}
              label="Cantidad"
              variant="outlined"
              type="number"
              inputProps={{ min: 1 }}
              fullWidth
              error={errors.materialQuantity}
              helperText={errors.materialQuantity?.message}
            />
          </div>
          {/* ------------- Unidad ------------- */}
          <div className="col-lg-3 col-sm-6">
            <FormControl fullWidth error={!!errors.materialUnit}>
              <InputLabel id="custom-select-label">Unidad</InputLabel>
              <Controller
                name="materialUnit"
                control={control}
                defaultValue=""
                rules={{ required: "Composición requerida." }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Unidad"
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
              {errors.materialUnit && (
                <Typography
                  variant="caption"
                  align="left"
                  sx={{ marginLeft: "14px" }}
                  color="error"
                >
                  {errors.materialUnit.message}
                </Typography>
              )}
            </FormControl>
          </div>
          {/* ------------- Moneda ------------- */}
          <div className="col-lg-3 col-sm-6">
            <FormControl>
              <FormLabel id="material-currency-label">Moneda</FormLabel>
              <Controller
                name="materialCurrency"
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
          {/* ------------- Precio ------------- */}
          <div className="col-lg-3 col-sm-6">
            <NumberFormat
              label="Precio"
              {...register("materialPrice", {
                required: "Precio requerido.",
              })}
              error={!!errors.materialPrice}
              helperText={errors.materialPrice?.message}
              customInput={TextField}
              displayType={"input"}
              fixedDecimalScale={true}
              decimalScale={2}
              decimalSeparator={","}
              inputMode="numeric"
              value={inputValueNumberFormat}
              onChange={handleSelectPriceChange}
              onValueChange={handleValueChange}
            />
          </div>
        </div>
        {/* ------------- Tipo ------------- */}
        <div className="row mt-3">
          <div className="col-lg-4 col-sm-6 ">
            <FormControl fullWidth error={!!errors.materialType}>
              <InputLabel id="custom-select-label">Tipo</InputLabel>
              <Controller
                name="materialType"
                control={control}
                defaultValue=""
                rules={{ required: "Tipo requerido." }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="custom-select-label"
                    label="Tipo"
                    onChange={(e) => {
                      const value = e.target.value as string;
                      field.onChange(value);
                      handleSelectTypeChange(e);
                    }}
                  >
                    {MATERIAL_TYPE.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.materialType && (
                <Typography
                  variant="caption"
                  align="left"
                  sx={{ marginLeft: "14px" }}
                  color="error"
                >
                  {errors.materialType.message}
                </Typography>
              )}
            </FormControl>
          </div>
          {/* ------------- Composición ------------- */}
          <div className="col-lg-4 col-sm-6">
            <FormControl fullWidth error={!!errors.materialComponents}>
              <InputLabel id="custom-select-label">Composición</InputLabel>
              <Controller
                name="materialComponents"
                control={control}
                defaultValue=""
                rules={{ required: "Composición requerida." }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Composición"
                    onChange={(e) => {
                      const value = e.target.value as string;
                      field.onChange(value);
                      handleSelectTypeChange(e);
                    }}
                  >
                    {MATERIAL_COMPONENTS.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.materialComponents && (
                <Typography
                  variant="caption"
                  align="left"
                  sx={{ marginLeft: "14px" }}
                  color="error"
                >
                  {errors.materialComponents.message}
                </Typography>
              )}
            </FormControl>
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
        <div className="row">
          {/* ------------- File upload ------------- */}
          <div className="col-lg-6 col-sm-6 mt-3">
            <TextField
              multiline
              minRows={5}
              type="number"
              fullWidth
              inputProps={{ min: 0 }}
              label="File upload"
              variant="outlined"
            />
          </div>
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
