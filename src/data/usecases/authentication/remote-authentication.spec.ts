import { internet } from 'faker';
import { HttpPostClientSpy } from '../../test/mock-http-client';
import { mockAuthentication } from '../../../domain/test/mock-authentication';
import { RemoteAuthentication } from './remote-authentication';

type SutTypes = {
  sut: RemoteAuthentication;
  httpPostClientSpy: HttpPostClientSpy;
};

// SUT: System Under Test
const makeSut = (url = internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy();
  const sut = new RemoteAuthentication(url, httpPostClientSpy);

  return {
    sut,
    httpPostClientSpy
  };
};

describe('RemoteAuthentication', () => {
  test('Should call HttpPostClient with correct URL', async () => {
    const url = internet.url();
    const { sut, httpPostClientSpy } = makeSut(url);

    await sut.auth(mockAuthentication());

    expect(httpPostClientSpy.url).toBe(url);
  });

  test('Should call HttpPostClient with correct body', async () => {
    const authenticationParams = mockAuthentication();
    const { sut, httpPostClientSpy } = makeSut();

    await sut.auth(authenticationParams);

    expect(httpPostClientSpy.body).toEqual(authenticationParams);
  });
});
