export interface IStore {
  id: string;
  username: string;
  age: number;
  hobbies: string;
}

export interface IResponse {
  status: number;
  data: IStore | IStore[] | string;
}
