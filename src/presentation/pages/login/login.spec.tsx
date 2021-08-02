import React from 'react';
import { internet, random } from 'faker';
import {
  render,
  RenderResult,
  fireEvent,
  cleanup
} from '@testing-library/react';
import { Login } from './login';
import { ValidationStub } from '@/presentation/test';

type SutTypes = {
  sut: RenderResult;
  validationStub: ValidationStub;
};

const makeSut = (): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = random.words();
  const sut = render(<Login validation={validationStub} />);
  return { sut, validationStub };
};

describe('Login Component', () => {
  afterEach(cleanup);

  test('Should initialize with initial state', () => {
    const {
      sut: { getByTestId },
      validationStub
    } = makeSut();
    const errorWrapper = getByTestId('error-wrapper');
    const submitButton = getByTestId('submit-button') as HTMLButtonElement;
    const emailStatus = getByTestId('email-status');
    const passwordStatus = getByTestId('password-status');

    expect(errorWrapper.childElementCount).toBe(0);
    expect(submitButton.disabled).toBe(true);
    expect(emailStatus.title).toBe(validationStub.errorMessage);
    expect(emailStatus.textContent).toBe('🔴');
    expect(passwordStatus.title).toBe(validationStub.errorMessage);
    expect(passwordStatus.textContent).toBe('🔴');
  });

  test('Should show email error if Validation fails', () => {
    const {
      sut: { getByTestId },
      validationStub
    } = makeSut();
    const emailInput = getByTestId('email-input');
    const emailStatus = getByTestId('email-status');

    fireEvent.input(emailInput, { target: { value: internet.email() } });

    expect(emailStatus.title).toBe(validationStub.errorMessage);
    expect(emailStatus.textContent).toBe('🔴');
  });

  test('Should show password error if Validation fails', () => {
    const {
      sut: { getByTestId },
      validationStub
    } = makeSut();
    const passwordInput = getByTestId('password-input');
    const passwordStatus = getByTestId('password-status');

    fireEvent.input(passwordInput, { target: { value: internet.password() } });

    expect(passwordStatus.title).toBe(validationStub.errorMessage);
    expect(passwordStatus.textContent).toBe('🔴');
  });

  test('Should show valid email state if Validation succeeds', () => {
    const {
      sut: { getByTestId },
      validationStub
    } = makeSut();
    const emailInput = getByTestId('email-input');
    const emailStatus = getByTestId('email-status');

    validationStub.errorMessage = null;
    fireEvent.input(emailInput, { target: { value: internet.email() } });

    expect(emailStatus.title).toBe('No errors.');
    expect(emailStatus.textContent).toBe('✅');
  });

  test('Should show valid password state if Validation succeeds', () => {
    const {
      sut: { getByTestId },
      validationStub
    } = makeSut();
    const passwordInput = getByTestId('password-input');
    const passwordStatus = getByTestId('password-status');

    validationStub.errorMessage = null;
    fireEvent.input(passwordInput, { target: { value: internet.password() } });

    expect(passwordStatus.title).toBe('No errors.');
    expect(passwordStatus.textContent).toBe('✅');
  });

  test('Should enable submit button if form is valid', () => {
    const {
      sut: { getByTestId },
      validationStub
    } = makeSut();
    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');
    const passwordStatus = getByTestId('password-status');
    const submitButton = getByTestId('submit-button') as HTMLButtonElement;

    validationStub.errorMessage = null;
    fireEvent.input(emailInput, { target: { value: internet.email() } });
    fireEvent.input(passwordInput, { target: { value: internet.password() } });

    expect(submitButton.disabled).toBe(false);
  });
});
