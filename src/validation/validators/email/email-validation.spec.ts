import { database, internet, random } from 'faker';
import { EmailValidation } from './email-validation';
import { InvalidFieldError } from '@/validation/errors';

const makeSut = (field: string): EmailValidation => new EmailValidation(field);

describe('EmailValidation', () => {
  test('Should return error if email is invalid', () => {
    const field = database.column();
    const sut = makeSut(field);
    const error = sut.validate({ [field]: random.word() });

    expect(error).toEqual(new InvalidFieldError());
  });

  test('Should return falsy if email is valid', () => {
    const field = database.column();
    const sut = makeSut(field);
    const error = sut.validate({ [field]: internet.email() });

    expect(error).toBeFalsy();
  });

  test('Should return falsy if email is empty', () => {
    const field = database.column();
    const sut = makeSut(field);
    const error = sut.validate({ [field]: '' });

    expect(error).toBeFalsy();
  });
});
