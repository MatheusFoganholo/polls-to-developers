import React from 'react';
import { render } from '@testing-library/react';
import { Login } from './login';

describe('Login Component', () => {
  test('Should initialize with initial state', () => {
    const { getByTestId } = render(<Login />);
    const errorWrapper = getByTestId('error-wrapper');
    const submitButton = getByTestId('submit-button') as HTMLButtonElement;
    const emailStatus = getByTestId('email-status');
    const passwordStatus = getByTestId('password-status');

    expect(errorWrapper.childElementCount).toBe(0);
    expect(submitButton.disabled).toBe(true);
    expect(emailStatus.title).toBe('Required field');
    expect(emailStatus.textContent).toBe('🔴');
    expect(passwordStatus.title).toBe('Required field');
    expect(passwordStatus.textContent).toBe('🔴');
  });
});
