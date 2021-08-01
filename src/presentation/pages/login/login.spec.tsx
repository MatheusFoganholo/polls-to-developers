import React from 'react';
import {
  render,
  RenderResult,
  fireEvent,
  cleanup
} from '@testing-library/react';
import { Login } from './login';
import { Validation } from '@/presentation/protocols/validation';

type SutTypes = {
  sut: RenderResult;
  validationSpy: ValidationSpy;
};

class ValidationSpy implements Validation {
  errorMessage: string;
  input: object;

  validate(input: object): string {
    this.input = input;
    return this.errorMessage;
  }
}

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
    const emailInput = getByTestId('email-input');
    fireEvent.input(emailInput, { target: { value: 'any_email' } });

    expect(validationSpy.input).toEqual({
      email: 'any_email'
    });
  });

  test('Should call Validation with correct password', () => {
    const {
      sut: { getByTestId },
      validationSpy
    } = makeSut();
    const passwordInput = getByTestId('password-input');
    fireEvent.input(passwordInput, { target: { value: 'any_password' } });

    expect(validationSpy.input).toEqual({
      password: 'any_password'
    });
  });
});
