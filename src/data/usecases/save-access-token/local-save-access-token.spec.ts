import { random } from 'faker';
import { LocalSaveAccessToken } from './local-save-access-token';
import { SetStorageMock } from '@/data/test/mock-storage';

type SutTypes = {
  setStorageMock: SetStorageMock;
  sut: LocalSaveAccessToken;
};

const makeSut = (): SutTypes => {
  const setStorageMock = new SetStorageMock();
  const sut = new LocalSaveAccessToken(setStorageMock);

  return {
    setStorageMock,
    sut
  };
};

describe('LocalSaveAccessToken', () => {
  test('Should call SetStorage with correct value', async () => {
    const accessToken = random.uuid();
    const { setStorageMock, sut } = makeSut();

    await sut.save(accessToken);

    expect(setStorageMock.key).toBe('accessToken');
    expect(setStorageMock.value).toBe(accessToken);
  });
});
