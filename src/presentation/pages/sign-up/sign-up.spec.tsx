import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
  waitFor
} from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { internet, name, random } from 'faker';
import { Router } from 'react-router-dom';
import { AddAccountSpy, Helper, ValidationStub } from '@/presentation/test';
import { EmailInUseError } from '@/domain/errors';
import { SignUp } from './sign-up';

type SutTypes = {
  sut: RenderResult;
  addAccountSpy: AddAccountSpy;
};

type SutParams = {
  validationError: string;
};

const history = createMemoryHistory({ initialEntries: ['/login'] });

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;
  const addAccountSpy = new AddAccountSpy();
  const sut = render(
    <Router history={history}>
      <SignUp validation={validationStub} addAccount={addAccountSpy} />
    </Router>
  );
  return { sut, addAccountSpy };
};

const simulateValidSubmit = async (
  sut: RenderResult,
  randomName = name.findName(),
  email = internet.email(),
  password = internet.password()
): Promise<void> => {
  Helper.populateField(sut, 'name', randomName);
  Helper.populateField(sut, 'email', email);
  Helper.populateField(sut, 'password', password);
  Helper.populateField(sut, 'passwordConfirmation', password);
  const form = sut.getByTestId('form');

  fireEvent.submit(form);
  await waitFor(() => form);
};

describe('SignUp Component', () => {
  afterEach(cleanup);

  test('Should initialize with initial state', () => {
    const validationError = random.words();
    const { sut } = makeSut({ validationError });

    Helper.testStatusForField(sut, 'name', validationError);
    Helper.testStatusForField(sut, 'email', validationError);
    Helper.testStatusForField(sut, 'password', validationError);
    Helper.testStatusForField(sut, 'passwordConfirmation', validationError);
    Helper.testChildCount(sut, 'error-wrapper', 0);
    Helper.testButtonIsDisabled(sut, 'submit-button', true);
  });

  test('Should show name error if Validation fails', () => {
    const validationError = random.words();
    const { sut } = makeSut({ validationError });

    Helper.populateField(sut, 'name');

    Helper.testStatusForField(sut, 'name', validationError);
  });

  test('Should show email error if Validation fails', () => {
    const validationError = random.words();
    const { sut } = makeSut({ validationError });

    Helper.populateField(sut, 'email');

    Helper.testStatusForField(sut, 'email', validationError);
  });

  test('Should show password error if Validation fails', () => {
    const validationError = random.words();
    const { sut } = makeSut({ validationError });

    Helper.populateField(sut, 'password');

    Helper.testStatusForField(sut, 'password', validationError);
  });

  test('Should show passwordConfirmation error if Validation fails', () => {
    const validationError = random.words();
    const { sut } = makeSut({ validationError });

    Helper.populateField(sut, 'passwordConfirmation');

    Helper.testStatusForField(sut, 'passwordConfirmation', validationError);
  });

  test('Should show valid name state if Validation succeeds', () => {
    const { sut } = makeSut();

    Helper.populateField(sut, 'name');

    Helper.testStatusForField(sut, 'name');
  });

  test('Should show valid email state if Validation succeeds', () => {
    const { sut } = makeSut();

    Helper.populateField(sut, 'email');

    Helper.testStatusForField(sut, 'email');
  });

  test('Should show valid password state if Validation succeeds', () => {
    const { sut } = makeSut();

    Helper.populateField(sut, 'password');

    Helper.testStatusForField(sut, 'password');
  });

  test('Should show valid passwordConfirmation state if Validation succeeds', () => {
    const { sut } = makeSut();

    Helper.populateField(sut, 'passwordConfirmation');

    Helper.testStatusForField(sut, 'passwordConfirmation');
  });

  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut();

    Helper.populateField(sut, 'name');
    Helper.populateField(sut, 'email');
    Helper.populateField(sut, 'password');
    Helper.populateField(sut, 'passwordConfirmation');

    Helper.testButtonIsDisabled(sut, 'submit-button', false);
  });

  test('Should show spinner on submit', async () => {
    const { sut } = makeSut();

    await simulateValidSubmit(sut);

    Helper.testElementExistence(sut, 'spinner');
  });

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut();
    const randomName = name.findName();
    const email = internet.email();
    const password = internet.password();

    await simulateValidSubmit(sut, randomName, email, password);

    expect(addAccountSpy.params).toEqual({
      name: randomName,
      email,
      password,
      passwordConfirmation: password
    });
  });

  test('Should call AddAccount only once', async () => {
    const { sut, addAccountSpy } = makeSut();

    await simulateValidSubmit(sut);
    await simulateValidSubmit(sut);

    expect(addAccountSpy.callsCount).toBe(1);
  });

  test('Should not call AddAccount if form is invalid', async () => {
    const validationError = random.words();
    const { sut, addAccountSpy } = makeSut({ validationError });

    await simulateValidSubmit(sut);

    expect(addAccountSpy.callsCount).toBe(0);
  });

  test('Should present error and hide spinner if Authentication fails', async () => {
    const { sut, addAccountSpy } = makeSut();
    const error = new EmailInUseError();

    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error);
    await simulateValidSubmit(sut);

    Helper.testChildCount(sut, 'error-wrapper', 1);
    Helper.testElementText(sut, 'request-error', error.message);
  });
});
