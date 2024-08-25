import * as fs from "fs"
import path from 'path'
// const { promisify } = require('util')
// interface File {
//   name: string,
//   type: string,
//   size: number,
//   ext: string,
//   stat: object
// }
export const writeFile = async (fileURL, content, opts = { encoding: 'utf8' }) => {
  try {
    return new Promise(function (resolve, reject) {
      fs.writeFile(fileURL, content, function (err) {
        if (err) resolve(false)
        else resolve(true)
      })
    })
  } catch (e) {
    return false
  }
}
export const readFile = (fileURL, opts = { encoding: 'utf8' as BufferEncoding }) => {
  try {
    // readFile('C:\\Users\\<userAccount>\\Documents\\test.txt', 'utf8')
    //readfile does not accept the file:\\\ thing, so we remove it
    const pathToFile = fileURL.replace("file:\\\\", '')
    const exist = fs.existsSync(pathToFile)
    if (exist) return fs.readFileSync(pathToFile, opts)
    else return null
  } catch (e) {
    return null
  }
}
export const readFiles = (dir: string, opts = { type: '', exclude: '', ext: '', content: false } as any) => {
  try {
    const filesDir = fs.readdirSync(dir)
    const files: Array<any> = []
    const regExt = /\.([0-9a-z]+)(?:[\?#]|$)/i
    const exts = opts.ext ? opts.ext.toLowerCase().split('|') : []
    for (const e of filesDir) {
      const filepath = path.resolve(dir, e)
      const stat = fs.statSync(filepath)
      const ext = path.parse(e).ext.toLowerCase()
      if (opts.exclude != null && e == opts.exclude) continue
      const file = { ...stat, ...{ name: e, type: undefined, dir: dir } } as any
      if (opts.type == 'folder') {
        if (stat.isDirectory()) {
          file.type = 'folder'
          files.push(file)
        }
      } else if (opts.type == 'file') {
        if (stat.isFile()) {
          file.type = 'file'
          file.ext = ext
          if (opts.content) file.content = readFile(`${dir}\\${e}`)
          if (exts.length) {
            if (exts.indexOf(ext) > -1) files.push(file)
          } else
            files.push(file)
        }
      } else {
        if (stat.isDirectory()) {
          file.type = 'folder'
          files.push(file)
        }
        else {
          file.type = 'file'
          file.ext = ext
          if (opts.content) file.content = readFile(`${dir}\\${e}`)
          if (exts.length) {
            if (exts.indexOf(ext) > -1)
              files.push(file)
          } else files.push(file)
        }
      }
    }
    files.sort((a, b) => {
      // natural sort alphanumeric strings
      // https://stackoverflow.com/a/38641281
      return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
    })
    return files
  } catch (e) {
    console.log(e)
    return []
  }
}

// // Recursive function to get files
// function getFiles(dir, files: Array<string> = []) {
//   // Get an array of all files and directories in the passed directory using fs.readdirSync
//   const fileList = fs.readdirSync(dir)
//   // Create the full path of the file/directory by concatenating the passed directory and file/directory name
//   for (const file of fileList) {
//     const name = `${dir}/${file}`
//     // Check if the current file/directory is a directory using fs.statSync
//     if (fs.statSync(name).isDirectory()) {
//       // If it is a directory, recursively call the getFiles function with the directory path and the files array
//       getFiles(name, files)
//     } else {
//       // If it is a file, push the full path to the files array
//       files.push(name)
//     }
//   }
//   return files
// }

//https://stackoverflow.com/questions/10049557/reading-all-files-in-a-directory-store-them-in-objects-and-send-the-object
function readFilesX(dir, processFile) {
  // read directory
  fs.readdir(dir, (error, fileNames) => {
    if (error) throw error

    fileNames.forEach(filename => {
      // get current file name
      const name = path.parse(filename).name
      // get current file extension
      const ext = path.parse(filename).ext
      // get current file path
      const filepath = path.resolve(dir, filename)

      // get information about the file
      fs.stat(filepath, function (error, stat) {
        if (error) throw error

        // check if the current path is a file or a folder
        const isFile = stat.isFile()

        // exclude folders
        if (isFile) {
          // callback, do something with the file
          processFile(filepath, name, ext, stat)
        }
      })
    })
  })
}
/*
// use an absolute path to the folder where files are located
readFiles('absolute/path/to/directory/', (filepath, name, ext, stat) => {
  console.log('file path:', filepath)
  console.log('file name:', name)
  console.log('file extension:', ext)
  console.log('file information:', stat)
})
*/

/**
 * @description Read files synchronously from a folder, with natural sorting
 * @param {String} dir Absolute path to directory
 * @returns {Object[]} List of object, each object represent a file
 * structured like so: `{ filepath, name, ext, stat }`
 */
function readFilesSync(dir) {
  const files = [] as any

  fs.readdirSync(dir).forEach(filename => {
    const name = path.parse(filename).name
    const ext = path.parse(filename).ext
    const filepath = path.resolve(dir, filename)
    const stat = fs.statSync(filepath)
    const isFile = stat.isFile()

    if (isFile) files.push({ filepath, name, ext, stat } as any)
  })

  files.sort((a, b) => {
    // natural sort alphanumeric strings
    // https://stackoverflow.com/a/38641281
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
  })

  return files
}
// return an array list of objects
// each object represent a file
// const files = readFilesSync('absolute/path/to/directory/')

/*
const readdir_promise = promisify(fs.readdir)
const stat_promise = promisify(fs.stat)

function readFilesAsync(dir) {
  return readdir_promise(dir, { encoding: 'utf8' })
    .then(filenames => {
      const files = getFiles(dir, filenames)

      return Promise.all(files)
    })
    .catch(err => console.error(err))
}

function getFiles(dir, filenames) {
  return filenames.map(filename => {
    const name = path.parse(filename).name
    const ext = path.parse(filename).ext
    const filepath = path.resolve(dir, filename)

    return stat({ name, ext, filepath })
  })
}

function stat({ name, ext, filepath }) {
  return stat_promise(filepath)
    .then(stat => {
      const isFile = stat.isFile()

      if (isFile) return { name, ext, filepath, stat }
    })
    .catch(err => console.error(err))
}
readFiles('absolute/path/to/directory/')
  // return an array list of objects
  // each object is a file
  // with those properties: { name, ext, filepath, stat }
  .then(files => console.log(files))
  .catch(err => console.log(err))
  readFiles('absolute/path/to/directory/')
  .then(files => files.filter(file => file !== undefined))
  .catch(err => console.log(err))
*/

export const createDir = async function (dir, splitChar?) {
  try {
    const dirs = dir.replace(/^\/|\/$/g, '').split(splitChar ? splitChar : '/')
    const result = [] as any
    let paths = ''
    // create public if not exist
    // loop list path to create
    for await (const e of dirs) {
      paths = paths ? `${paths}\\${e}` : e//path.join(paths, e)
      if (!fs.existsSync(paths)) {
        await fs.mkdirSync(paths)
        result.push(e)
      }
    }
    return result
  } catch (e) { return null }
}

// export const rename = async (oldPath, newPath) => {
//   try {
//     // if (!fs.existsSync(oldPath)) {
//     await fs.renameSync(oldPath, newPath)
//     return true
//     // }
//     // return false
//   } catch (e) { throw new Error(e) }
// }

// export const getFolder = ({ dir, root, host }) => {
//   try {
//     let result = []
//     root = root || process.env.PUBLIC_DIR
//     const _dir = path.join(root, dir)
//     const dirs = fs.readdirSync(_dir)
//     // for (const i in dirs) {
//     for (let i = 0; i < dirs.length; i++) {
//       const stat = fs.statSync(path.join(_dir, dirs[i]))
//       const isDirectory = stat.isDirectory()
//       const item = {
//         id: stat.ino,
//         name: dir[i],
//         fullName: isDirectory ? `${dir}/${dirs[i]}` : `${host}/${dir}/${dirs[i]}`,
//         size: stat.size,
//         ext: path.extname(dir[i]),
//         icon: stat.isDirectory() ? 'folder' : 'file'
//       }
//       result.push(item)
//     }
//     return result
//   } catch (e) { throw new Error(e) }
// }

// export const getAllFolder = ({ dir, parent, root, host }) => {
//   try {
//     let result = []
//     root = root || process.env.PUBLIC_DIR
//     const _dir = path.join(root, dir)
//     const dirs = fs.readdirSync(_dir)
//     // for (const i in dirs) {
//     for (let i = 0; i < dirs.length; i++) {
//       const stat = fs.statSync(path.join(_dir, dirs[i]))
//       const isDirectory = stat.isDirectory()
//       const item = {
//         id: stat.ino,
//         name: dir[i],
//         fullName: isDirectory ? `${dir}/${dirs[i]}` : `${host}/${dir}/${dirs[i]}`,
//         path: parent ? parent : dir,
//         fullPath: dir,
//         size: stat.size,
//         ext: path.extname(dir[i]),
//         icon: isDirectory ? 'folder' : 'file'
//       }
//       if (isDirectory) {
//         const items = getAllFolder({ dir: item.fullName, parent: item.name, host: host })
//         if (items && items.length) result = [...result, ...items]
//       }
//       result.push(item)
//     }
//     return result
//   } catch (e) { throw new Error(e) }
// }

// export const getDirectories = ({ dir, root }) => {
//   try {
//     const result = []
//     root = root || process.env.PUBLIC_DIR
//     const _dir = path.join(root, dir)
//     const dirs = fs.readdirSync(_dir)
//     // for (const i in dirs) {
//     for (let i = 0; i < dirs.length; i++) {
//       const stat = fs.statSync(path.join(_dir, dirs[i]))
//       const item = {
//         id: stat.ino,
//         name: dirs[i],
//         fullName: `${dir}/${dirs[i]}`,
//         fullPath: dir,
//         icon: 'folder'
//       }
//       if (stat.isDirectory()) result.push(item)
//     }
//     return result
//   } catch (e) { throw new Error(e) }
// }

// export const getAllDirectories = ({ dir, parent, root }) => {
//   try {
//     const result = []
//     root = root || process.env.PUBLIC_DIR
//     // root = root || `./${process.env.PUBLIC_PATH}`
//     const _dir = path.join(root, dir)
//     const dirs = fs.readdirSync(_dir)
//     // for (const i in dirs) {
//     for (let i = 0; i < dirs.length; i++) {
//       // const _path = `${_dir}\\${dirs[i]}`
//       const stat = fs.statSync(path.join(_dir, dirs[i]))
//       const item = {
//         id: stat.ino,
//         name: dirs[i],
//         fullName: `${dir}/${dirs[i]}`,
//         path: parent ? parent : dir,
//         fullPath: dir,
//         icon: 'folder',
//         isDirectory: stat.isDirectory(),
//         children: []
//       }
//       if (item.isDirectory) {
//         item.children = getAllDirectories({ dir: item.fullName, parent: item.name })
//         result.push(item)
//       }
//     }
//     return result
//   } catch (e) { throw new Error(e) }
// }

// export const getFiles = ({ dir, root, host }) => {
//   try {
//     const result = []
//     root = root || process.env.PUBLIC_DIR
//     const _dir = path.join(root, dir)
//     const dirs = fs.readdirSync(_dir)
//     // for (const i in dirs) {
//     for (let i = 0; i < dirs.length; i++) {
//       const stat = fs.statSync(path.join(_dir, dirs[i]))
//       const item = {
//         id: stat.ino,
//         name: dirs[i],
//         fullName: `${host}/${dir}/${dirs[i]}`,
//         size: stat.size,
//         ext: path.extname(dirs[i]),
//         icon: 'file'
//       }
//       if (stat.isFile()) result.push(item)
//     }
//     return result
//   } catch (e) { throw new Error(e) }
// }

// export const getAllFiles = ({ dir, root, parent, host }) => {
//   try {
//     let result = []
//     root = root || process.env.PUBLIC_DIR
//     const _dir = path.join(root, dir)
//     const dirs = fs.readdirSync(_dir)
//     // for (const i in dirs) {
//     for (let i = 0; i < dirs.length; i++) {
//       const stat = fs.statSync(path.join(_dir, dirs[i]))
//       const item = {
//         id: stat.ino,
//         name: dirs[i],
//         fullName: `${host}/${dir}/${dirs[i]}`,
//         path: parent ? parent : dir,
//         fullPath: dir,
//         size: stat.size,
//         ext: path.extname(dirs[i]),
//         icon: 'file'
//       }
//       if (stat.isDirectory()) {
//         const items = getAllFiles({ dir: item.fullName, parent: item.name, host: host })
//         if (items && items.length) result = [...result, ...items]
//       }
//       if (stat.isFile()) result.push(item)
//     }
//     return result
//   } catch (e) { throw new Error(e) }
// }
