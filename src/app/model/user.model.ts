import {Role} from "./role.model";

export class User {
  constructor(public id?: number,
              public username?: string,
              public firstName?: string,
              public lastName?: string,
              public oldPassword?: string,
              public enable?: boolean,
              public roles?: Role[],
              public password?: string,
              public changePassword?: string
              ){}
}
