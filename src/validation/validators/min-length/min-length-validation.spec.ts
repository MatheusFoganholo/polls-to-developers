import { database, random } from 'faker';
import { InvalidFieldError } from '@/validation/errors';
import { MinLengthValidation } from './min-length-validation';

const makeSut = (minLength: number = 6): MinLengthValidation =>
  new MinLengthValidation(database.column(), minLength);

describe('MinLengthValidation', () => {
  test('Should return error if value is less than 6 characters', () => {
    const sut = makeSut();
    const error = sut.validate(random.alphaNumeric(5));

    expect(error).toEqual(new InvalidFieldError());
  });

  test('Should return falsy if value is valid', () => {
    const sut = makeSut();
    const error = sut.validate(random.alphaNumeric(6));

    expect(error).toBeFalsy();
  });
});
