import { database, random } from 'faker';
import { InvalidFieldError } from '@/validation/errors';
import { MinLengthValidation } from './min-length-validation';

const makeSut = (field: string, minLength: number = 6): MinLengthValidation =>
  new MinLengthValidation(field, minLength);

describe('MinLengthValidation', () => {
  test('Should return error if value is less than 6 characters', () => {
    const field = database.column();
    const sut = makeSut(field);
    const error = sut.validate({ [field]: random.alphaNumeric(5) });

    expect(error).toEqual(new InvalidFieldError());
  });

  test('Should return falsy if value is valid', () => {
    const field = database.column();
    const sut = makeSut(field);
    const error = sut.validate({ [field]: random.alphaNumeric(6) });

    expect(error).toBeFalsy();
  });

  test('Should return falsy if field does not exists in schema', () => {
    const sut = makeSut(database.column());
    const error = sut.validate({ [random.word()]: random.alphaNumeric(6) });

    expect(error).toBeFalsy();
  });
});
