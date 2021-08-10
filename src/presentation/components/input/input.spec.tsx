import React from 'react';
import { Input } from './input';
import { render, RenderResult } from '@testing-library/react';
import Context from '@/presentation/contexts/form/form-context';

const makeSut = (): RenderResult => {
  return render(
    <Context.Provider value={{ state: {} }}>
      <Input name="fieldName" />
    </Context.Provider>
  );
};

describe('Input Component', () => {
  test('Should begin with readOnly', () => {
    const { getByTestId } = makeSut();
    const input = getByTestId('fieldName-input') as HTMLInputElement;

    expect(input.readOnly).toBe(true);
  });
});
