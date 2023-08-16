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
  FormControl,
} from "@mui/material";

import {
  MATERIAL_TYPE,
  CURRENCY,
  MATERIAL_UNIT,
  MATERIAL_COMPONENTS,
  MATERIAL_LIST,
} from "../../../utils/constants";

import { MaterialInputs } from "../../../interfaces/form/FormInterfaces";
import { createMaterial, updateMaterial } from "../../../services/ApiService";
import CustomTextField from "../../../components/TextField";
import { useNavigate } from "react-router-dom";
import CustomSelectField from "../../../components/customSelectField";
import { getUnitPrice } from "../../../utils/mathUtils";

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
    } else {
      setValue("priceDate", loadTodayDate());
    }
  }, [setValue, data]);

  const loadTodayDate = (): string => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  function handleValueChange(values: NumberFormatValues) {
    const { formattedValue } = values;
    setInputValueNumberFormat(formattedValue);
  }

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

  // Obtengo el prefijo del precio unitario
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
      materialPrice = Number(materialPriceWatch);
    }
    if (materialQuantityWatch) {
      materialQuantity = Number(materialQuantityWatch);
    }
    setInputValue(getUnitPrice(materialPrice, materialQuantity));
  }, [data, watchedValues]);

  const onSubmit = async (formData: MaterialInputs) => {
    let response: any;
    if (isUpdateForm) {
      response = await updateMaterial(Number(data?.id), formData);
    } else {
      response = await createMaterial(formData);
    }

    if (response.status !== 200) {
      if (response.data.details) {
        alert("Error: " + response.data.details.join(" "));
      } else {
        alert("Error: " + response.data.message);
      }
    } else {
      alert("Formulario enviado con éxito");
      navigator(MATERIAL_LIST);
    }
  };

  return (
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
            value={inputValue}
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
        <div className="col-lg-3 col-sm-6">
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
            // rules={{ required: "Vida útil requerido." }}
            label="Vida útil (hrs)"
            variant="outlined"
            fullWidth
            // error={errors.potLife}
            // helperText={errors.potLife?.message}
          />
        </div>
        {/* ------------- Temperatura mínima de aplicación ------------- */}
        <div className="col-lg-3 col-sm-3">
          <CustomTextField
            name="minApplicableTemp"
            control={control}
            // rules={{ required: "temperatura mínima de aplicación requerida." }}
            label="Temp mín de aplicación (°C)"
            variant="outlined"
            fullWidth
            // error={errors.minApplicableTemp}
            // helperText={errors.minApplicableTemp?.message}
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
