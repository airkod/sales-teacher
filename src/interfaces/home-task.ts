import {IList} from "./list";
import {IUser} from "./user";
import {ILesson} from "./lesson";

export interface IHomeTask extends IList {
  id?: string,
  title?: string,
  answer?: string,
  files?: Array<string>,
  createdDateTime?: number,
  assessment?: number,
  comment?: string,
  assessmentDateTime?: number,
  status?: string,
  user?: IUser,
  lesson?: ILesson,
  notification?: boolean
}
