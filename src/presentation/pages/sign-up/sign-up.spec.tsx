import React from 'react';
import { cleanup, render, RenderResult } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { random } from 'faker';
import { Router } from 'react-router-dom';
import { Helper, ValidationStub } from '@/presentation/test';
import { SignUp } from './sign-up';

type SutTypes = {
  sut: RenderResult;
};

type SutParams = {
  validationError: string;
};

const history = createMemoryHistory({ initialEntries: ['/login'] });

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;
  const sut = render(
    <Router history={history}>
      <SignUp validation={validationStub} />
    </Router>
  );
  return { sut };
};

describe('SignUp Component', () => {
  afterEach(cleanup);

  test('Should initialize with initial state', () => {
    const validationError = random.words();
    const { sut } = makeSut({ validationError });

    Helper.testStatusForField(sut, 'name', validationError);
    Helper.testStatusForField(sut, 'email', 'Required field.');
    Helper.testStatusForField(sut, 'password', 'Required field.');
    Helper.testStatusForField(sut, 'passwordConfirmation', 'Required field.');
    Helper.testChildCount(sut, 'error-wrapper', 0);
    Helper.testButtonIsDisabled(sut, 'submit-button', true);
  });

  test('Should show name error if Validation fails', () => {
    const validationError = random.words();
    const { sut } = makeSut({ validationError });

    Helper.populateField(sut, 'name');

    Helper.testStatusForField(sut, 'name', validationError);
  });
});
