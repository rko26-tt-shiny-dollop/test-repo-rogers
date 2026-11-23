import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import CartItemRow from './CartItemRow';
import { formatCurrency } from './formatCurrency';

const COLUMNS = ['S. No.', 'Product Image', 'Product Name', 'Unit Price', 'Quantity', 'Total', 'Remove'];

export default function Cart() {
  const { items, subtotal } = useCart();
  const { darkMode } = useTheme();

  const panel = `${darkMode ? 'bg-gray-800 text-light border-gray-700' : 'bg-white text-gray-800 border-gray-200'} rounded-lg border shadow-lg transition-colors duration-300`;
  const cellBorder = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className="pt-20 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1
          className={`text-3xl font-bold mb-6 ${darkMode ? 'text-light' : 'text-gray-800'} transition-colors duration-300`}
        >
          Shopping Cart
        </h1>
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className={`${panel} w-full lg:flex-1 overflow-x-auto`}>
            <table className="w-full">
              <thead>
                <tr>
                  {COLUMNS.map((column) => (
                    <th key={column} scope="col" className="px-4 py-3 text-center font-bold">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <CartItemRow key={item.product.productId} item={item} index={index} />
                ))}
              </tbody>
            </table>
          </div>

          <section aria-labelledby="order-summary-heading" className={`${panel} w-full lg:w-80`}>
            <h2 id="order-summary-heading" className="text-2xl font-bold text-center py-4">
              Order Summary
            </h2>
            <dl>
              <div className={`flex justify-between px-6 py-3 border-t ${cellBorder}`}>
                <dt className="font-semibold">Subtotal</dt>
                <dd>{formatCurrency(subtotal)}</dd>
              </div>
              <div className={`flex justify-between px-6 py-3 border-t ${cellBorder}`}>
                <dt className="font-semibold">Grand Total</dt>
                <dd className="font-bold text-primary">{formatCurrency(subtotal)}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
