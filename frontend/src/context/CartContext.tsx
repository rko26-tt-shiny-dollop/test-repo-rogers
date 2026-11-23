interface Product {
  price: number;
  discount?: number | null;
}

export function getUnitPrice(product: Product): number {
  const hasDiscount = product.discount != null && product.discount > 0;
  const price = hasDiscount ? product.price * (1 - product.discount!) : product.price;
  return Math.round(price * 100) / 100;
}
