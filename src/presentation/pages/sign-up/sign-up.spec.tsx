import React from 'react';
import { createMemoryHistory } from 'history';
import { render, RenderResult } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { Helper } from '@/presentation/test';
import { SignUp } from './sign-up';

type SutTypes = {
  sut: RenderResult;
};

const history = createMemoryHistory({ initialEntries: ['/login'] });

const makeSut = (): SutTypes => {
  const sut = render(
    <Router history={history}>
      <SignUp />
    </Router>
  );
  return { sut };
};

describe('SignUp Component', () => {
  test('Should initialize with initial state', () => {
    const validationError = 'Required field.';
    const { sut } = makeSut();

    Helper.testStatusForField(sut, 'name', validationError);
    Helper.testStatusForField(sut, 'email', validationError);
    Helper.testStatusForField(sut, 'password', validationError);
    Helper.testStatusForField(sut, 'passwordConfirmation', validationError);
    Helper.testChildCount(sut, 'error-wrapper', 0);
    Helper.testButtonIsDisabled(sut, 'submit-button', true);
  });
});
