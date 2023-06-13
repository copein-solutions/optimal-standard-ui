import { MainContainer } from "../mainContainer/MainContainer";
import SelectField from "../selectField/SelectField";
import { Divider, Typography, TextField, BackdropProps } from "@mui/material";
import RadioGroupCustom from "../radioGroup/RadioGroup";
import "./MaterialForm.css";
import { forwardRef, useRef, useState } from "react";
import { log } from "console";

const optionsSelect = [
  { value: "estandar_optimo", label: "Estándar óptimo" },
  {
    value: "estandar_optimo_alternativo",
    label: "Estándar óptimo alternativo",
  },
  { value: "no_estandar_optimo", label: "No es estándar óptimo" },
];

const optionsApplicationArea = [
  {
    value: "application_area1",
    label: "Muros de contención - Presión positiva sin napa ",
  },
  {
    value: "application_area2",
    label:
      "Muros de contención - Presión positiva con napa - c/tratamiento de juntas frías",
  },
  {
    value: "application_area3",
    label: "Muros de contención - Presión negativa sin napa",
  },
  {
    value: "application_area4",
    label: "Terrazas transitables con carpeta de protección",
  },
];

const applicationMode = [
  {
    value: "application_mode2",
    label: "Brocha",
  },
  {
    value: "application_mode3",
    label: "Llana",
  },
  {
    value: "application_mode4",
    label: "Rodillo",
  },
  {
    value: "application_mode5",
    label: "Aspersor",
  },
];

const tipe = [
  {
    value: "tipe2",
    label: "Acrílicos",
  },
  {
    value: "tipe3",
    label: "Siliconados",
  },
  {
    value: "tipe4",
    label: "Sementosos",
  },
  {
    value: "tipe5",
    label: "Poliuretánicos",
  },
];

const presentation = [
  {
    value: "presentation1",
    label: "Lata",
  },
  {
    value: "presentation2",
    label: "Bolsa",
  },
];

const compositionList = [
  {
    value: "radio1",
    label: "Monocomponente",
  },
  {
    value: "radio2",
    label: "Bicomponente",
  },
];

const curadoList = [
  {
    value: "curado1",
    label: "Si",
  },
  {
    value: "Curado2",
    label: "No",
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
  const [formErrors, setFormErrors] = useState<FormError[]>([]);
  const [backendErrors, setBackendErrors] = useState<BackendError[]>([]);

  const materialNameRef = useRef<HTMLInputElement>(null);
  const materialBrandRef = useRef<HTMLInputElement>(null);
  const materialPriceRef = useRef<HTMLInputElement>(null);
  const materialPresentationRef = useRef<HTMLInputElement>(null);
  const materialQuantityRef = useRef<HTMLInputElement>(null);
  const materialTypeRef = useRef<HTMLInputElement>(null);
  const materialDataSheet = useRef<HTMLInputElement>(null);

  const handleCancel = () => {
    console.log("handleCancel");
  };

  const handleAccept = () => {
    const formErrors: FormError[] = [];
    const backendErrors: BackendError[] = [];

    if (materialNameRef.current?.value == "" || materialNameRef.current?.value == null)
      formErrors.push({
        field: "materialName",
        message: "El nombre es requerido",
        showError: true,
      });
    if (materialBrandRef.current?.value == "" || materialBrandRef.current?.value == null)
      formErrors.push({
        field: "materialBrand",
        message: "La marca es requerida",
        showError: true,
      });

    // materialPriceRef.current?.value != null
    // materialPresentationRef.current?.value != null
    // materialQuantityRef.current?.value != null
    // materialTypeRef.current?.value != null
    // materialDataSheet.current?.value != null)

    if (formErrors.length === 0) {
      // Ejemplo de respuesta de backend
      const response = {
        errors: {
          materialName: "El material ya esta en uso",
        },
      };

      if (response.errors) {
        // setBackendErrors(response.errors);
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
    // limpia errores del form
    setFormErrors(formErrors);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const errors: FormError[] = [];
    const fieldName = event.target?.name; // valor de la propiedad name del input
    const fieldValue = event.target?.value; // valor ingresado en el input por el usuario
    const validationMessage = event.target?.validationMessage; // mensaje de error de validaciones que no son de backend, ej: el error del regex
    console.log("fieldName", fieldName);
    console.log("fieldValue", fieldValue);
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
              inputProps={{
                pattern: "^[0-9]+$", // Expresión regular para solo permitir letras
              }}
              inputRef={materialNameRef}
              fullWidth
              required
              name="materialName"
              label="Nombre"
              variant="outlined"
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
              onChange={handleInputChange}
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
        {/* ------------- Precio unitario ($/kg) ------------- */}
        <div className="row">
          <div className="col-lg-6 col-sm-6 mb-3">
            <TextField
              type="number"
              inputRef={materialPriceRef}
              fullWidth
              inputProps={{ min: 0 }}
              label="Precio unitario ($/kg)"
              variant="outlined"
            />
          </div>
        </div>
        {/* ------------- Presentación ------------- */}
        <div className="row">
          <div className="col-lg-6 col-sm-6 mb-3">
            <SelectField
              refPrueba={materialPresentationRef}
              label="Presentación"
              options={presentation}
            />
          </div>
          {/* ------------- Cantidad ------------- */}
          <div className="col-lg-6 col-sm-6">
            <TextField
              inputRef={materialQuantityRef}
              type="number"
              fullWidth
              inputProps={{ min: 1 }}
              label="Cantidad"
              variant="outlined"
            />
          </div>
          <div />
        </div>
        {/* ------------- Tipo ------------- */}
        <div className="row">
          <div className="col-lg-6 col-sm-6 ">
            {/* <SelectField ref={materialTypeRef} label="Tipo" options={tipe} /> */}
          </div>
          <div />
          {/* ------------- Composición ------------- */}
          <div className="col-lg-6 col-sm-6">
            <RadioGroupCustom
              row
              formLabel="Composición"
              defaultValue="radio1"
              name="radio-group-tipo"
              id="radioId"
              options={compositionList}
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
          {/* ------------- Ficha técnica ------------- */}
          <div className="col-lg-10 col-sm-6 mt-3">
            <TextField
              multiline
              minRows={5}
              inputRef={materialDataSheet}
              type="number"
              fullWidth
              inputProps={{ min: 0 }}
              label="Ficha técnica"
              variant="outlined"
            />
          </div>
        </div>
      </div>
    </MainContainer>
  );
};
