import React from 'react';
import { internet } from 'faker';
import {
  render,
  RenderResult,
  fireEvent,
  cleanup
} from '@testing-library/react';
import { Login } from './login';
import { ValidationSpy } from '@/presentation/test';

type SutTypes = {
  sut: RenderResult;
  validationSpy: ValidationSpy;
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const sut = render(<Login validation={validationSpy} />);
  return { sut, validationSpy };
};

describe('Login Component', () => {
  afterEach(cleanup);

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

  test('Should call Validation with correct email', () => {
    const {
      sut: { getByTestId },
      validationSpy
    } = makeSut();
    const email = internet.email();
    const emailInput = getByTestId('email-input');
    fireEvent.input(emailInput, { target: { value: email } });

    expect(validationSpy.fieldName).toBe('email');
    expect(validationSpy.fieldValue).toBe(email);
  });

  test('Should call Validation with correct password', () => {
    const {
      sut: { getByTestId },
      validationSpy
    } = makeSut();
    const password = internet.password();
    const passwordInput = getByTestId('password-input');
    fireEvent.input(passwordInput, { target: { value: password } });

    expect(validationSpy.fieldName).toBe('password');
    expect(validationSpy.fieldValue).toBe(password);
  });
});
