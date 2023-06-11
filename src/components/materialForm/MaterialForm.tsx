import { MainContainer } from "../mainContainer/MainContainer";
import SelectField from "../selectField/SelectField";
import { Divider, Typography, TextField } from "@mui/material";
import RadioGroupCustom from "../radioGroup/RadioGroup";
import "./MaterialForm.css";
import { forwardRef, useRef, useState } from "react";

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
}

export const MaterialForm = () => {
  const [formErrors, setFormErrors] = useState<FormError[]>([]);
  
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
    event.preventDefault();
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
              label="Nombre"
              variant="outlined"
              error={!!formErrors.find((error) => error.field === 'username')}
              helperText={formErrors.find((error) => error.field === 'username')?.message || ''}
              onChange={handleInputChange}
            />
          </div>
          {/* ------------- Marca ------------- */}
          <div className="col-lg-6 col-sm-6">
            <TextField
              inputRef={materialBrandRef}
              fullWidth
              label="Marca"
              variant="outlined"
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
              inputProps={{ min: 0 }}
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
