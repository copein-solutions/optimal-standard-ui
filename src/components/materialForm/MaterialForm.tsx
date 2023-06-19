import { MainContainer } from "../mainContainer/MainContainer";
import SelectField from "../selectField/SelectField";
import { Divider, Typography, TextField, InputAdornment } from "@mui/material";
import RadioGroupCustom from "../radioGroup/RadioGroup";
import "./MaterialForm.css";
import { ChangeEvent, useEffect, useRef, useState } from "react";

// Services
import { createMaterial } from "../../services/ApiService";
import AmountInput from "../amountInput";

const type = [
  {
    value: "Cementicio",
    label: "Cementicio",
  },
  {
    value: "Acrílico",
    label: "Acrílico",
  },
  {
    value: "Epoxi",
    label: "Epoxi",
  },
  {
    value: "Poliuretánico",
    label: "Poliuretánico",
  },
  {
    value: "Mantas varias",
    label: "Mantas varias",
  },
  {
    value: "Malla",
    label: "Malla",
  },
  {
    value: "Pintura",
    label: "Pintura",
  },
  {
    value: "Sellador",
    label: "Sellador",
  },
  {
    value: "Siliconado",
    label: "Siliconado",
  },
  {
    value: "Malla",
    label: "Malla",
  },
  {
    value: "Junta hidroexpansiva",
    label: "Junta hidroexpansiva",
  },
  {
    value: "otro",
    label: "otro",
  },
];

const currency = [
  {
    value: "dolares",
    label: "USD",
  },
  {
    value: "pesos",
    label: "$",
  },
];

const unity = [
  {
    value: "kg",
    label: "Kilogramos",
  },
  {
    value: "l",
    label: "Litros",
  },
  {
    value: "m2",
    label: "Metros cuadrados",
  },
  {
    value: "cm3",
    label: "Centímetros cúbicos",
  },
  {
    value: "ml",
    label: "Metros lineales",
  },
  {
    value: "u",
    label: "Unidades",
  },
];

const components = [
  {
    label: "Monocomponente",
    value: "monocomponente",
  },
  {
    label: "Bicomponente",
    value: "bicomponente",
  },
  {
    label: "Tricomponente",
    value: "tricomponente",
  },
  {
    label: "No aplica",
    value: "no_aplica",
  },
];

interface FormError {
  field: string;
  message: string;
  showError: boolean;
}

interface BackendError {
  field: string;
  message: string;
  showError: boolean;
}

export const MaterialForm = () => {
  const defaultRadioValue = "pesos";

  const [formErrors, setFormErrors] = useState<FormError[]>([]);
  const [backendErrors, setBackendErrors] = useState<BackendError[]>([]);
  const [currencyValue, setCurrencyValue] = useState(defaultRadioValue);
  const [prefix, setPrefix] = useState("");

  const materialNameRef = useRef<HTMLInputElement>(null);
  const materialBrandRef = useRef<HTMLInputElement>(null);
  const materialPriceRef = useRef<HTMLInputElement>(null);
  const materialUnityRef = useRef<HTMLInputElement>(null);
  const materialQuantityRef = useRef<HTMLInputElement>(null);
  const materialTypeRef = useRef<HTMLInputElement>(null);
  const materialComponentRef = useRef<HTMLInputElement>(null);

  // Obtengo el value del Radio seleccionado
  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrencyValue(e.target.value);
  };

  //función que se ejecuta cuando presiona el botón cancelar
  const handleCancel = () => {
    console.log("handleCancel");
  };

  const verifyFormErrorsOnAccept = (formErrors: FormError[]) => {
    if (
      materialNameRef.current?.value === "" ||
      materialNameRef.current?.value == null
    ) {
      formErrors.push({
        field: "materialName",
        message: "Nombre requerido",
        showError: true,
      });
    }

    if (
      materialBrandRef.current?.value === "" ||
      materialBrandRef.current?.value == null
    ) {
      formErrors.push({
        field: "materialBrand",
        message: "Marca requerida",
        showError: true,
      });
    }

    if (
      materialQuantityRef.current?.value === "" ||
      materialQuantityRef.current?.value == null
    ) {
      formErrors.push({
        field: "materialQuantity",
        message: "Cantidad requerida",
        showError: true,
      });
    }

    if (
      materialPriceRef.current?.value === "" ||
      materialPriceRef.current?.value == null
    ) {
      formErrors.push({
        field: "materialPrice",
        message: "Precio requerido",
        showError: true,
      });
    }

    if (
      materialTypeRef.current?.value === "" ||
      materialTypeRef.current?.value == null
    ) {
      formErrors.push({
        field: "materialType",
        message: "Tipo requerido",
        showError: true,
      });
    }

    if (
      materialComponentRef.current?.value === "" ||
      materialComponentRef.current?.value == null
    ) {
      formErrors.push({
        field: "materialComponents",
        message: "Composición requerida",
        showError: true,
      });
    }

    if (
      materialUnityRef.current?.value === "" ||
      materialUnityRef.current?.value == null
    ) {
      formErrors.push({
        field: "materialUnity",
        message: "Unidad requerida",
        showError: true,
      });
    }
  };

  const handleAccept = async () => {
    const formErrors: FormError[] = [];
    const backendErrors: BackendError[] = [];
    verifyFormErrorsOnAccept(formErrors);

    if (formErrors.length === 0) {
      const response = await createMaterial({
        name: materialNameRef.current?.value,
        brand: materialBrandRef.current?.value,
      });
      console.log("respuesta back", response);

      if (response.status !== 200) {
        backendErrors.push({
          field: "materialName",
          message: "El material ya esta en uso",
          showError: true,
        });
        setBackendErrors(backendErrors);
      } else {
        // Lógica para manejar una respuesta exitosa desde el backend
        console.log("Formulario enviado con éxito");
      }
    }
    setFormErrors(formErrors);
  };

  const verifyFormErrors = (event: React.ChangeEvent<HTMLInputElement>) => {
    const errors: FormError[] = [];
    const fieldName = event.target?.name; // valor de la propiedad name del input
    // TODO: si no se usa sacarlo
    const fieldValue = event.target?.value; // valor ingresado en el input por el usuario
    const validationMessage = event.target?.validationMessage; // mensaje de error de validaciones que no son de backend, ej: el error del regex
    console.log("validationMessage", validationMessage);

    if (!event.target?.validity?.valid) {
      errors.push({
        field: fieldName,
        message: validationMessage,
        showError: true,
      });
    }

    setFormErrors(errors);
    setBackendErrors(errors);
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    verifyFormErrors(event);
  };

  const [inputValue, setInputValue] = useState("");

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    verifyFormErrors(event);
    if (materialPriceRef || materialQuantityRef) {
      let precio = 0;
      let precioIngresado = Number(
        materialPriceRef.current?.value.replaceAll(".", "").replace(",", ".")
      );
      let cantidadIngresada = Number(materialQuantityRef.current?.value);

      precio = precioIngresado / cantidadIngresada;
      setInputValue(String(precio).replace(".", ","));
    }
  };

  return (
    <MainContainer
      onCancel={handleCancel}
      onAccept={handleAccept}
      hasFooterButons
      cardTitle="Alta de material"
    >
      <div className="container">
        {/* ------------- Nombre ------------- */}
        <div className="row mb-3">
          <div className="col-lg-6 col-sm-6">
            <TextField
              inputRef={materialNameRef}
              fullWidth
              required
              name="materialName"
              label="Nombre"
              variant="outlined"
              onChange={handleInputChange}
              error={
                formErrors.find((error) => error.field === "materialName")
                  ?.showError ||
                backendErrors.find((error) => error.field === "materialName")
                  ?.showError
              }
              helperText={
                formErrors.find((error) => error.field === "materialName")
                  ?.message ||
                backendErrors.find((error) => error.field === "materialName")
                  ?.message
              }
            />
          </div>
          {/* ------------- Marca ------------- */}
          <div className="col-lg-6 col-sm-6">
            <TextField
              name="materialBrand"
              required
              inputRef={materialBrandRef}
              fullWidth
              label="Marca"
              variant="outlined"
              onChange={handleInputChange}
              error={
                formErrors.find((error) => error.field === "materialBrand")
                  ?.showError ||
                backendErrors.find((error) => error.field === "materialBrand")
                  ?.showError
              }
              helperText={
                formErrors.find((error) => error.field === "materialBrand")
                  ?.message ||
                backendErrors.find((error) => error.field === "materialBrand")
                  ?.message
              }
            />
          </div>
        </div>
        {/* ------------- Precio unitario READONLY ------------- */}
        <div className="row">
          <div className="col-lg-6 col-sm-6 mb-3">
            <TextField
              value={inputValue}
              fullWidth
              required
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
              name="materialQuantity"
              required
              inputRef={materialQuantityRef}
              type="number"
              fullWidth
              inputProps={{ min: 1 }}
              label="Cantidad"
              variant="outlined"
              onChange={handleValueChange}
              error={
                formErrors.find((error) => error.field === "materialQuantity")
                  ?.showError ||
                backendErrors.find(
                  (error) => error.field === "materialQuantity"
                )?.showError
              }
              helperText={
                formErrors.find((error) => error.field === "materialQuantity")
                  ?.message ||
                backendErrors.find(
                  (error) => error.field === "materialQuantity"
                )?.message
              }
            />
          </div>
          {/* ------------- Precio ------------- */}
          <div className="col-lg-4 col-sm-6">
            <AmountInput
              // prefix={prefix}
              name="materialPrice"
              inputRef={materialPriceRef}
              required
              label="Precio"
              onChange={handleValueChange}
              error={
                formErrors.find((error) => error.field === "materialPrice")
                  ?.showError ||
                backendErrors.find((error) => error.field === "materialPrice")
                  ?.showError
              }
              helperText={
                formErrors.find((error) => error.field === "materialPrice")
                  ?.message ||
                backendErrors.find((error) => error.field === "materialPrice")
                  ?.message
              }
            />
          </div>
          {/* ------------- Moneda ------------- */}
          <div className="col-lg-4 col-sm-6">
            <RadioGroupCustom
              name="materialCurrency"
              onChange={handleRadioChange}
              row
              formLabel="Moneda"
              defaultValue={defaultRadioValue}
              id="radioId"
              options={currency}
            />
          </div>
        </div>
        {/* ------------- Tipo ------------- */}
        <div className="row mt-3">
          <div className="col-lg-4 col-sm-6 ">
            <SelectField
              getRef={materialTypeRef}
              label="Tipo *"
              name="materialType"
              options={type}
              error={
                formErrors.find((error) => error.field === "materialType")
                  ?.showError ||
                backendErrors.find((error) => error.field === "materialType")
                  ?.showError
              }
              helperText={
                formErrors.find((error) => error.field === "materialType")
                  ?.message ||
                backendErrors.find((error) => error.field === "materialType")
                  ?.message
              }
            />
          </div>
          {/* ------------- Composición ------------- */}
          <div className="col-lg-4 col-sm-6">
            <SelectField
              name="materialComponents"
              getRef={materialComponentRef}
              label="Composición *"
              options={components}
              error={
                formErrors.find((error) => error.field === "materialComponents")
                  ?.showError ||
                backendErrors.find(
                  (error) => error.field === "materialComponents"
                )?.showError
              }
              helperText={
                formErrors.find((error) => error.field === "materialComponents")
                  ?.message ||
                backendErrors.find(
                  (error) => error.field === "materialComponents"
                )?.message
              }
            />
          </div>
          {/* ------------- Unidad ------------- */}
          <div className="col-lg-4 col-sm-6">
            <SelectField
              setPrefix={setPrefix}
              name="materialUnity"
              getRef={materialUnityRef}
              label="Unidad *"
              options={unity}
              // onClick={onClick}
              error={
                formErrors.find((error) => error.field === "materialUnity")
                  ?.showError ||
                backendErrors.find((error) => error.field === "materialUnity")
                  ?.showError
              }
              helperText={
                formErrors.find((error) => error.field === "materialUnity")
                  ?.message ||
                backendErrors.find((error) => error.field === "materialUnity")
                  ?.message
              }
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
      </div>
    </MainContainer>
  );
};
