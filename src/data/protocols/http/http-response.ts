export enum HttpStatusCode {
  badRequest = 400,
  forbidden = 403,
  noContent = 204,
  notFound = 404,
  ok = 200,
  serverError = 500,
  unauthorized = 401
}

export type HttpResponse<T> = {
  statusCode: HttpStatusCode;
  body?: T;
};
