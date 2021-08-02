import React from 'react';
import { internet, random } from 'faker';
import {
  render,
  RenderResult,
  fireEvent,
  cleanup
} from '@testing-library/react';
import { Authentication, AuthenticationParams } from '@/domain/usecases';
import { AccountModel } from '@/domain/models';
import { Login } from './login';
import { mockAccountModel } from '@/domain/test';
import { ValidationStub } from '@/presentation/test';

class AuthenticationSpy implements Authentication {
  account = mockAccountModel();
  params: AuthenticationParams;

  async auth(params: AuthenticationParams): Promise<AccountModel> {
    this.params = params;
    return Promise.resolve(this.account);
  }
}

type SutTypes = {
  sut: RenderResult;
  authenticationSpy: AuthenticationSpy;
};

type SutParams = {
  validationError: string;
};

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  const authenticationSpy = new AuthenticationSpy();
  validationStub.errorMessage = params?.validationError;
  const sut = render(
    <Login validation={validationStub} authentication={authenticationSpy} />
  );
  return { sut, authenticationSpy };
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

  test('Should show spinner on submit', () => {
    const {
      sut: { getByTestId }
    } = makeSut();
    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');
    const submitButton = getByTestId('submit-button');

    fireEvent.input(emailInput, { target: { value: internet.email() } });
    fireEvent.input(passwordInput, { target: { value: internet.password() } });
    fireEvent.click(submitButton);

    expect(getByTestId('spinner')).toBeTruthy();
  });

  test('Should call Authentication with correct values', () => {
    const {
      sut: { getByTestId },
      authenticationSpy
    } = makeSut();
    const email = internet.email();
    const emailInput = getByTestId('email-input');
    const password = internet.password();
    const passwordInput = getByTestId('password-input');
    const submitButton = getByTestId('submit-button');

    fireEvent.input(emailInput, { target: { value: email } });
    fireEvent.input(passwordInput, { target: { value: password } });
    fireEvent.click(submitButton);

    expect(authenticationSpy.params).toEqual({ email, password });
  });
});
