import { database, random } from 'faker';
import { FieldValidationSpy } from '@/validation/test';
import { ValidationComposite } from './validation-composite';

type SutTypes = {
  sut: ValidationComposite;
  fieldValidationsSpy: FieldValidationSpy[];
};

const makeSut = (fieldName: string): SutTypes => {
  const fieldValidationsSpy = [
    new FieldValidationSpy(fieldName),
    new FieldValidationSpy(fieldName)
  ];

  const sut = ValidationComposite.build(fieldValidationsSpy);

  return { sut, fieldValidationsSpy };
};

describe('ValidationComposite', () => {
  test('Should return error if any validation fails', () => {
    const fieldName = database.column();
    const { sut, fieldValidationsSpy } = makeSut(fieldName);
    const errorMessage = random.words();
    fieldValidationsSpy[0].error = new Error(errorMessage);
    fieldValidationsSpy[1].error = new Error(random.words());

    const error = sut.validate(fieldName, { [fieldName]: random.word() });

    expect(error).toBe(errorMessage);
  });

  test('Should return error if any validation fails', () => {
    const fieldName = database.column();
    const { sut } = makeSut(fieldName);

    const error = sut.validate(fieldName, { [fieldName]: random.word() });

    expect(error).toBeFalsy();
  });
});
