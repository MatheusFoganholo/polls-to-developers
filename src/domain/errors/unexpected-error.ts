export class UnexpectedError extends Error {
  constructor() {
    super('An error has occurred. Try again later.');
    this.name = 'UnexpectedError';
  }
}
