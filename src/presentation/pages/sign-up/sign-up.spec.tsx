import React from 'react';
import { createMemoryHistory } from 'history';
import { render, RenderResult } from '@testing-library/react';
import { Router } from 'react-router-dom';
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

const testButtonIsDisabled = (
  sut: RenderResult,
  fieldName: string,
  isDisabled: boolean
): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
};

const testChildCount = (
  sut: RenderResult,
  fieldName: string,
  count: number
): void => {
  const el = sut.getByTestId(fieldName);
  expect(el.childElementCount).toBe(count);
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

describe('SignUp Component', () => {
  test('Should initialize with initial state', () => {
    const validationError = 'Required field.';
    const { sut } = makeSut();

    testStatusForField(sut, 'name', validationError);
    testStatusForField(sut, 'email', validationError);
    testStatusForField(sut, 'password', validationError);
    testStatusForField(sut, 'passwordConfirmation', validationError);
    testChildCount(sut, 'error-wrapper', 0);
    testButtonIsDisabled(sut, 'submit-button', true);
  });
});
