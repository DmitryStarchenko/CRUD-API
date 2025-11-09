import type { IncomingMessage } from 'http';
import { validate } from 'uuid';
import { getStore, updateStore, findInStore } from '../store/store.ts';
import type { IResponse } from '../types/types.ts';

export const PUT = async (req: IncomingMessage): Promise<IResponse> => {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk: string) => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const userData = JSON.parse(body);
        const urlParts = req.url ? req.url.split('/') : [];
        const userId = urlParts[urlParts.length - 1];

        if (validate(userId)) {
          const existingUser = await findInStore(userId);
          if (!existingUser) {
            resolve({
              statusCode: 404,
              data: 'User not found',
            });
            return;
          }

          if (userData.id !== undefined) {
            resolve({
              statusCode: 400,
              data: 'ID field is not allowed in request body',
            });
            return;
          }

          const store = await getStore();
          const updatedStore = store.map((item) =>
            item.id === userId ? { ...item, ...userData } : item,
          );
          await updateStore(updatedStore);

          resolve({
            statusCode: 200,
            data: { ...existingUser, ...userData },
          });
        } else {
          resolve({
            statusCode: 400,
            data: 'Invalid userID',
          });
        }
      } catch {
        resolve({
          statusCode: 400,
          data: 'Invalid JSON',
        });
      }
    });
  });
};
