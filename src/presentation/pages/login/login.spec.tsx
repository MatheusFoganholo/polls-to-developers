import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { internet, random } from 'faker';
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
  waitFor
} from '@testing-library/react';
import {
  AuthenticationSpy,
  Helper,
  ValidationStub,
  SaveAccessTokenMock
} from '@/presentation/test';
import { InvalidCredentialsError } from '@/domain/errors';
import { Login } from './login';

type SutTypes = {
  sut: RenderResult;
  authenticationSpy: AuthenticationSpy;
  saveAccessTokenMock: SaveAccessTokenMock;
};

type SutParams = {
  validationError: string;
};

const history = createMemoryHistory({ initialEntries: ['/login'] });

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  const authenticationSpy = new AuthenticationSpy();
  const saveAccessTokenMock = new SaveAccessTokenMock();
  validationStub.errorMessage = params?.validationError;
  const sut = render(
    <Router history={history}>
      <Login
        validation={validationStub}
        authentication={authenticationSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </Router>
  );
  return { sut, authenticationSpy, saveAccessTokenMock };
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

  test('Should initialize with initial state', () => {
    const validationError = random.words();
    const { sut } = makeSut({ validationError });

    Helper.testStatusForField(sut, 'email', validationError);
    Helper.testStatusForField(sut, 'password', validationError);
    Helper.testChildCount(sut, 'error-wrapper', 0);
    Helper.testButtonIsDisabled(sut, 'submit-button', true);
  });

  test('Should show email error if Validation fails', () => {
    const validationError = random.words();
    const { sut } = makeSut({ validationError });

    populateEmailField(sut);

    Helper.testStatusForField(sut, 'email', validationError);
  });

  test('Should show password error if Validation fails', () => {
    const validationError = random.words();
    const { sut } = makeSut({ validationError });

    populatePasswordField(sut);

    Helper.testStatusForField(sut, 'password', validationError);
  });

  test('Should show valid email state if Validation succeeds', () => {
    const { sut } = makeSut();

    populateEmailField(sut);

    Helper.testStatusForField(sut, 'email');
  });

  test('Should show valid password state if Validation succeeds', () => {
    const { sut } = makeSut();

    populatePasswordField(sut);

    Helper.testStatusForField(sut, 'password');
  });

  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut();

    populateEmailField(sut);
    populatePasswordField(sut);

    Helper.testButtonIsDisabled(sut, 'submit-button', false);
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

    Helper.testChildCount(sut, 'error-wrapper', 1);
    testElementText(sut, 'request-error', error.message);
  });

  test('Should call SaveAccessToken on Authentication success', async () => {
    const { sut, authenticationSpy, saveAccessTokenMock } = makeSut();

    await simulateValidSubmit(sut);

    expect(history.length).toBe(1);
    expect(history.location.pathname).toBe('/');
    expect(saveAccessTokenMock.accessToken).toBe(
      authenticationSpy.account.accessToken
    );
  });

  test('Should present error if SaveAccessToken fails', async () => {
    const { sut, saveAccessTokenMock } = makeSut();
    const error = new InvalidCredentialsError();

    jest
      .spyOn(saveAccessTokenMock, 'save')
      .mockReturnValueOnce(Promise.reject(error));
    await simulateValidSubmit(sut);

    Helper.testChildCount(sut, 'error-wrapper', 1);
    testElementText(sut, 'request-error', error.message);
  });

  test('Should go to sign-up page', () => {
    const { sut } = makeSut();
    const registerLink = sut.getByTestId('sign-up');

    fireEvent.click(registerLink);

    expect(history.length).toBe(2);
    expect(history.location.pathname).toBe('/sign-up');
  });
});
