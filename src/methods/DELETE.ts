import { validate } from 'uuid';
import { removeFromStore, findInStore } from '../store/store.ts';

export const DELETE = async (url: string) => {
  const urlParts = url.split('/');
  const userId = urlParts[urlParts.length - 1];

  if (validate(userId)) {
    const existingUser = await findInStore(userId);
    if (!existingUser) {
      return {
        statusCode: 404,
        data: 'User not found',
      };
    }

    await removeFromStore(userId);

    return {
      statusCode: 200,
      data: 'User deleted successfully',
    };
  } else {
    return {
      statusCode: 400,
      data: 'Invalid userID',
    };
  }
};
