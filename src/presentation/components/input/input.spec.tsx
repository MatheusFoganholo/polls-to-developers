import React from 'react';
import { database } from 'faker';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import { Input } from './input';
import Context from '@/presentation/contexts/form/form-context';

const makeSut = (fieldName: string): RenderResult => {
  return render(
    <Context.Provider value={{ state: {} }}>
      <Input name={fieldName} />
    </Context.Provider>
  );
};

describe('Input Component', () => {
  test('Should begin with readOnly', () => {
    const fieldName = database.column();
    const { getByTestId } = makeSut(fieldName);
    const input = getByTestId(`${fieldName}-input`) as HTMLInputElement;

    expect(input.readOnly).toBe(true);
  });

  test('Should remove readOnly on focus', () => {
    const fieldName = database.column();
    const { getByTestId } = makeSut(fieldName);
    const input = getByTestId(`${fieldName}-input`) as HTMLInputElement;

    fireEvent.focus(input);

    expect(input.readOnly).toBe(false);
  });
});
