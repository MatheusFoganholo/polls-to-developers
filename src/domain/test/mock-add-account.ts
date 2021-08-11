import { internet, name } from 'faker';
import { AddAccountParams } from '@/domain/usecases';

export const mockAddAccountParams = (): AddAccountParams => {
  const password = internet.password();

  return {
    name: name.findName(),
    email: internet.email(),
    password,
    passwordConfirmation: password
  };
};
