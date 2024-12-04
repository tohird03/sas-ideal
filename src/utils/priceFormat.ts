export const priceFormat = (price: string | number | null | undefined) => {
  if (!price) {
    return '0';
  }

  const numberPrice = Number(price);

  if (Number.isInteger(numberPrice)) {
    return numberPrice.toLocaleString('en-US');
  }

  return numberPrice.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 5});
};
