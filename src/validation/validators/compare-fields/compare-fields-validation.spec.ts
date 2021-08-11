import { database, random } from 'faker';
import { InvalidFieldError } from '@/validation/errors';
import { CompareFieldsValidation } from './compare-fields-validation';

const makeSut = (valueToCompare: string): CompareFieldsValidation =>
  new CompareFieldsValidation(database.column(), valueToCompare);

describe('CompareFieldsValidation', () => {
  test('Should return error if compare is invalid', () => {
    const sut = makeSut(random.word());
    const error = sut.validate(random.words());

    expect(error).toEqual(new InvalidFieldError());
  });

  test('Should return falsy if compare is valid', () => {
    const valueToCompare = random.word();
    const sut = makeSut(valueToCompare);
    const error = sut.validate(valueToCompare);

    expect(error).toBeFalsy();
  });
});
