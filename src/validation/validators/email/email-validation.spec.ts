import { internet, random } from 'faker';
import { EmailValidation } from './email-validation';
import { InvalidFieldError } from '@/validation/errors';

describe('EmailValidation', () => {
  test('Should return error if email is invalid', () => {
    const sut = new EmailValidation(random.word());
    const error = sut.validate(random.word());

    expect(error).toEqual(new InvalidFieldError());
  });

  test('Should return falsy if email is valid', () => {
    const sut = new EmailValidation(random.word());
    const error = sut.validate(internet.email());

    expect(error).toBeFalsy();
  });
});
