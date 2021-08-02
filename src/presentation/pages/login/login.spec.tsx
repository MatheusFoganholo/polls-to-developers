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
};

type SutParams = {
  validationError: string;
};

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;
  const sut = render(<Login validation={validationStub} />);
  return { sut };
};

describe('Login Component', () => {
  afterEach(cleanup);

  test('Should initialize with initial state', () => {
    const validationError = random.words();
    const {
      sut: { getByTestId }
    } = makeSut({ validationError });
    const errorWrapper = getByTestId('error-wrapper');
    const submitButton = getByTestId('submit-button') as HTMLButtonElement;
    const emailStatus = getByTestId('email-status');
    const passwordStatus = getByTestId('password-status');

    expect(errorWrapper.childElementCount).toBe(0);
    expect(submitButton.disabled).toBe(true);
    expect(emailStatus.title).toBe(validationError);
    expect(emailStatus.textContent).toBe('🔴');
    expect(passwordStatus.title).toBe(validationError);
    expect(passwordStatus.textContent).toBe('🔴');
  });

  test('Should show email error if Validation fails', () => {
    const validationError = random.words();
    const {
      sut: { getByTestId }
    } = makeSut({ validationError });
    const emailInput = getByTestId('email-input');
    const emailStatus = getByTestId('email-status');

    fireEvent.input(emailInput, { target: { value: internet.email() } });

    expect(emailStatus.title).toBe(validationError);
    expect(emailStatus.textContent).toBe('🔴');
  });

  test('Should show password error if Validation fails', () => {
    const validationError = random.words();
    const {
      sut: { getByTestId }
    } = makeSut({ validationError });
    const passwordInput = getByTestId('password-input');
    const passwordStatus = getByTestId('password-status');

    fireEvent.input(passwordInput, { target: { value: internet.password() } });

    expect(passwordStatus.title).toBe(validationError);
    expect(passwordStatus.textContent).toBe('🔴');
  });

  test('Should show valid email state if Validation succeeds', () => {
    const {
      sut: { getByTestId }
    } = makeSut();
    const emailInput = getByTestId('email-input');
    const emailStatus = getByTestId('email-status');

    fireEvent.input(emailInput, { target: { value: internet.email() } });

    expect(emailStatus.title).toBe('No errors.');
    expect(emailStatus.textContent).toBe('✅');
  });

  test('Should show valid password state if Validation succeeds', () => {
    const {
      sut: { getByTestId }
    } = makeSut();
    const passwordInput = getByTestId('password-input');
    const passwordStatus = getByTestId('password-status');

    fireEvent.input(passwordInput, { target: { value: internet.password() } });

    expect(passwordStatus.title).toBe('No errors.');
    expect(passwordStatus.textContent).toBe('✅');
  });

  test('Should enable submit button if form is valid', () => {
    const {
      sut: { getByTestId }
    } = makeSut();
    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');
    const submitButton = getByTestId('submit-button') as HTMLButtonElement;

    fireEvent.input(emailInput, { target: { value: internet.email() } });
    fireEvent.input(passwordInput, { target: { value: internet.password() } });

    expect(submitButton.disabled).toBe(false);
  });
});
