/// <reference path="../global.d.ts"/>

namespace Api {
  namespace Login {
    /* User fields returned after login, this data is extended from the user table, some fields may need to be overwritten, such as id */
    interface Info extends Entity.User {
      /** User id */
      id: number
      /** User role type */
      role: Entity.RoleType
      /** Access token */
      accessToken: string
      /** Refresh token */
      refreshToken: string
    }
  }
}
