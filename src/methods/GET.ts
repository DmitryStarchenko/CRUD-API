import { validate } from 'uuid';
import { getStore, findInStore } from '../store/store.ts';

export const GET = async (url: string) => {
  if (url === '/api/users') {
    const store = await getStore();
    return {
      statusCode: 200,
      data: store,
    };
  } else {
    const userId = url.split('/').pop();
    if (validate(userId)) {
      if (userId) {
        const user = await findInStore(userId);
        if (user) {
          return {
            statusCode: 200,
            data: user,
          };
        }
      }
      return {
        statusCode: 404,
        data: 'User not found',
      };
    } else {
      return {
        statusCode: 400,
        data: 'Invalid userID',
      };
    }
  }
};
