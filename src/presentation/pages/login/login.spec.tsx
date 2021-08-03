import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import 'jest-localstorage-mock';
import { internet, random } from 'faker';
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
  waitFor
} from '@testing-library/react';
import { AuthenticationSpy, ValidationStub } from '@/presentation/test';
import { InvalidCredentialsError } from '@/domain/errors';
import { Login } from './login';

type SutTypes = {
  sut: RenderResult;
  authenticationSpy: AuthenticationSpy;
};

type SutParams = {
  validationError: string;
};

const history = createMemoryHistory({ initialEntries: ['/login'] });

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  const authenticationSpy = new AuthenticationSpy();
  validationStub.errorMessage = params?.validationError;
  const sut = render(
    <Router history={history}>
      <Login validation={validationStub} authentication={authenticationSpy} />
    </Router>
  );
  return { sut, authenticationSpy };
};

const populateEmailField = (
  { getByTestId }: RenderResult,
  email = internet.email()
): void => {
  const emailInput = getByTestId('email-input');
  fireEvent.input(emailInput, { target: { value: email } });
};

const populatePasswordField = (
  { getByTestId }: RenderResult,
  password = internet.password()
): void => {
  const passwordInput = getByTestId('password-input');
  fireEvent.input(passwordInput, { target: { value: password } });
};

const simulateStatusForField = (
  sut: RenderResult,
  fieldName: string,
  validationError?: string
): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`);
  expect(fieldStatus.title).toBe(validationError || 'No errors.');
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '✅');
};

const simulateValidSubmit = (
  sut: RenderResult,
  email = internet.email(),
  password = internet.password()
): void => {
  populateEmailField(sut, email);
  populatePasswordField(sut, password);
  const submitButton = sut.getByTestId('submit-button');

  fireEvent.click(submitButton);
};

describe('Login Component', () => {
  afterEach(cleanup);
  beforeEach(() => localStorage.clear());

  test('Should initialize with initial state', () => {
    const validationError = random.words();
    const { sut } = makeSut({ validationError });
    const errorWrapper = sut.getByTestId('error-wrapper');
    const submitButton = sut.getByTestId('submit-button') as HTMLButtonElement;

    simulateStatusForField(sut, 'email', validationError);
    simulateStatusForField(sut, 'password', validationError);

    expect(errorWrapper.childElementCount).toBe(0);
    expect(submitButton.disabled).toBe(true);
  });

  test('Should show email error if Validation fails', () => {
    const validationError = random.words();
    const { sut } = makeSut({ validationError });

    populateEmailField(sut);
    simulateStatusForField(sut, 'email', validationError);
  });

  test('Should show password error if Validation fails', () => {
    const validationError = random.words();
    const { sut } = makeSut({ validationError });

    populatePasswordField(sut);
    simulateStatusForField(sut, 'password', validationError);
  });

  test('Should show valid email state if Validation succeeds', () => {
    const { sut } = makeSut();

    populateEmailField(sut);
    simulateStatusForField(sut, 'email');
  });

  test('Should show valid password state if Validation succeeds', () => {
    const { sut } = makeSut();

    populatePasswordField(sut);
    simulateStatusForField(sut, 'password');
  });

  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut();
    const submitButton = sut.getByTestId('submit-button') as HTMLButtonElement;

    populateEmailField(sut);
    populatePasswordField(sut);

    expect(submitButton.disabled).toBe(false);
  });

  test('Should show spinner on submit', () => {
    const { sut } = makeSut();

    simulateValidSubmit(sut);

    expect(sut.getByTestId('spinner')).toBeTruthy();
  });

  test('Should call Authentication with correct values', () => {
    const { sut, authenticationSpy } = makeSut();
    const email = internet.email();
    const password = internet.password();

    simulateValidSubmit(sut, email, password);

    expect(authenticationSpy.params).toEqual({ email, password });
  });

  test('Should call Authentication only once', () => {
    const { sut, authenticationSpy } = makeSut();

    simulateValidSubmit(sut);
    simulateValidSubmit(sut);

    expect(authenticationSpy.callsCount).toBe(1);
  });

  test('Should not call Authentication if form is invalid', () => {
    const validationError = random.words();
    const { sut, authenticationSpy } = makeSut({ validationError });

    populateEmailField(sut);
    fireEvent.submit(sut.getByTestId('form'));

    expect(authenticationSpy.callsCount).toBe(0);
  });

  test('Should present error and hide spinner if Authentication fails', async () => {
    const { sut, authenticationSpy } = makeSut();
    const error = new InvalidCredentialsError();
    const errorWrapper = sut.getByTestId('error-wrapper');

    jest
      .spyOn(authenticationSpy, 'auth')
      .mockReturnValueOnce(Promise.reject(error));
    simulateValidSubmit(sut);
    await waitFor(() => errorWrapper);

    const requestError = sut.getByTestId('request-error');

    expect(errorWrapper.childElementCount).toBe(1); // Loading shouldn't appear
    expect(requestError.textContent).toBe(error.message);
  });

  test('Should add accessToken to localStorage on Authentication success', async () => {
    const { sut, authenticationSpy } = makeSut();

    simulateValidSubmit(sut);
    await waitFor(() => sut.getByTestId('form'));

    expect(history.length).toBe(1);
    expect(history.location.pathname).toBe('/');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'accessToken',
      authenticationSpy.account.accessToken
    );
  });

  test('Should go to sign-up page', () => {
    const { sut } = makeSut();
    const registerLink = sut.getByTestId('sign-up');

    fireEvent.click(registerLink);

    expect(history.length).toBe(2);
    expect(history.location.pathname).toBe('/sign-up');
  });
});
