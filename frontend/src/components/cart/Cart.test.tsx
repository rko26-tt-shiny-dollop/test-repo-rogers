import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Navigation from '../Navigation';
import Products from '../entity/product/Products';
import Cart from './Cart';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { CartProvider } from '../../context/CartContext';

vi.mock('axios', () => ({ default: { get: vi.fn() } }));

const products = [
  {
    productId: 1,
    name: 'SmartFeeder One',
    description: 'Feeder',
    price: 100,
    imgName: 'feeder.png',
    sku: 'FEED-1',
    unit: 'piece',
    supplierId: 1,
    discount: 0.25,
  },
  {
    productId: 2,
    name: 'Litter Dome',
    description: 'Litter box',
    price: 20,
    imgName: 'dome.png',
    sku: 'DOME-1',
    unit: 'piece',
    supplierId: 1,
  },
];

function renderApp() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/products']}>
        <AuthProvider>
          <ThemeProvider>
            <CartProvider>
              <Navigation />
              <Routes>
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
              </Routes>
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const user = userEvent.setup();

async function addToCart(name: string, quantity: number) {
  for (let i = 0; i < quantity; i++) {
    await user.click(await screen.findByRole('button', { name: `Increase quantity of ${name}` }));
  }
  await user.click(screen.getByRole('button', { name: `Add ${quantity} ${name} to cart` }));
}

const cartLink = () => screen.getByRole('link', { name: /^Cart,/ });

async function openCart() {
  await user.click(cartLink());
  return screen.getByRole('table');
}

function cartRows(table: HTMLElement) {
  return within(table).getAllByRole('row').slice(1);
}

function summaryValue(label: string) {
  return screen.getByText(label).nextElementSibling?.textContent;
}

describe('Cart', () => {
  beforeEach(() => {
    vi.mocked(axios.get).mockResolvedValue({ data: products });
  });

  it('adds the selected quantity without a pop-up and resets the selector', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    renderApp();
    await addToCart('SmartFeeder One', 2);

    expect(alertSpy).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Quantity of SmartFeeder One')).toHaveTextContent('0');
    expect(cartLink()).toHaveAccessibleName('Cart, 2 items');
    alertSpy.mockRestore();
  });

  it('increases the quantity when the same product is added again', async () => {
    renderApp();
    await addToCart('SmartFeeder One', 1);
    await addToCart('SmartFeeder One', 2);

    const rows = cartRows(await openCart());
    expect(rows).toHaveLength(1);
    expect(screen.getByLabelText('Quantity of SmartFeeder One')).toHaveValue(3);
  });

  it('shows a cart icon in the navigation that links to the cart page', async () => {
    renderApp();
    expect(cartLink()).toHaveAttribute('href', '/cart');
  });

  it('shows the total number of units in the badge and hides it when empty', async () => {
    renderApp();
    expect(cartLink()).toHaveTextContent(/^$/);

    await addToCart('SmartFeeder One', 2);
    await addToCart('Litter Dome', 1);
    expect(cartLink()).toHaveTextContent('3');
    expect(cartLink()).toHaveAccessibleName('Cart, 3 items');
  });

  it('lists each item with number, image, name, unit price, quantity, total and remove', async () => {
    renderApp();
    await addToCart('Litter Dome', 2);
    const table = await openCart();

    const headers = within(table).getAllByRole('columnheader').map((h) => h.textContent);
    expect(headers).toEqual([
      'S. No.',
      'Product Image',
      'Product Name',
      'Unit Price',
      'Quantity',
      'Total',
      'Remove',
    ]);
    const row = within(cartRows(table)[0]);
    expect(row.getByText('1')).toBeInTheDocument();
    expect(row.getByRole('img', { name: 'Litter Dome' })).toHaveAttribute('src', '/dome.png');
    expect(row.getByText('Litter Dome')).toBeInTheDocument();
    expect(row.getByText('$20.00')).toBeInTheDocument();
    expect(row.getByLabelText('Quantity of Litter Dome')).toHaveValue(2);
    expect(row.getByText('$40.00')).toBeInTheDocument();
    expect(row.getByRole('button', { name: 'Remove Litter Dome from cart' })).toBeInTheDocument();
  });

  it('uses the discounted price as the unit price', async () => {
    renderApp();
    await addToCart('SmartFeeder One', 2);
    const row = within(cartRows(await openCart())[0]);

    expect(row.getByText('$75.00')).toBeInTheDocument();
    expect(row.getByText('$150.00')).toBeInTheDocument();
  });

  it('updates totals and badge immediately when a quantity changes, with a minimum of 1', async () => {
    renderApp();
    await addToCart('SmartFeeder One', 1);
    await addToCart('Litter Dome', 1);
    await openCart();
    const input = screen.getByLabelText('Quantity of Litter Dome');

    await user.clear(input);
    await user.type(input, '3');
    expect(screen.getByText('$60.00')).toBeInTheDocument();
    expect(summaryValue('Subtotal')).toBe('$135.00');
    expect(summaryValue('Grand Total')).toBe('$135.00');
    expect(cartLink()).toHaveAccessibleName('Cart, 4 items');

    await user.clear(input);
    await user.type(input, '0');
    await user.tab();
    expect(input).toHaveValue(3);
    expect(summaryValue('Subtotal')).toBe('$135.00');
  });

  it('removes an item and updates totals and badge', async () => {
    renderApp();
    await addToCart('SmartFeeder One', 1);
    await addToCart('Litter Dome', 2);
    const table = await openCart();

    await user.click(screen.getByRole('button', { name: 'Remove SmartFeeder One from cart' }));
    expect(screen.queryByText('SmartFeeder One')).not.toBeInTheDocument();
    expect(cartRows(table)).toHaveLength(1);
    expect(summaryValue('Subtotal')).toBe('$40.00');
    expect(cartLink()).toHaveAccessibleName('Cart, 2 items');
  });

  it('shows only a subtotal and grand total with no checkout, coupon or extra rows', async () => {
    renderApp();
    await addToCart('Litter Dome', 1);
    await openCart();
    const summary = screen.getByRole('region', { name: 'Order Summary' });

    expect(within(summary).getAllByRole('term').map((t) => t.textContent)).toEqual([
      'Subtotal',
      'Grand Total',
    ]);
    expect(screen.queryByText(/checkout|coupon|shipping|discount|update cart/i)).toBeNull();
  });

  it('keeps the cart in memory only, so it is empty after a reload', async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    const { unmount } = renderApp();
    await addToCart('Litter Dome', 1);
    expect(cartLink()).toHaveAccessibleName('Cart, 1 item');
    expect(setItemSpy.mock.calls.every(([key]) => key === 'theme')).toBe(true);

    unmount();
    renderApp();
    expect(cartLink()).toHaveAccessibleName('Cart, 0 items');
    setItemSpy.mockRestore();
  });
});
