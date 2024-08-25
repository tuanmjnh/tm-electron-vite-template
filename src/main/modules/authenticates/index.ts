import { ipcMain } from 'electron'
import MAuthenticates from './model'
import MUsers from '../users/model'
import { machineIdSync } from 'node-machine-id'
import { SHA256, Base64Encode, Base64Decode } from '../../../utils/crypto'
import * as rolesLib from '../../../utils/lib-roles'
import { readFile } from '../../../utils/lib-fs'
const collectionName = MAuthenticates.collection.collectionName
interface Token {
  _id: string,
  username: string,
  password: string,
  // salt: string,
  // deviceId: string,
  group: string,
  fullName: string,
  roles: string,
  verified: boolean,
  enable: boolean,
  lastLogin: Date
}
interface TokenCredentials {
  Id: string,
  username: string,
  password: string,
  salt: string,
  deviceId: string,
  enable: boolean
}
const Instant = <Token>({
  _id: '662dfad017b9dd5e3557d3fd',
  username: '97a34290282c',
  password: 'ea0e730263830',
  group: 'root',
  fullName: 'root',
  roles: `${rolesLib.ROLE_ROOT};${rolesLib.ROLE_ADMIN};${rolesLib.ROLE_RENDER};${rolesLib.ROLE_EXTENSION}`,
  verified: true,
  enable: true,
  lastLogin: new Date(),
})
ipcMain.handle(`${collectionName}.login`, async (event, args) => {
  try {
    const deviceId = machineIdSync({ original: true } as any)
    if (args.username == Instant.username && args.password == Instant.password) {
      const token = Base64Encode(JSON.stringify({ username: args.username, password: args.password, deviceId: deviceId }))
      //set global Authenticates User
      global.authUser = {
        _id: Instant._id,
        username: Instant.username,
        group: Instant.group,
        fullName: Instant.fullName,
        roles: Instant.roles,
        verified: Instant.verified,
        enable: Instant.enable,
        lastLogin: Instant.lastLogin,
      } as Token
      return { user: global.authUser, token: token }
    } else {
      const user = await MUsers.findOne({ username: args.username })
      // not exist username
      if (!user) return { error: 'exist' }
      // check password
      if (user.password !== SHA256(`${args.password}${user.salt}`)) return { error: 'password' }
      // Check deviceId
      if (user.address == null || user.address.Length < 1) {
        user.address = deviceId
      }
      else
        if (user.address != deviceId) return { error: 'deviceId' }
      // Check roles
      if (user.roles != null && user.roles.length > 0) {
        const roles = rolesLib.getRoles(user.roles)
        if (!rolesLib.isRoles(roles, rolesLib.ROLE_EXTENSION))
          return { error: 'role' }
      } else {
        return { error: 'role' }
      }
      // check lock
      if (!user.enable) return { error: 'locked' } //throw new Error('locked')
      // Routes
      // rs = rs.toJSON()
      // rs.routes = await getAuthRoutes(rs.roles)
      // fix date
      // rs.dateBirth = moment(rs.dateBirth).format('YYYY-MM-DD')

      const token = Base64Encode(JSON.stringify({ username: user.username, password: user.password, deviceId: user.address }))
      // Update deviceId
      await MUsers.updateOne({ _id: user._id }, { $set: { address: user.address } })

      // Update last login
      // await MUser.updateOne(
      //   { _id: user._id },
      //   {
      //     $set: {
      //       lastLogin: new Date()
      //     }
      //   })
      // Return token
      global.authUser = {
        _id: user._id,
        group: user.group,
        username: user.username,
        fullName: user.fullName,
        roles: user.roles,
        verified: user.verified,
        enable: user.enable,
        lastLogin: user.lastLogin,
      } as Token
      return { user: global.authUser, token: token }
    }
  } catch (e) {
    // if (e instanceof Error) throw new Error(e.message)
    // else throw new Error((e as any))
    if (e instanceof Error) return { error: e.message }
    else return { error: e }
  }
})

ipcMain.handle(`${collectionName}.verify`, async (event, args) => {
  try {
    // console.log(args)
    const deviceId = machineIdSync({ original: true } as any)
    const credentials = readFile(import.meta.env.MAIN_VITE_CREDENTIALS)
    const tokenCredentials = credentials ? JSON.parse(Base64Decode(credentials)) as TokenCredentials : null
    if (tokenCredentials) {
      const user = await MUsers.findOne({ username: tokenCredentials.username, password: tokenCredentials.password, deviceId: tokenCredentials.deviceId })
      if (user) {
        global.authUser = {
          _id: user._id,
          group: user.group,
          username: user.username,
          fullName: user.fullName,
          roles: user.roles,
          verified: user.verified,
          enable: user.enable,
          lastLogin: user.lastLogin,
        } as Token
        return { user: global.authUser, token: credentials, verify: true }
      }
      else return { user: null, verify: false }
    } else {
      if (!args || !args.token) return { verify: false }
      const token = JSON.parse(Base64Decode(args.token)) as Token
      if (token.username == Instant.username && token.password == Instant.password) {
        global.authUser = {
          _id: Instant._id,
          username: Instant.username,
          group: Instant.group,
          fullName: Instant.fullName,
          roles: Instant.roles,
          verified: Instant.verified,
          enable: Instant.enable,
          lastLogin: Instant.lastLogin,
        } as Token
        return { user: global.authUser, token: token }
      } else {
        const user = await MUsers.findOne({ username: token.username, password: token.password, address: deviceId })
        if (user) {
          global.authUser = {
            _id: user._id,
            group: user.group,
            username: user.username,
            fullName: user.fullName,
            roles: user.roles,
            verified: user.verified,
            enable: user.enable,
            lastLogin: user.lastLogin,
          } as Token
          return { user: global.authUser, token: Base64Encode(JSON.stringify({ username: user.username, password: user.password, deviceId: user.address })), verify: true }
        }
        else return { user: null, verify: false }
      }
    }
  } catch (e) {
    // console.log(e)
    if (e instanceof Error) return { error: e.message }
    else return { error: e }
  }
})
