import { database, random } from 'faker';
import { LocalStorageAdapter } from './local-storage-adapter';
import 'jest-localstorage-mock';

describe('LocalStorageAdapter', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('Should call localStorage with correct values', async () => {
    const sut = new LocalStorageAdapter();
    const key = database.column();
    const value = random.word();

    await sut.set(key, value);

    expect(localStorage.setItem).toHaveBeenCalledWith(key, value);
  });
});
