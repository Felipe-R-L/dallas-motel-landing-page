export const formatPrice = (price: number) =>
  Number(price).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
