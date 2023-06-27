import { MainContainer } from "../../components/mainContainer/MainContainer"
import SelectField from "../../components/selectField/SelectField";
import { Divider, Typography, TextField, InputAdornment } from "@mui/material";
import RadioGroupCustom from "../../components/radioGroup/RadioGroup";
import "./addMaterial.css";
import { ChangeEvent, useRef, useState } from "react";
import { MATERIAL_TYPE, MATERIAL_UNITY, MATERIAL_COMPONENTS } from "../../utils/constants"

// Services
import { createMaterial } from "../../services/ApiService";
import AmountInput from "../../components/amountInput";

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

interface ValidationErrors {
  field: string;
  message: string;
}

export const AddMaterial = () => {
  const defaultRadioValue = "pesos";

  const [formErrors, setFormErrors] = useState<FormError[]>([]);
  const [backendErrors, setBackendErrors] = useState<BackendError[]>([]);
  const [currencyValue, setCurrencyValue] = useState(defaultRadioValue);
  const [prefix, setPrefix] = useState<string | undefined>();
  const [inputValue, setInputValue] = useState<string | undefined>("0,00");

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

  const handleOptionSelect = (selectedName: string) => {
    verifyFormErrors(selectedName, "", true);
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
      let backendResponse: any = await createMaterial({
        name: materialNameRef.current?.value,
        brand: materialBrandRef.current?.value,
        presentationQuantity: Number(materialQuantityRef.current?.value),
        presentationUnit: materialUnityRef.current?.value,
        presentationPrice: Number(
          materialPriceRef.current?.value.replaceAll(".", "").replace(",", ".")
        ),
        priceDate: new Date(),
        currency: currencyValue,
        type: materialTypeRef.current?.value,
        component: materialComponentRef.current?.value,
      });
      console.log("respuesta back", backendResponse);
      if (backendResponse) {
        if (backendResponse?.response?.status !== 200) {
          let data: any = backendResponse?.response;
          if (data?.validationErrors) {
            let validationErrors: ValidationErrors = data?.validationErrors;
            Object.entries(validationErrors).map(([key, value]) =>
              backendErrors.push({
                field: key,
                message: value,
                showError: true,
              })
            );
          }
          // backendErrors.push({
          //   field: "materialName",
          //   message: "El material ya esta en uso",
          //   showError: true,
          // });
          setBackendErrors(backendErrors);
        } else {
          // Lógica para manejar una respuesta exitosa desde el backend
          console.log("Formulario enviado con éxito");
        }
      }
    }
    setFormErrors(formErrors);
  };

  const verifyFormErrors = (
    fieldName: string,
    validationMessage: string,
    valid: boolean
  ) => {
    const errors: FormError[] = [];
    if (!valid) {
      errors.push({
        field: fieldName,
        message: validationMessage,
        showError: true,
      });
    }

    setFormErrors(errors);
    setBackendErrors(errors);
  };

  const truncarDecimales = (numero: number, cantidadDecimales: number) => {
    const multiplicador = Math.pow(10, cantidadDecimales);
    const numeroTruncado = Math.floor(numero * multiplicador) / multiplicador;
    return numeroTruncado;
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    verifyFormErrors(
      e.target?.name,
      e.target?.validationMessage,
      e.target?.validity?.valid
    );
    if (materialPriceRef || materialQuantityRef) {
      let materialPrice = Number(
        materialPriceRef.current?.value.replaceAll(".", "").replace(",", ".")
      );
      let materialQuantity = Number(materialQuantityRef.current?.value);
      let price =
        materialPrice / (materialQuantity === 0 ? 1 : materialQuantity);
      let formattedPrice = String(truncarDecimales(price, 2)).replace(".", ",");
      setInputValue(formattedPrice);
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
              onChange={handleValueChange}
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
              onChange={handleValueChange}
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
              options={MATERIAL_TYPE}
              onOptionSelect={handleOptionSelect}
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
              options={MATERIAL_COMPONENTS}
              onOptionSelect={handleOptionSelect}
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
              options={MATERIAL_UNITY}
              onOptionSelect={handleOptionSelect}
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
