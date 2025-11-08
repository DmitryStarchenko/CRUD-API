import { store } from '../store/store.ts';
import type { IResponse } from '../types/types.ts';
import { validate } from 'uuid';

export const DELETE = (url: string | undefined): Partial<IResponse> => {
  const response: Partial<IResponse> = {};
  const userId = url?.split('/')[3];
  if (url && validate(userId)) {
    for (let i = 0; i < store.length; i++) {
      if (userId === store[i].id.toString()) {
        removeUser(userId);
        response.status = 200;
        response.data = 'The post has been deleted';
        return response;
      }
    }
    response.status = 404;
    response.data = 'This user does not exist';
    return response;
  } else {
    response.status = 400;
    response.data = 'Invalid userID';
    return response;
  }
};

const removeUser = (id: string | undefined) => {
  const index = store.findIndex((item) => item.id === id);
  if (index !== -1) {
    store.splice(index, 1);
  }
};
