export const getUnitPrice = (
  presentationPrice: number,
  presentationQuantity: number,
  presentationUnit?: string,
  withSubfix?: boolean
) => {
  let unitPrice =
    presentationPrice / (presentationQuantity === 0 ? 1 : presentationQuantity);
  if (withSubfix) {
    return `${String(truncarDecimales(unitPrice, 2))} $/${presentationUnit}`;
  } else {
    return `${String(truncarDecimales(unitPrice, 2))}`;
  }
};

export const truncarDecimales = (numero: number, cantidadDecimales: number) => {
  const multiplicador = Math.pow(10, cantidadDecimales);
  const numeroTruncado = Math.floor(numero * multiplicador) / multiplicador;
  return numeroTruncado;
};
