import {IUser} from "../interfaces/user";

export interface IChatRoom {
  id?: string,
  user?: IUser,
  notification?: boolean
}
