export interface IStore {
  id: string;
  username: string;
  age: number;
  hobbies: string;
}

export interface IResponse {
  statusCode: number;
  data: IStore | IStore[] | string;
}
