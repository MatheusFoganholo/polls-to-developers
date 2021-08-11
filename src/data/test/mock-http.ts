import { internet, random } from 'faker';
import {
  HttpResponse,
  HttpStatusCode,
  HttpPostClient,
  HttpPostParams
} from '@/data/protocols/http';

export const mockPostRequest = (): HttpPostParams<any> => ({
  url: internet.url(),
  body: random.objectElement()
});

export class HttpPostClientSpy<T, R> implements HttpPostClient<T, R> {
  url?: string;
  body?: T;
  response: HttpResponse<R> = {
    statusCode: HttpStatusCode.ok
  };

  async post(params: HttpPostParams<T>): Promise<HttpResponse<R>> {
    this.url = params.url;
    this.body = params.body;
    return this.response;
  }
}
