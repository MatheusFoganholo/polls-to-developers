import { internet, random } from 'faker';
import { AccountModel } from '@/domain/models/account-model';
import { AuthenticationParams } from '@/domain/usecases/authentication';

export const mockAuthentication = (): AuthenticationParams => ({
  email: internet.email(),
  password: internet.password()
});

export const mockAccountModel = (): AccountModel => ({
  accessToken: random.uuid()
});
