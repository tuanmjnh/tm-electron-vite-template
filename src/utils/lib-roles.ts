export const ROLE_ROOT = "root"
export const ROLE_ADMIN = "admin"
export const ROLE_RENDER = "render"
export const ROLE_EXTENSION = "extension"

export const getRoles = (role: string) => {
  try {
    if (role != null && role.length > 0) return role.split(';')
    else return []
  }
  catch (e) {
    return []
  }
}
export const isRoles = (roles: Array<string>, role: string) => {
  try {
    if (roles != null && roles.length > 0) {
      return roles.indexOf(role) > -1 ? true : false
    }
    else return false
  }
  catch (e) {
    return false
  }
}
