import React from 'react';
import { render } from '@testing-library/react';
import { Login } from './login';

describe('Login Component', () => {
  test('Should initialize with initial state', () => {
    const { getByTestId } = render(<Login />);
    const errorWrapper = getByTestId('error-wrapper');
    const submitButton = getByTestId('submit-button') as HTMLButtonElement;

    expect(errorWrapper.childElementCount).toBe(0);
    expect(submitButton.disabled).toBe(true);
  });
});
