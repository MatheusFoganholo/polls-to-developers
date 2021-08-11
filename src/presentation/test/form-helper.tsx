import { fireEvent, RenderResult } from '@testing-library/react';
import { random } from 'faker';

export const populateField = (
  { getByTestId }: RenderResult,
  fieldName: string,
  value = random.word()
): void => {
  const input = getByTestId(`${fieldName}-input`);
  fireEvent.input(input, { target: { value } });
};

export const testButtonIsDisabled = (
  sut: RenderResult,
  fieldName: string,
  isDisabled: boolean
): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
};

export const testChildCount = (
  sut: RenderResult,
  fieldName: string,
  count: number
): void => {
  const el = sut.getByTestId(fieldName);
  expect(el.childElementCount).toBe(count);
};

export const testStatusForField = (
  sut: RenderResult,
  fieldName: string,
  validationError?: string
): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`);
  expect(fieldStatus.title).toBe(validationError || 'No errors.');
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢');
};
