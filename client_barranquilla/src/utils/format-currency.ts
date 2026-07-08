export const formatCurrency = (value: string | number): string => {
  if (typeof value === "string") {
    value = value.replace(/[^0-9.-]/g, "");
  }
  const numericValue = parseFloat(value as string);

  return isNaN(numericValue)
    ? ""
    : new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(numericValue);
};