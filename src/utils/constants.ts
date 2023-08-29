//# routes constants

// Home
export const HOME = "/";

// Login
export const LOGIN = "/login";

// Material
export const MATERIAL_CREATE = "/material/create";
export const MATERIAL_LIST = "/material/list";
export const MATERIAL_EDIT = "/material/:id/update";

// Application area
export const APPLICATION_AREA_CREATE = "/application_area/create";
export const APPLICATION_AREA_LIST = "/application_area/list";
export const APPLICATION_AREA_EDIT = "/application_area/:id/update";

// System
export const SYSTEM_CREATE = "/system/create";
export const SYSTEM_LIST = "/system/list";
export const SYSTEM_EDIT = "/system/:id/update";
export const SYSTEM_READONLY = "/system/:id/view";

// Roles
export const ADMIN_ROL = "ROLE_ADMIN";
export const COMMENTOR_ROL = "ROLE_COMMENTOR"
export const READONLY_ROL = "ROLE_READONLY"

//#endregion

// data constants
export const MATERIAL_TYPE = [
  {
    value: "cementicio",
    label: "Cementicio",
  },
  {
    value: "acrílico",
    label: "Acrílico",
  },
  {
    value: "epoxi",
    label: "Epoxi",
  },
  {
    value: "poliuretánico",
    label: "Poliuretánico",
  },
  {
    value: "mantas varias",
    label: "Mantas varias",
  },
  {
    value: "malla",
    label: "Malla",
  },
  {
    value: "pintura",
    label: "Pintura",
  },
  {
    value: "sellador",
    label: "Sellador",
  },
  {
    value: "siliconado",
    label: "Siliconado",
  },
  {
    value: "malla",
    label: "Malla",
  },
  {
    value: "junta hidroexpansiva",
    label: "Junta hidroexpansiva",
  },
  {
    value: "otro",
    label: "otro",
  },
];

export const CURRENCY = [
  {
    value: "USD",
    label: "USD",
  },
  {
    value: "$",
    label: "$",
  },
];

export const MATERIAL_UNIT = [
  {
    value: "kg",
    label: "Kilogramos",
  },
  {
    value: "l",
    label: "Litros",
  },
  {
    value: "m²",
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

export const MATERIAL_COMPONENTS = [
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

export const APPLICATION_MODE = [
  {
    label: "Brocha",
    value: "brocha",
  },
  {
    label: "Llana",
    value: "llana",
  },
  {
    label: "Rodillo",
    value: "rodillo",
  },
  {
    label: "Aspersor",
    value: "aspersor",
  },
];

export const SI_NO = [
  {
    label: "Si",
    value: "si",
  },
  {
    label: "No",
    value: "no",
  },
];

export const SI_NO_NE = [
  {
    label: "Si",
    value: "si",
  },
  {
    label: "No",
    value: "no",
  },
  {
    label: "N/E",
    value: "n/e",
  },
];
