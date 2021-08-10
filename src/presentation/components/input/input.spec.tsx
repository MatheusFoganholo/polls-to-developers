import React from 'react';
import { Input } from './input';
import { render } from '@testing-library/react';
import Context from '@/presentation/contexts/form/form-context';

describe('Input Component', () => {
  test('Should begin with readOnly', () => {
    const { getByTestId } = render(
      <Context.Provider value={{ state: {} }}>
        <Input name="fieldName" />
      </Context.Provider>
    );
    const input = getByTestId('fieldName-input') as HTMLInputElement;

    expect(input.readOnly).toBe(true);
  });
});
