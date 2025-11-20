import type { IResponse } from '../types/types.ts';
import { ServerResponse } from 'http';

export const serverHandler = async (res: ServerResponse, data: IResponse | Promise<IResponse>) => {
  try {
    const responseData = data instanceof Promise ? await data : data;
    res.statusCode = responseData.statusCode;
    res.write(JSON.stringify(responseData.data));
    res.end();
  } catch {
    res.statusCode = 500;
    res.write(JSON.stringify({ error: 'Internal server error' }));
    res.end();
  }
};
