export const getUnitPrice = (
  presentationPrice: number,
  presentationQuantity: number,
  presentationUnit?: string,
  withSufix?: boolean
) => {
  let unitPrice =
    presentationPrice / (presentationQuantity === 0 ? 1 : presentationQuantity);
  if (withSufix) {
    return `${String(truncarDecimales(unitPrice, 2))} $/${presentationUnit}`;
  } else {
    return `${String(truncarDecimales(unitPrice, 2))}`;
  }
};

/**
 * Trunca un número decimal a una cantidad específica de decimales.
 * 
 * @param numero El número decimal que se va a truncar.
 * @param cantidadDecimales El número de decimales a los que se quiere truncar.
 * @returns El número truncado con la cantidad de decimales especificada.
 */
export const truncarDecimales = (numero: number, cantidadDecimales: number) => {
  const multiplicador = Math.pow(10, cantidadDecimales);
  const numeroTruncado = Math.floor(numero * multiplicador) / multiplicador;
  return numeroTruncado;
};
