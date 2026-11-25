import { describe, expect, it } from 'vitest';
import { getUnitPrice } from './CartContext';

describe('getUnitPrice', () => {
  it('applies a product discount', () => {
    expect(getUnitPrice({ price: 100, discount: 0.25 })).toBe(75);
  });

  it('keeps the original price when no discount applies', () => {
    expect(getUnitPrice({ price: 20 })).toBe(20);
    expect(getUnitPrice({ price: 20, discount: 0 })).toBe(20);
    expect(getUnitPrice({ price: 20, discount: null })).toBe(20);
  });

  it('rounds discounted prices to cents', () => {
    expect(getUnitPrice({ price: 10, discount: 0.333 })).toBe(6.67);
  });
});
