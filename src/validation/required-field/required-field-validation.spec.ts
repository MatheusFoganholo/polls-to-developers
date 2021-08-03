import { random } from 'faker';
import { RequiredFieldError } from '@/validation/errors';
import { RequiredFieldValidation } from './required-field-validation';

describe('RequiredFieldValidation', () => {
  test('Should return error if field is empty', () => {
    const sut = new RequiredFieldValidation('email');
    const error = sut.validate('');

    expect(error).toEqual(new RequiredFieldError());
  });

  test('Should return falsy if field is not empty', () => {
    const sut = new RequiredFieldValidation('email');
    const error = sut.validate(random.word());

    expect(error).toBeFalsy();
  });
});