import axios from 'axios';
import { internet } from 'faker';
import { AxiosHttpClient } from './axios-http-client';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AxiosHttpClient', () => {
  test('Should call axios with correct URL', async () => {
    const url = internet.url();
    const sut = new AxiosHttpClient();

    await sut.post({ url });

    expect(mockedAxios).toHaveBeenCalledWith(url);
  });
});
