/// <reference path="../global.d.ts"/>

/** User database table fields */
namespace Entity {
  interface User {
    /** User id */
    id?: number
    /** User name */
    userName?: string
    /* User avatar */
    avatar?: string
    /* User gender */
    gender?: 0 | 1
    /* User email */
    email?: string
    /* User nickname */
    nickname?: string
    /* User phone */
    tel?: string
    /** User role type */
    role?: Entity.RoleType[]
    /** User status */
    status?: 0 | 1
    /** Remark */
    remark?: string
  }
}
