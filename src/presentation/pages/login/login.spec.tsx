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

const testStatusForField = (
  sut: RenderResult,
  fieldName: string,
  validationError?: string
): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`);
  expect(fieldStatus.title).toBe(validationError || 'No errors.');
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢');
};

const testErrorWrapperChildCount = (sut: RenderResult, count: number): void => {
  const errorWrapper = sut.getByTestId('error-wrapper');
  expect(errorWrapper.childElementCount).toBe(count);
};

const testElementExistence = (sut: RenderResult, fieldName: string): void => {
  expect(sut.getByTestId(fieldName)).toBeTruthy();
};

const testElementText = (
  sut: RenderResult,
  fieldName: string,
  text: string
): void => {
  expect(sut.getByTestId(fieldName).textContent).toBe(text);
};

const testButtonIsDisabled = (
  sut: RenderResult,
  fieldName: string,
  isDisabled: boolean
): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
};

const simulateValidSubmit = async (
  sut: RenderResult,
  email = internet.email(),
  password = internet.password()
): Promise<void> => {
  populateEmailField(sut, email);
  populatePasswordField(sut, password);
  const form = sut.getByTestId('form');

  fireEvent.submit(form);
  await waitFor(() => form);
};

describe('Login Component', () => {
  afterEach(cleanup);
  beforeEach(() => localStorage.clear());

  test('Should initialize with initial state', () => {
    const validationError = random.words();
    const { sut } = makeSut({ validationError });

    testStatusForField(sut, 'email', validationError);
    testStatusForField(sut, 'password', validationError);
    testErrorWrapperChildCount(sut, 0);
    testButtonIsDisabled(sut, 'submit-button', true);
  });

  test('Should show email error if Validation fails', () => {
    const validationError = random.words();
    const { sut } = makeSut({ validationError });

    populateEmailField(sut);

    testStatusForField(sut, 'email', validationError);
  });

  test('Should show password error if Validation fails', () => {
    const validationError = random.words();
    const { sut } = makeSut({ validationError });

    populatePasswordField(sut);

    testStatusForField(sut, 'password', validationError);
  });

  test('Should show valid email state if Validation succeeds', () => {
    const { sut } = makeSut();

    populateEmailField(sut);

    testStatusForField(sut, 'email');
  });

  test('Should show valid password state if Validation succeeds', () => {
    const { sut } = makeSut();

    populatePasswordField(sut);

    testStatusForField(sut, 'password');
  });

  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut();

    populateEmailField(sut);
    populatePasswordField(sut);

    testButtonIsDisabled(sut, 'submit-button', false);
  });

  test('Should show spinner on submit', async () => {
    const { sut } = makeSut();

    await simulateValidSubmit(sut);

    testElementExistence(sut, 'spinner');
  });

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut();
    const email = internet.email();
    const password = internet.password();

    await simulateValidSubmit(sut, email, password);

    expect(authenticationSpy.params).toEqual({ email, password });
  });

  test('Should call Authentication only once', async () => {
    const { sut, authenticationSpy } = makeSut();

    await simulateValidSubmit(sut);
    await simulateValidSubmit(sut);

    expect(authenticationSpy.callsCount).toBe(1);
  });

  test('Should not call Authentication if form is invalid', async () => {
    const validationError = random.words();
    const { sut, authenticationSpy } = makeSut({ validationError });

    await simulateValidSubmit(sut);

    expect(authenticationSpy.callsCount).toBe(0);
  });

  test('Should present error and hide spinner if Authentication fails', async () => {
    const { sut, authenticationSpy } = makeSut();
    const error = new InvalidCredentialsError();

    jest
      .spyOn(authenticationSpy, 'auth')
      .mockReturnValueOnce(Promise.reject(error));
    await simulateValidSubmit(sut);

    testErrorWrapperChildCount(sut, 1);
    testElementText(sut, 'request-error', error.message);
  });

  test('Should add accessToken to localStorage on Authentication success', async () => {
    const { sut, authenticationSpy } = makeSut();

    await simulateValidSubmit(sut);

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
