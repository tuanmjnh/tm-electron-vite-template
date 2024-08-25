const fs = require('fs')
const moment = require('moment')
const pathLog = `${process.cwd()}\\logs`

const checkPath = (path) => {
  if (!fs.existsSync(path)) fs.mkdirSync(path)
}

const saveFile = (fileName, content) => {
  try {
    const filePath = `${fileName}-${moment().format('YYYY-MM-DD')}.txt`
    const exist = fs.existsSync(filePath)
    fs.appendFile(filePath, `${exist ? ',' : ''}${content}`, function (e) { if (e) throw e })
    return true
  } catch (e) {
    return false
  }
}

export const SetLog = (collectionName, collectionID, method, session?) => {
  try {
    if (global.logger) {
      if (global.logger === 'db') {
        // const rs = await insert(request, collectionName, collectionID, method, session)
        // if (rs) return true
        // else return false
        return true
      } else if (global.logger === 'txt') {
        // Check path Log
        checkPath(pathLog)
        //
        const logger = {
          UID: global.authUser._id,
          name: collectionName,
          id: collectionID,
          method: method,
          at: moment().format('YYYY-MM-DD')
        }
        return saveFile(collectionName, JSON.stringify(logger))
      } return false
    } else return false
  } catch (e) {
    return false
  }
}
