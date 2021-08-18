import { AddAccount } from '@/domain/usecases';
import { makeApiURL } from '@/main/factories/http/api-url-factory';
import { makeAxiosHttpClient } from '@/main/factories/http/axios-http-client-factory';
import { RemoteAddAccount } from '@/data/usecases/add-account/remote-add-account';

export const makeRemoteAddAccount = (): AddAccount => {
  return new RemoteAddAccount(makeApiURL('/signup'), makeAxiosHttpClient());
};
