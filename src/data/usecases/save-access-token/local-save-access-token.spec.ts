import { random } from 'faker';
import { LocalSaveAccessToken } from './local-save-access-token';
import { SetStorageSpy } from '@/data/test/mock-storage';

type SutTypes = {
  setStorageSpy: SetStorageSpy;
  sut: LocalSaveAccessToken;
};

const makeSut = (): SutTypes => {
  const setStorageSpy = new SetStorageSpy();
  const sut = new LocalSaveAccessToken(setStorageSpy);

  return {
    setStorageSpy,
    sut
  };
};

describe('LocalSaveAccessToken', () => {
  test('Should call SetStorage with correct value', async () => {
    const accessToken = random.uuid();
    const { setStorageSpy, sut } = makeSut();

    await sut.save(accessToken);

    expect(setStorageSpy.key).toBe('accessToken');
    expect(setStorageSpy.value).toBe(accessToken);
  });
});
