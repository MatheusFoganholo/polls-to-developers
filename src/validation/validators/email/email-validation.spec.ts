import { database, internet, random } from 'faker';
import { EmailValidation } from './email-validation';
import { InvalidFieldError } from '@/validation/errors';

const makeSut = (): EmailValidation => new EmailValidation(database.column());

describe('EmailValidation', () => {
  test('Should return error if email is invalid', () => {
    const sut = makeSut();
    const error = sut.validate(random.word());

    expect(error).toEqual(new InvalidFieldError());
  });

  test('Should return falsy if email is valid', () => {
    const sut = makeSut();
    const error = sut.validate(internet.email());

    expect(error).toBeFalsy();
  });
});
