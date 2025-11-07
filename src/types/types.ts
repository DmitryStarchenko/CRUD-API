export interface IStore {
    id: number,
    username: string,
    age: number,
    hobbies: string
}

export interface IResponse {
  status: number,
  user: IStore | IStore[] | string
}