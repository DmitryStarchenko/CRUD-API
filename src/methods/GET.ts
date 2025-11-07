import {store} from '../store/store.ts';
import type { IResponse } from '../types/types.ts';


const GET = (url: string | undefined) => {
  let response: Partial<IResponse> = {}
  const userId = url?.split('/')[3]
  if(url && userId) {
    for(let i = 0; i < store.length; i++) {
      if (userId === store[i].id.toString()) {
        response.status = 200;
        response.user = store[i];
        return response;
      }
    }

    response.status = 404;
    response.user = 'Invalid userId';
    return response
  } else {
    response.status = 200;
    response.user = store;
    return response
  }
}

export {GET}