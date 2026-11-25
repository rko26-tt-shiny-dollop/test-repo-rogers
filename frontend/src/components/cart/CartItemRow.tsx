import { useEffect, useState } from 'react';
import { CartItem, getUnitPrice, useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from './formatCurrency';

interface CartItemRowProps {
  item: CartItem;
  index: number;
}

export default function CartItemRow({ item, index }: CartItemRowProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { darkMode } = useTheme();
  const { product, quantity } = item;
  const unitPrice = getUnitPrice(product);
  const [draft, setDraft] = useState(String(quantity));

  useEffect(() => {
    setDraft(String(quantity));
  }, [quantity]);

  const handleChange = (value: string) => {
    setDraft(value);
    const parsed = Number(value);
    if (value.trim() !== '' && Number.isInteger(parsed) && parsed >= 1) {
      updateQuantity(product.productId, parsed);
    }
  };

  const cellBorder = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <tr className={`border-t ${cellBorder}`}>
      <td className="px-4 py-3 text-center font-semibold">{index + 1}</td>
      <td className="px-4 py-3">
        <img
          src={`/${product.imgName}`}
          alt={product.name}
          width={80}
          height={80}
          className="w-20 h-20 object-contain mx-auto"
        />
      </td>
      <td className="px-4 py-3 text-center font-semibold">{product.name}</td>
      <td className="px-4 py-3 text-center font-semibold">{formatCurrency(unitPrice)}</td>
      <td className="px-4 py-3 text-center">
        <label htmlFor={`cart-qty-${product.productId}`} className="sr-only">
          Quantity of {product.name}
        </label>
        <input
          id={`cart-qty-${product.productId}`}
          type="number"
          min={1}
          step={1}
          inputMode="numeric"
          value={draft}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => setDraft(String(quantity))}
          className={`w-16 px-2 py-1 text-center rounded-md border ${darkMode ? 'bg-gray-800 text-light border-gray-600' : 'bg-white text-gray-800 border-gray-300'} focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none`}
        />
      </td>
      <td className="px-4 py-3 text-center font-semibold">
        {formatCurrency(unitPrice * quantity)}
      </td>
      <td className="px-4 py-3 text-center">
        <button
          type="button"
          onClick={() => removeFromCart(product.productId)}
          className="p-2 rounded-md text-primary hover:text-accent focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          aria-label={`Remove ${product.name} from cart`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </td>
    </tr>
  );
}
