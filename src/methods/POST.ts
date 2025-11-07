import type { IncomingMessage } from 'http';
import type { IResponse, IStore } from '../types/types';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../store/store.ts';

export const POST = (req: IncomingMessage): Promise<Partial<IResponse>> => {
  const response: Partial<IResponse> = {};
  return new Promise((resolve, reject) => {
    req.on('data', (chunk) => {
      const { username = undefined, age = undefined, hobbies = undefined } = JSON.parse(chunk);
      if (!username || !age || !hobbies) {
        response.status = 400;
        response.data = 'username, age and hobbies are required';
        resolve(response);
      } else {
        const userId = uuidv4();
        const newUser: IStore = {
          id: userId,
          username: username,
          age: age,
          hobbies: hobbies,
        };
        store.push(newUser);
        response.status = 201;
        response.data = newUser;
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
