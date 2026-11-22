import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Navigation from './Navigation';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

function renderNavigation() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <ThemeProvider>
          <Navigation />
        </ThemeProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('Navigation', () => {
  it('links to the products page', () => {
    renderNavigation();
    expect(screen.getAllByRole('link', { name: 'Products' })[0]).toHaveAttribute(
      'href',
      '/products',
    );
  });
});
