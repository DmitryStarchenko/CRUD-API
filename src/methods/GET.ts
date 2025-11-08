import { store } from '../store/store.ts';
import type { IResponse } from '../types/types.ts';
import { validate } from 'uuid';

export const GET = (url: string | undefined) => {
  const response: Partial<IResponse> = {};
  const userId = url?.split('/')[3];
  if (userId && validate(userId)) {
    for (let i = 0; i < store.length; i++) {
      if (userId === store[i].id.toString()) {
        response.status = 200;
        response.data = store[i];
        return response;
      }
    }

    response.status = 404;
    response.data = 'This user does not exist';
    return response;
  } else if (!userId) {
    response.status = 200;
    response.data = store;
    return response;
  } else {
    response.status = 400;
    response.data = 'Invalid userID';
    return response;
  }
};
