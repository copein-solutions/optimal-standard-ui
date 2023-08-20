import { GridColumnGroupingModel } from "@mui/x-data-grid";

export const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: "Base",
    children: [
      { field: "materialBaseName" },
      { field: "materialBaseType" },
      { field: "materialBaseUnitPrice" },
      { field: "materialBaseComponent" },
    ],
  },
  {
    groupId: "Aplicación",
    children: [
      { field: "totalConsumption" },
      { field: "layers" },
      { field: "applicationMode" },
      { field: "cured" },
    ],
  },
  {
    groupId: "Mallas",
    children: [
      { field: "materialMeshName" },
      { field: "materialMeshUnitPrice" },
      { field: "materialPartialMeshName" },
      { field: "materialPartialMeshUnitPrice" },
      { field: "materialPartialMeshCoef" },
    ],
  },
  {
    groupId: "Complementos",
    children: [
      { field: "materialPlugin1Name" },
      { field: "materialPlugin1Description" },
      { field: "materialPlugin1UnitPrice" },
      { field: "materialPlugin1Coef" },
      { field: "materialPlugin2Name" },
      { field: "materialPlugin2Description" },
      { field: "materialPlugin2UnitPrice" },
      { field: "materialPlugin2Coef" },
      { field: "materialPlugin3Name" },
      { field: "materialPlugin3Description" },
      { field: "materialPlugin3UnitPrice" },
      { field: "materialPlugin3Coef" },
    ],
  },
  {
    groupId: "Restricciones",
    children: [
      { field: "materialAreaRestrictions" },
      { field: "materialPotLife" },
      { field: "materialMinApplicableTemp" },
      { field: "materialAreaDescription" },
    ],
  },
  {
    groupId: "Sistema de capas",
    children: [{ field: "baseConditions" }, { field: "supportConditions" }],
  },
];

export const header = [
  { name: "Campo de aplicación", value: "applicationAreaName", width: 450 },
  { name: "Precio", value: "totalPrice", width: 150 },
  // Material base
  { name: "Material", value: "materialBaseName", width: 250 },
  {
    name: "Tipo",
    value: "materialBaseType",
    description: "(Acrílicos, siliconados, cementosos, poliuretánicos)",
    width: 250,
  },
  {
    name: "Precio unitario",
    value: "materialBaseUnitPrice",
    width: 150,
  },
  { name: "Composición", value: "materialBaseComponent", width: 150 },
  // Aplicacion
  { name: "Consumo total", value: "totalConsumption", width: 100 },
  { name: "Manos", value: "layers", width: 75 },
  { name: "Modo de aplicación", value: "applicationMode", width: 150 },
  { name: "Curado", value: "cured", width: 75 },
  // Malla 100%
  { name: "Malla 100%", value: "materialMeshName", width: 350 },
  {
    name: "Precio unitario",
    value: "materialMeshUnitPrice",
    width: 150,
  },
  // Malla 50%
  { name: "Malla Parcial", value: "materialPartialMeshName", width: 350 },
  {
    name: "Precio unitario",
    value: "materialPartialMeshUnitPrice",
    width: 150,
  },
  { name: "Coef. por m2", value: "materialPartialMeshCoef", width: 150 },
  // Material complementario 1
  {
    name: "Complemento del sistema",
    value: "materialPlugin1Name",
    width: 350,
  },
  { name: "Descripción", value: "materialPlugin1Description", width: 150 },
  { name: "Precio unitario", value: "materialPlugin1UnitPrice", width: 150 },
  { name: "Coef. por m2", value: "materialPlugin1Coef", width: 150 },
  // Material complementario 2
  {
    name: "Complemento del sistema 2",
    value: "materialPlugin2Name",
    width: 350,
  },
  { name: "Descripción", value: "materialPlugin2Description", width: 150 },
  { name: "Precio unitario", value: "materialPlugin2UnitPrice", width: 150 },
  { name: "Coef. por m2", value: "materialPlugin2Coef", width: 150 },
  // Material complementario 3
  {
    name: "Complemento del sistema 3",
    value: "materialPlugin3Name",
    width: 350,
  },
  { name: "Descripción", value: "materialPlugin3Description", width: 150 },
  { name: "Precio unitario", value: "materialPlugin3UnitPrice", width: 150 },
  { name: "Coef. por m2", value: "materialPlugin3Coef", width: 150 },
  // Restricciones
  { name: "Por área m2", value: "materialAreaRestrictions", width: 225 },
  { name: "Vida útil (hrs)", value: "materialPotLife", width: 225 },
  {
    name: "Temp. mínima de aplicación (°C)",
    value: "materialMinApplicableTemp",
    width: 225,
  },
  { name: "Otras", value: "materialAreaDescription", width: 225 },
  // Sistema de capaz
  { name: "Condiciones de base", value: "baseConditions", width: 225 },
  { name: "Condiciones de soporte", value: "supportConditions", width: 225 },
];
