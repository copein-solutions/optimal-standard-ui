import { MainContainer } from "../mainContainer/MainContainer";
import SelectField from "../selectField/SelectField";
import { Divider, Typography, TextField } from "@mui/material";
import MultiSelectWithSearch from "../multiSelect/MultiSelect";
import RadioGroupCustom from "../radioGroup/RadioGroup";

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

const compositionList = [
  {
    value: "radio1",
    label: "Monocompuesto",
  },
  {
    value: "radio2",
    label: "Bicompuesto",
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

export const MaterialForm = () => {
  return (
    <MainContainer cardTitle="Alta de material">
      <div className="container">
        {/* ------------- Nombre ------------- */}
        <div className="row mb-3">
          <div className="col-lg-6 col-sm-6">
            <TextField fullWidth label="Nombre" variant="outlined" />
          </div>
          {/* ------------- Clasificación ------------- */}
          <div className="col-lg-6 col-sm-6">
            <SelectField label="Clasificación" options={optionsSelect} />
          </div>
        </div>
        {/* ------------- Campo de aplicación ------------- */}
        <div className="row">
          <div className="col-lg-8 col-sm-12">
            <MultiSelectWithSearch
              label="Campo de aplicación"
              options={optionsApplicationArea}
            />
          </div>
        </div>
        <Typography
          align="left"
          variant="subtitle1"
          component="div"
          sx={{ mt: 3 }}
        >
          Base
        </Typography>
        <Divider />
        <div className="row mt-3">
          {/* ------------- Precio unitario ($/kg) ------------- */}
          <div className="col-lg-6 col-sm-6">
            <TextField
              type="number"
              fullWidth
              inputProps={{ min: 0 }}
              label="Precio unitario ($/kg)"
              variant="outlined"
            />
          </div>
          {/* ------------- Tipo ------------- */}
          <div className="col-lg-6 col-sm-6">
            <SelectField label="Tipo" options={tipe} />
          </div>
          {/* ------------- Precio unitario ($/m2) ------------- */}
          <div className="col-lg-6 col-sm-6 mt-3">
            <TextField
              type="number"
              fullWidth
              inputProps={{ min: 0 }}
              label="Precio unitario ($/m2)"
              variant="outlined"
            />
          </div>
          {/* ------------- Composición ------------- */}
          <div className="col-lg-6 col-sm-6 mt-3">
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
          Aplicación
        </Typography>
        <Divider />
        <div className="row mt-3">
          {/* ------------- Consumo total ------------- */}
          <div className="col-lg-6 col-sm-6">
            <TextField
              type="number"
              fullWidth
              inputProps={{ min: 0 }}
              label="Consumo total"
              variant="outlined"
            />
          </div>
          {/* ------------- Cantidad de manos ------------- */}
          <div className="col-lg-6 col-sm-6">
            <TextField
              type="number"
              fullWidth
              inputProps={{ min: 0 }}
              label="Cantidad de manos"
              variant="outlined"
            />
          </div>
          {/* ------------- Modo de aplicación ------------- */}
          <div className="col-lg-6 col-sm-6 mt-3">
            <SelectField label="Modo de aplicación" options={applicationMode} />
          </div>
          {/* ------------- Curado ------------- */}
          <div className="col-lg-6 col-sm-6 mt-3">
            <RadioGroupCustom
              row
              formLabel="Curado"
              defaultValue="Curado2"
              name="radio-group-tipo"
              id="curado1"
              options={curadoList}
            />
          </div>
        </div>
      </div>
    </MainContainer>
  );
};
