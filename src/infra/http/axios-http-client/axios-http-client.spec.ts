import axios from 'axios';
import { internet } from 'faker';
import { AxiosHttpClient } from './axios-http-client';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

const makeSut = (): AxiosHttpClient => {
  return new AxiosHttpClient();
};

describe('AxiosHttpClient', () => {
  test('Should call axios with correct URL and verb', async () => {
    const url = internet.url();
    const sut = makeSut();

    await sut.post({ url });

    expect(mockedAxios.post).toHaveBeenCalledWith(url);
  });
});
