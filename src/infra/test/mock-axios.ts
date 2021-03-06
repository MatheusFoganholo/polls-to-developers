import axios from 'axios';
import { random } from 'faker';

export const mockHttpResponse = (): any => ({
  data: random.objectElement(),
  status: random.number()
});

export const mockAxios = (): jest.Mocked<typeof axios> => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  mockedAxios.post.mockResolvedValue(mockHttpResponse());

  return mockedAxios;
};
