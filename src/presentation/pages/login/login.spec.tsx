import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import { Login } from './login';

type SutTypes = {
  sut: RenderResult;
};

const makeSut = (): SutTypes => {
  const sut = render(<Login />);
  return { sut };
};

describe('Login Component', () => {
  test('Should initialize with initial state', () => {
    const {
      sut: { getByTestId }
    } = makeSut();
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
