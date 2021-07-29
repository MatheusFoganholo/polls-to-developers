export enum HttpStatusCode {
  badRequest = 400,
  noContent = 204,
  notFound = 404,
  ok = 200,
  serverError = 500,
  unauthorized = 401
}

export type HttpResponse = {
  statusCode: HttpStatusCode;
  body?: any;
};
