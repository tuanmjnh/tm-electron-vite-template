export const HTMLInputElementFile = (opts) => {
  const _opts = { ...{ multiple: false, accept: '*', webkitdirectory: false }, ...opts }
  const input = document.createElement('input') as HTMLInputElement
  input.type = 'file'
  input.multiple = _opts.multiple
  input.accept = _opts.accept
  input.webkitdirectory = _opts.webkitdirectory
  // input.onchange = _ => {
  //   if (onChange) onChange(input)
  // }
  return input
}

export const XMLHttpRequestUploadFile = (url, file, onLoad?) => {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = (e: any) => {
      if (onLoad) onLoad(e)
      // you can keep blob or save blob to another position
      const blob = new Blob([e.target.result], { type: file.type })
      const formData = new FormData()
      // JavaScript file-like object
      formData.append("webmasterfile", blob)
      const request = new XMLHttpRequest()
      request.open("POST", url)
      request.send(formData)
      resolve(true)
    }
  })
}

export const getFileImage = (file, image) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    const img = document.createElement('img') as any
    reader.readAsDataURL(file)
    reader.onload = () => {
      img.src = reader.result
      if (image) resolve(img)
      else resolve(getBase64Image(img))
    }
  })
}

export const getBase64InputFile = (file) => {
  // return new Promise((resolve, reject) => {
  //   const reader = new FileReader()
  //   reader.onloadend = function () {
  //     resolve(reader.result)
  //   }
  //   reader.readAsDataURL(file)
  // })
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function (e: any) { resolve(e.target.result) }
    reader.onerror = function (e: any) { reject(new Error('Error reading' + file.name + ': ' + e.target.result)) }
    reader.readAsDataURL(file)
  })
}

export const getBase64Image = (img) => {
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height

  const ctx = canvas.getContext('2d') as any
  ctx.drawImage(img, 0, 0)
  const dataURL = img.src
  return dataURL
}

export const getFileName = (path) => {
  try {
    if (!path) return null
    const rs = path.replace(/^.*[\\/]/, '')
    return rs ? rs : null
  } catch (e) { return null }
}
export const getFileNameWithoutExtention = (path) => {
  try {
    if (!path) return null
    const rs = path.replace(/\.[^/.]+$/, "")
    return rs ? rs : null
  } catch (e) { return null }
}
export const getExtention = (path, dot = true) => {
  try {
    if (!path) return null
    path = path.toLowerCase()
    const regx = /(?:\.([^.]+))?$/
    path = regx.exec(path)
    const rs = path ? (dot ? path[0] : path[1]) : null
    return rs ? rs : null
  } catch (e) { return null }
}

export const isImage = (fileName) => {
  return /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(fileName)
}
