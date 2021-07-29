import { internet, random } from 'faker';
import { AccountModel } from '@/domain/models';
import { AuthenticationParams } from '@/domain/usecases';

export const mockAuthentication = (): AuthenticationParams => ({
  email: internet.email(),
  password: internet.password()
});

export const mockAccountModel = (): AccountModel => ({
  accessToken: random.uuid()
});
