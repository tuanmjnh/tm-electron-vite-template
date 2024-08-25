declare global {
  interface String {
    convertToAscii(): string;
    removeChars(): string;
    removeCharsFolder(): string;
    toHtml(): string;
    toUpperCaseFirst(): string;
    toUpperCaseSpace(): string;
    splitBrackets(include?: boolean): Array<string> | null;
  }
  interface Number {
    formatFileSize(si: boolean, dp: number): string;
    toThousandFilter(number: number): string;
    NumberFormat(): string;
  }
  interface Array<T> {
    pushIfNotExist<T>(element: any, key: any): void;
    pushIfNotExistUpdate<T>(element: any, key: any): void;
    distinctArray<T>(): Array<T>;
    distinctArrayObject<T>(key: string): Array<T>;
    sum<T>(obj?: any): number;
    max<T>(): number;
    min<T>(): number;
  }
}

String.prototype.convertToAscii = function () {
  // let $this = String(this)
  return this.toLowerCase()
    .replace(/[ ]/g, '_')
    // .replace('[', '')
    // .replace(']', '')
    .replace(/[áàãạảâầấậẫẩăằắẵặẳ]/g, 'a')
    .replace(/[èéẹẽẻêếềễểệ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'e')
    .replace(/[òóõọỏôỗộồốổơỡờớợỡở]/g, 'o')
    .replace(/[ùúụũủưừứựữử]/g, 'u')
    .replace(/[ýỳỹỷỵ]/g, 'y')
    .replace(/[đ]/g, 'd')
    .replace(/[~\`!@#$%^&*()--+={}\\|;:\'\"<,>.?/”“‘’„‰‾–—]/g, '')
}

String.prototype.removeChars = function () {
  return this.replace(/[~`!@#$%^&*()\[{}\]\\|;:\'\",<>./?]/g, '')
}

String.prototype.removeCharsFolder = function () {
  // < (less than)
  // > (greater than)
  // : (colon)
  // " (double quote)
  // / (forward slash)
  // \ (backslash)
  // | (vertical bar or pipe)
  // ? (question mark)
  // * (asterisk)
  return this.replace(/[<>:"/\\|?*]/g, '')
}

String.prototype.toHtml = function () {
  if (!this) return this
  const el = document.createElement('div') as HTMLElement;
  el.innerHTML = this as string
  const child = el.firstChild as any
  return child.data
}
String.prototype.toUpperCaseFirst = function () {
  if (!this) return this
  return this.charAt(0).toUpperCase() + this.slice(1)
}
String.prototype.toUpperCaseSpace = function () {
  if (!this) return this
  const arr = this.trim().split(' ')
  let rs = ''
  for (let i = 0; i < arr.length; i++) {
    rs += arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
    if (i < arr.length - 1) rs += ' '
  }
  return rs
}
String.prototype.splitBrackets = function (include?) {
  if (!this) return this
  if (include) return this.trim().match(/\[(.*?)\]/g)
  else return this.trim().match(/(?<=\[)[^\]\[\r\n]*(?=\])/g)
}
// String.prototype.formatDate = function (format = 'DD/MM/YYYY') {
//   if (!this) return this
//   return moment(this).format(format)
// }

// Number
Number.prototype.formatFileSize = function (si = true, dp = 1) {
  let bytes = parseInt(this.toString())
  const thresh = si ? 1000 : 1024

  if (Math.abs((bytes)) < thresh) return bytes + ' B'

  const units = si ? ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  let u = -1
  const r = 10 ** dp

  do {
    bytes /= thresh
    ++u
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1)

  return bytes.toFixed(dp) + ' ' + units[u]
}
Number.prototype.toThousandFilter = function (num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}
Number.prototype.NumberFormat = function (language = 'en-US') {
  return new Intl.NumberFormat(language).format(parseInt(this.toString()))
}

// Array
Array.prototype.pushIfNotExist = function (element, key) {
  if (Array.isArray(element)) {
    element.forEach(e => {
      if (key) {
        if (this.findIndex(x => x[key] === e[key]) < 0) this.push(e)
      } else {
        if (this.indexOf(e) < 0) this.push(e)
      }
    })
  } else {
    if (key) {
      if (this.findIndex(x => x[key] === element[key]) < 0) this.push(element)
    } else {
      if (this.indexOf(element) < 0) this.push(element)
    }
  }
}
Array.prototype.pushIfNotExistUpdate = function (element, key) {
  if (Array.isArray(element)) {
    element.forEach(e => {
      if (key) {
        const item = this.find(x => x[key] === e[key])
        if (item) {
          Object.keys(item).forEach(k => {
            item[k] = e[k]
          })
        } else this.push(e)
      } else {
        if (this.indexOf(e) < 0) this.push(e)
      }
    })
  } else {
    if (key) {
      const item = this.find(x => x[key] === element[key])
      if (item) {
        Object.keys(item).forEach(k => {
          item[k] = element[k]
        })
      } else this.push(element)
      // if (this.findIndex(x => x[key] === element[key]) < 0) this.push(element)
    } else {
      if (this.indexOf(element) < 0) this.push(element)
    }
  }
}
Array.prototype.distinctArray = function () {
  return [...new Set(this)]
}
Array.prototype.distinctArrayObject = function (key) {
  return [...new Set(this.map(x => x[key]))]
}
Array.prototype.sum = function (prop) {
  let total = 0
  if (prop) {
    for (let i = 0, length = this.length; i < length; i++) {
      const number = parseInt(this[i][prop])
      if (number) total = total + number
    }
  } else {
    for (let i = 0, length = this.length; i < length; i++) {
      const number = parseInt(this[i])
      if (number) total = total + number
    }
  }
  return total
}
Array.prototype.max = function () {
  return Math.max.apply(null, this)
}
Array.prototype.min = function () {
  return Math.min.apply(null, this)
}

// Array.prototype.sort = function (a, b) {
//   var keyA = new Date(a.updated_at),
//     keyB = new Date(b.updated_at)
//   // Compare the 2 dates
//   if (keyA < keyB) return -1
//   if (keyA > keyB) return 1
//   return 0
// }

export { }
