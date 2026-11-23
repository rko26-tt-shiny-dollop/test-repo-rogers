/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import type { Product } from '../components/entity/product/Products';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  totalUnits: number;
  subtotal: number;
  addToCart: (product: Product, quantity: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
}

const noop = () => {};

// Safe default so components using the cart (e.g. Navigation) render without a provider.
const CartContext = createContext<CartContextType>({
  items: [],
  totalUnits: 0,
  subtotal: 0,
  addToCart: noop,
  updateQuantity: noop,
  removeFromCart: noop,
});

export function getUnitPrice(product: Product): number {
  const hasDiscount = product.discount != null && product.discount > 0;
  const price = hasDiscount ? product.price * (1 - product.discount!) : product.price;
  return Math.round(price * 100) / 100;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product, quantity: number) => {
    if (quantity <= 0) {
      return;
    }
    setItems((prev) => {
      const existing = prev.find((item) => item.product.productId === product.productId);
      if (existing) {
        return prev.map((item) =>
          item.product.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (!Number.isInteger(quantity) || quantity < 1) {
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.product.productId === productId ? { ...item, quantity } : item)),
    );
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setItems((prev) => prev.filter((item) => item.product.productId !== productId));
  }, []);

  const value = useMemo(() => {
    const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
      (sum, item) => sum + getUnitPrice(item.product) * item.quantity,
      0,
    );
    return { items, totalUnits, subtotal, addToCart, updateQuantity, removeFromCart };
  }, [items, addToCart, updateQuantity, removeFromCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
