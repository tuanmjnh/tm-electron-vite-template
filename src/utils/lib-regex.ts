export const splitBrackets = (val: string, include?: boolean) => {
  try {
    if (include) {
      const rs = val.trim().match(/\[(.*?)\]/g)
      return rs ? rs as Array<string> : [] as Array<string>
    }
    else {
      const rs = val.trim().match(/(?<=\[)[^\]\[\r\n]*(?=\])/g)
      return rs ? rs as Array<string> : [] as Array<string>
    }
  } catch (e) { return [] }
}
