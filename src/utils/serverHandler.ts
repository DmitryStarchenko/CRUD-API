import type { IncomingMessage, ServerResponse } from 'http';
import type { IResponse } from '../types/types';

export const serverHandler = (res: ServerResponse<IncomingMessage>, data: Partial<IResponse>) => {
  if (data?.status) {
    res.statusCode = data.status;
    res.write(JSON.stringify(data.data));
    res.end();
  }
};
