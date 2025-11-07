import { store } from '../store/store.ts';
import type { IResponse } from '../types/types.ts';

export const GET = (url: string | undefined) => {
  const response: Partial<IResponse> = {};
  const userId = url?.split('/')[3];
  if (url && userId) {
    for (let i = 0; i < store.length; i++) {
      if (userId === store[i].id.toString()) {
        response.status = 200;
        response.data = store[i];
        return response;
      }
    }

    response.status = 404;
    response.data = 'Invalid userId';
    return response;
  } else {
    response.status = 200;
    response.data = store;
    return response;
  }
};
