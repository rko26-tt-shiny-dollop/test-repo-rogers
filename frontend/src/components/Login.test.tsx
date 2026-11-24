import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Login from './Login';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

function renderLogin(errorParam: string) {
  return render(
    <MemoryRouter initialEntries={[`/login?error=${encodeURIComponent(errorParam)}`]}>
      <AuthProvider>
        <ThemeProvider>
          <Login />
        </ThemeProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('Login', () => {
  it('renders an HTML/script error query param as literal text without injecting markup', () => {
    const payload = '<script>alert(1)</script>';
    renderLogin(payload);

    expect(screen.getByText(payload)).toBeInTheDocument();
    expect(document.querySelector('script')).not.toBeInTheDocument();
  });

  it('displays a legitimate error message unchanged', () => {
    const message = 'Invalid credentials, please try again.';
    renderLogin(message);

    expect(screen.getByText(message)).toBeInTheDocument();
  });
});
