export const formatPrice = (price: string) => {
  return `$${price?.replace('USD', '')}`;
};
