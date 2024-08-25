/// <reference path="../global.d.ts"/>

/* Role database table fields */
namespace Entity {
  interface DemoList {
    id: number
    name: string
    age: number
    gender: '0' | '1' | null
    email: string
    address: string
    role: Entity.RoleType
    disabled: boolean
  }
}
