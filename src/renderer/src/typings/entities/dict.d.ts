/// <reference path="../global.d.ts"/>

/* Dictionary database table fields */
namespace Entity {

  interface Dict {
    id?: number
    isRoot?: 0 | 1
    code: string
    label: string
    value?: number
  }
}
