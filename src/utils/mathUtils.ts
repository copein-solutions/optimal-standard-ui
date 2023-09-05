import { SystemFormInputs } from "../interfaces/form/FormInterfaces";

/**
 * Calcula el precio unitario en base a la información de presentación.
 *
 * @param presentationPrice - El precio total de la presentación.
 * @param presentationQuantity - Cantidad de presentación.
 * @param presentationUnit - (Opcional) La unidad de medida de la presentación.
 * @param withSufix - (Opcional) Si se debe incluir el sufijo de unidad en el resultado.
 * @returns El precio unitario calculado como una cadena formateada.
 */
export const getUnitPrice = (
  presentationPrice: number,
  presentationQuantity: number,
  presentationUnit?: string,
  withSufix?: boolean
) => {
  let unitPrice =
    presentationPrice / (presentationQuantity === 0 ? 1 : presentationQuantity);
  if (withSufix) {
    return `${String(truncateDecimals(unitPrice, 2))} $/${presentationUnit}`;
  } else {
    return `${String(truncateDecimals(unitPrice, 2))}`;
  }
};

/**
 * Trunca un número decimal a una cantidad específica de decimales.
 *
 * @param numero El número decimal que se va a truncar.
 * @param cantidadDecimales El número de decimales a los que se quiere truncar.
 * @returns El número truncado con la cantidad de decimales especificada.
 */
export const truncateDecimals = (
  numero: number,
  cantidadDecimales: number
): number => {
  const multiplicador = Math.pow(10, cantidadDecimales);
  const numeroTruncado = Math.floor(numero * multiplicador) / multiplicador;
  return numeroTruncado;
};

/**
 * Calcula el precio unitario de del material base del sistema
 */
export function getUnitPriceBaseMaterialSystem(
  formValues: SystemFormInputs,
  selectedBaseMaterialPrice: string,
  selectedTotalMeshPrice: string,
  selectedPartialMeshPrice: string,
  selectedPluginMaterialDetailPrice1: string,
  selectedPluginMaterialDetailPrice2: string,
  selectedPluginMaterialDetailPrice3: string
): number {
  const parcialMeshCoefficient =
    formValues.systemParcialMeshCoefficient !== undefined
      ? Number(formValues.systemParcialMeshCoefficient)
      : 0;

  const pluginMaterialCoefficient1 =
    formValues.systemOthersPluginsMaterialCoefficient0 !== undefined
      ? Number(formValues.systemOthersPluginsMaterialCoefficient0)
      : 0;

  const pluginMaterialCoefficient2 =
    formValues.systemOthersPluginsMaterialCoefficient1 !== undefined
      ? Number(formValues.systemOthersPluginsMaterialCoefficient1)
      : 0;

  const pluginMaterialCoefficient3 =
    formValues.systemOthersPluginsMaterialCoefficient2 !== undefined
      ? Number(formValues.systemOthersPluginsMaterialCoefficient2)
      : 0;

  const systemUnitPrice =
    Number(selectedBaseMaterialPrice) * Number(formValues.totalConsumption) +
    Number(selectedTotalMeshPrice) +
    Number(selectedPartialMeshPrice) * parcialMeshCoefficient +
    Number(selectedPluginMaterialDetailPrice1) * pluginMaterialCoefficient1 +
    Number(selectedPluginMaterialDetailPrice2) * pluginMaterialCoefficient2 +
    Number(selectedPluginMaterialDetailPrice3) * pluginMaterialCoefficient3;

  const formatSystemUnitPrice =
    systemUnitPrice !== undefined ? truncateDecimals(systemUnitPrice, 2) : 0;

  return formatSystemUnitPrice;
}

/**
 * Calcula el precio por m²
 * @param coefficient El coeficiente por m² ingresado por el usuario.
 * @param unitPrice El precio unitario del material.
 * @returns precio por m² del material
 */
export function calculatePricePerCoefficientParcialMesh(
  coefficient: number,
  unitPrice: number
): number {
  return truncateDecimals(coefficient * unitPrice, 2);
}

export function getTotalLaborCost(
  baseMaterialLaborCost: number,
  totalMeshLaborCost: number,
  parcialMeshLaborCost: number,
  pluginMaterialLaborCost0: number,
  pluginMaterialLaborCost1: number,
  pluginMaterialLaborCost2: number
): number {
  const params = [
    baseMaterialLaborCost,
    totalMeshLaborCost,
    parcialMeshLaborCost,
    pluginMaterialLaborCost0,
    pluginMaterialLaborCost1,
    pluginMaterialLaborCost2,
  ];

  const notNaNParams = params.filter((param) => !isNaN(param));

  if (notNaNParams.length === 0) {
    return 0;
  }

  const price = notNaNParams.reduce((total, param) => total + param, 0);
  console.log(price);
  return price;
}
