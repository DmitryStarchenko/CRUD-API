import type { IncomingMessage } from 'http';
import { store } from '../store/store.ts';
import type { IResponse } from '../types/types.ts';
import { validate } from 'uuid';

export const PUT = (req: IncomingMessage): Promise<Partial<IResponse>> => {
  const response: Partial<IResponse> = {};
  const userId = req.url?.split('/')[3];
  return new Promise((resolve, reject) => {
    req.on('data', (chunk) => {
      const { username = undefined, age = undefined, hobbies = undefined } = JSON.parse(chunk);
      if (validate(userId)) {
        for (let i = 0; i < store.length; i++) {
          if (userId === store[i].id.toString()) {
            if (username) store[i].username = username;
            if (age) store[i].age = age;
            if (hobbies) store[i].hobbies = hobbies;
            response.status = 200;
            response.data = store[i];
          } else {
            response.status = 404;
            response.data = 'This user does not exist';
          }
        }
      } else {
        response.status = 400;
        response.data = 'Invalid userID';
      }
    });

    req.on('end', () => {
      resolve(response);
    });

    req.on('error', (err) => {
      reject(err);
    });
  });
};
