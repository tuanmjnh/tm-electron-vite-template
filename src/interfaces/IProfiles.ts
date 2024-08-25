export interface ITimezone {
  auto: boolean,
  TZ?: string
}
export interface ILocation {
  auto: boolean,
  latitude?: number,
  longitude?: number
}
export interface IAccount {
  type: string,
  username: string,
  password: string
}
export interface IProxy {
  type: string,
  host: string,
  port: number,
  username: string,
  password: string
}
export interface IProfiles {
  _id?: string,
  key: string,
  name: string,
  browserType: string,
  browserVersion: string,
  userAgent: string,
  proxies?: Array<IProxy>,
  // proxyType: string,
  // proxyHost: string,
  // proxyPort: string,
  // proxyUsername: string,
  // proxyPassword: string,
  location?: ILocation,
  timezone?: ITimezone,
  webRTC: string,
  startUrl: string,
  extensions: string,
  accounts: Array<IAccount>,
  desc: string,
  order: number,
  flag: number,
  created: any
}
