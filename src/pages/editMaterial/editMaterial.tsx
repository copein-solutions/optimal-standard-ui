import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { MainContainer } from "../../components/mainContainer/MainContainer";
import AmountInput from "../../components/amountInput";
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
  MATERIAL_UNITY,
  MATERIAL_COMPONENTS,
} from "../../utils/constants";

interface Inputs {
  materialName: string;
  materialBrand: string;
  materialQuantity: string;
  materialPrice: string;
  materialType: string;
  materialComponents: string;
  materialUnity: string;
  materialCurrency: string;
}

export const EditMaterial = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      materialQuantity: "10",
      materialPrice: "100",
    },
  })

  //#region constants sé si voy a usar
  const [inputValue, setInputValue] = useState<string | undefined>("0,00");

  const materialNameRef = useRef<HTMLInputElement>(null);
  const materialBrandRef = useRef<HTMLInputElement>(null);
  const materialPriceRef = useRef<HTMLInputElement>(null);
  const materialUnityRef = useRef<HTMLInputElement>(null);
  const materialQuantityRef = useRef<HTMLInputElement>(null);
  const materialTypeRef = useRef<HTMLInputElement>(null);
  const materialComponentRef = useRef<HTMLInputElement>(null);

  //#endregion

  //#region quito error cuando escribe sobre el input
  const handleSelectUnityChange = (e: any) => {
    setValue("materialUnity", e.target.value as string, {
      shouldValidate: true,
    });
  };

  const handleSelectComponentChange = (e: any) => {
    setValue("materialComponents", e.target.value as string, {
      shouldValidate: true,
    });
  };

  const handleSelectTypeChange = (e: any) => {
    setValue("materialType", e.target.value as string, {
      shouldValidate: true,
    });
  };

  // calculo precio unitario read only

  const materialQuantity = watch("materialQuantity");
  const handleSelectPriceChange = (e: any) => {
    setValue("materialPrice", e.target.value as string, {
      shouldValidate: true,
    });
  };
  //#endregion

  //función que se ejecuta cuando presiona el botón cancelar
  const handleCancel = () => {
    console.log("handleCancel");
  };

  //   Obtengo el prefijo del precio unitario
  const unity = watch("materialUnity");
  const prefix = unity != null ? `$/${unity}` : "";

  const watchedValues = watch(["materialPrice", "materialQuantity"]);

  useEffect(() => {
    const materialPriceWatch = watchedValues[0];
    const materialQuantityWatch = watchedValues[1];
    let materialPrice: number = 0;
    let materialQuantity: number = 0;
    console.log("materialPriceWatch", materialPriceWatch);
    console.log("materialQuantityWatch", materialQuantityWatch);
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

  const onSubmit = (data: Inputs) => {
    // Enviar el formulario
    // Aquí puedes realizar llamadas a la API o acciones adicionales
    console.log("Formulario enviado:", data);
  };

  return (
    <MainContainer cardTitle="Editar de material">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ------------- Nombre ------------- */}
        <div className="row mb-3">
          <div className="col-lg-6 col-sm-6">
            <TextField
              value="Fausto"
              label="Nombre"
              variant="outlined"
              fullWidth
              {...register("materialName", {
                required: "Nombre requerido.",
              })}
              error={!!errors.materialName}
              helperText={errors.materialName?.message}
            />
          </div>
          {/* ------------- Marca ------------- */}
          <div className="col-lg-6 col-sm-6">
            <TextField
              value="Perillo"
              fullWidth
              label="Marca"
              variant="outlined"
              {...register("materialBrand", {
                required: "Marca requerida.",
              })}
              inputRef={materialBrandRef}
              error={!!errors.materialBrand}
              helperText={errors.materialBrand?.message}
            />
          </div>
        </div>
        {/* ------------- Precio unitario READONLY ------------- */}
        <div className="row">
          <div className="col-lg-6 col-sm-6 mb-3">
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
          <div className="col-lg-4 col-sm-6">
            <TextField
              type="number"
              fullWidth
              inputProps={{ min: 1 }}
              label="Cantidad"
              variant="outlined"
              {...register("materialQuantity", {
                required: "Cantidad requerida.",
              })}
              error={!!errors.materialQuantity}
              helperText={errors.materialQuantity?.message}
            />
          </div>
          {/* ------------- Precio ------------- */}
          <div className="col-lg-4 col-sm-6">
            <AmountInput
              label="Precio"
              {...register("materialPrice", {
                required: "Precio requerido.",
              })}
              error={!!errors.materialPrice}
              helperText={errors.materialPrice?.message}
              onChange={handleSelectPriceChange}
            />
          </div>
          {/* ------------- Moneda ------------- */}
          <div className="col-lg-4 col-sm-6">
            <FormControl>
              <FormLabel id="material-currency-label">Moneda</FormLabel>
              <Controller
                name="materialCurrency"
                control={control}
                defaultValue="pesos"
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
            <FormControl fullWidth error={!!errors.materialType}>
              <InputLabel id="custom-select-label">Tipo</InputLabel>
              <Select
                label="Tipo"
                {...register("materialType", {
                  required: "Tipo requerido.",
                })}
                error={!!errors.materialType}
                defaultValue="Epoxi"
                onChange={handleSelectTypeChange}
              >
                {MATERIAL_TYPE.map((option, index) => (
                  <MenuItem key={index} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
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
              <Select
                label="Composición"
                {...register("materialComponents", {
                  required: "Composición requerida.",
                })}
                error={!!errors.materialComponents}
                defaultValue="monocomponente"
                onChange={handleSelectComponentChange}
              >
                {MATERIAL_COMPONENTS.map((option, index) => (
                  <MenuItem key={index} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
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
          {/* ------------- Unidad ------------- */}
          <div className="col-lg-4 col-sm-6">
            <FormControl fullWidth error={!!errors.materialUnity}>
              <InputLabel id="custom-select-label">Unidad</InputLabel>
              <Select
                label="Unidad"
                {...register("materialUnity", {
                  required: "Unidad requerida.",
                })}
                error={!!errors.materialUnity}
                defaultValue="kg"
                onChange={handleSelectUnityChange}
              >
                {MATERIAL_UNITY.map((option, index) => (
                  <MenuItem key={index} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.materialUnity && (
                <Typography
                  variant="caption"
                  align="left"
                  sx={{ marginLeft: "14px" }}
                  color="error"
                >
                  {errors.materialUnity.message}
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
          <Button variant="text">Cancelar</Button>
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
