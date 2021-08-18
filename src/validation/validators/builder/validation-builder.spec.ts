import { database, random } from 'faker';
import {
  CompareFieldsValidation,
  EmailValidation,
  MinLengthValidation,
  RequiredFieldValidation
} from '@/validation/validators';
import { ValidationBuilder as sut } from './validation-builder';

describe('ValidationBuilder', () => {
  test('Should return RequiredFieldValidation', () => {
    const field = database.column();
    const validations = sut.field(field).required().build();

    expect(validations).toEqual([new RequiredFieldValidation(field)]);
  });

  test('Should return EmailValidation', () => {
    const field = database.column();
    const validations = sut.field(field).email().build();

    expect(validations).toEqual([new EmailValidation(field)]);
  });

  test('Should return MinLengthValidation', () => {
    const field = database.column();
    const length = random.number();
    const validations = sut.field(field).min(length).build();

    expect(validations).toEqual([new MinLengthValidation(field, length)]);
  });

  test('Should return CompareFieldsValidation', () => {
    const field = database.column();
    const fieldToCompare = database.column();
    const validations = sut.field(field).sameAs(fieldToCompare).build();

    expect(validations).toEqual([
      new CompareFieldsValidation(field, fieldToCompare)
    ]);
  });

  test('Should return a list of validations', () => {
    const field = database.column();
    const length = random.number();
    const validations = sut.field(field).required().min(length).email().build();

    expect(validations).toEqual([
      new RequiredFieldValidation(field),
      new MinLengthValidation(field, length),
      new EmailValidation(field)
    ]);
  });
});
