import type { IncomingMessage } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { addToStore } from '../store/store.ts';
import type { IResponse } from '../types/types.ts';

export const POST = async (req: IncomingMessage): Promise<IResponse> => {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk: string) => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const { id, username, age, hobbies } = JSON.parse(body);
        if (id || !username || !age || !hobbies) {
          resolve({
            statusCode: 400,
            data: 'username, age and hobbies are required',
          });
          return;
        }
        const userData = JSON.parse(body);
        const newUser = {
          id: uuidv4(),
          ...userData,
        };

        await addToStore(newUser);

        resolve({
          statusCode: 201,
          data: newUser,
        });
      } catch {
        resolve({
          statusCode: 400,
          data: 'Invalid JSON',
        });
      }
    });
  });
};
