import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import NumberFormat, { NumberFormatValues } from "react-number-format";

import "./materialForm.css";
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
} from "../../../utils/constants";

import { MaterialInputs } from "../../../interfaces/form/FormInterfaces";
import { createMaterial, updateMaterial } from "../../../services/ApiService";
import CustomTextField from "../../../components/TextField";
import { useNavigate } from "react-router-dom";

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

  const [inputValue, setInputValue] = useState<string | undefined>("0,00");
  const [inputValueNumberFormat, setInputValueNumberFormat] = useState("");

  const navigator = useNavigate();

  useEffect(() => {
    if (data) {
      setValue("name", data.name);
      setValue("brand", data.brand);
      setValue("presentationQuantity", data.presentationQuantity);
      setValue("presentationPrice", String(data.presentationPrice));
      setValue("type", data.type);
      setValue("presentationUnit", data.presentationUnit);
      setValue("components", data.component);
      setValue("currency", data.currency);
    }
  }, [setValue, data]);

  function handleValueChange(values: NumberFormatValues) {
    const { formattedValue } = values;
    setInputValueNumberFormat(formattedValue);
  }

  const handleSelectChange = (e: any) => {
    if (e.target.name === "type") {
      setValue("type", e.target.value as string, {
        shouldValidate: true,
      });
    } else if (e.target.name === "components") {
      setValue("components", e.target.value as string, {
        shouldValidate: true,
      });
    } else if (e.target.name === "price") {
      setValue("presentationPrice", e.target.value as string, {
        shouldValidate: true,
      });
    }
  };

  //función que se ejecuta cuando presiona el botón cancelar
  const handleCancel = () => {
    navigator("/materials");
  };

  //   Obtengo el prefijo del precio unitario
  const unity = watch("presentationUnit");
  const prefix = unity != null ? `$/${unity}` : "";
  const watchedValues = watch(["presentationPrice", "presentationQuantity"]);

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
  }, [data, watchedValues]);

  const truncarDecimales = (numero: number, cantidadDecimales: number) => {
    const multiplicador = Math.pow(10, cantidadDecimales);
    const numeroTruncado = Math.floor(numero * multiplicador) / multiplicador;
    return numeroTruncado;
  };

  const onSubmit = async (data: MaterialInputs) => {
    console.log(data);
    let response: any;
    if (isUpdateForm) {
      response = await updateMaterial(Number(data?.id), data);
    } else {
      response = await createMaterial(data);
    }
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
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* ------------- Nombre ------------- */}
      <div className="row mb-3">
        <div className="col-lg-6 col-sm-6">
          <CustomTextField
            name="name"
            control={control}
            rules={{ required: "Nombre requerido." }}
            label="Nombre"
            variant="outlined"
            fullWidth
            error={errors.name}
            helperText={errors.name?.message}
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
          <TextField
            className="read-only-text-field"
            value={inputValue}
            fullWidth
            label="Precio unitario"
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="end">{prefix}</InputAdornment>
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
          <CustomTextField
            name="presentationQuantity"
            control={control}
            rules={{ required: "Marca requerida." }}
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
          <FormControl fullWidth error={!!errors.presentationUnit}>
            <InputLabel id="custom-select-label">Unidad</InputLabel>
            <Controller
              name="presentationUnit"
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
            {errors.presentationUnit && (
              <Typography
                variant="caption"
                align="left"
                sx={{ marginLeft: "14px" }}
                color="error"
              >
                {errors.presentationUnit.message}
              </Typography>
            )}
          </FormControl>
        </div>
        {/* ------------- Moneda ------------- */}
        <div className="col-lg-3 col-sm-6">
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
        {/* ------------- Precio ------------- */}
        <div className="col-lg-3 col-sm-6">
          <NumberFormat
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
            decimalSeparator={","}
            inputMode="numeric"
            value={inputValueNumberFormat}
            onChange={handleSelectChange}
            onValueChange={handleValueChange}
          />
        </div>
      </div>
      {/* ------------- Tipo ------------- */}
      <div className="row mt-3">
        <div className="col-lg-4 col-sm-6 ">
          <FormControl fullWidth error={!!errors.type}>
            <InputLabel id="custom-select-label">Tipo</InputLabel>
            <Controller
              name="type"
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
                    handleSelectChange(e);
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
            {errors.type && (
              <Typography
                variant="caption"
                align="left"
                sx={{ marginLeft: "14px" }}
                color="error"
              >
                {errors.type.message}
              </Typography>
            )}
          </FormControl>
        </div>
        {/* ------------- Composición ------------- */}
        <div className="col-lg-4 col-sm-6">
          <FormControl fullWidth error={!!errors.components}>
            <InputLabel id="custom-select-label">Composición</InputLabel>
            <Controller
              name="components"
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
                    handleSelectChange(e);
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
            {errors.components && (
              <Typography
                variant="caption"
                align="left"
                sx={{ marginLeft: "14px" }}
                color="error"
              >
                {errors.components.message}
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
  );
};

export default MaterialForm;
