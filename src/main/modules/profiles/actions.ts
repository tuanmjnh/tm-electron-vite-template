import MProfiles from './model'
export const collectionName = MProfiles.collection.collectionName
export const Get = (conditions) => {
  try {
    if (conditions) return MProfiles.aggregate([{ $match: conditions }])
    else return MProfiles.find()
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}
export const Select = (conditions, fields) => {
  try {
    if (fields) return MProfiles.where(conditions, fields)
    else return MProfiles.where(conditions)
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}

export const FindOne = (conditions, fields?) => {
  try {
    if (fields) return MProfiles.findOne(conditions).select(fields)
    else return MProfiles.findOne(conditions)
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}

export const Exist = async (key) => {
  try {
    const exist = await MProfiles.findOne({ key: key.toLowerCase() })
    if (exist) return true
    else return false
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}

export const Insert = async (item, createdBy, session?) => {
  try {
    item.created = { at: new Date(), by: createdBy }
    if (item.timezone) {
      if (item.timezone.auto) item.timezone.auto = item.timezone.auto ? true : false
      if (item.timezone.TZ) item.timezone.TZ = item.timezone.TZ ? item.timezone.TZ : ''
    }
    if (item.location) {
      if (item.location.auto) item.location.auto = item.location.auto ? true : false
      if (item.location.latitude) item.location.latitude = parseFloat(item.location.latitude)
      if (item.location.longitude) item.location.longitude = parseFloat(item.location.longitude)
    }
    // item.dateBirth = Moment(item.dateBirth, 'DD/MM/YYYY')
    item.key = item.key.toLowerCase()
    const data = new MProfiles(item)
    data.validateSync()
    if (session) return data.save({ session: session })
    else return data.save()
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}

export const Update = async (item, session?) => {
  try {
    const set = {
      name: item.name,
      // key: item.key,
      browserType: item.browserType,
      browserVersion: item.browserVersion,
      userAgent: item.userAgent,
      proxies: item.proxies,
      // proxyType: item.proxyType,
      // proxyHost: item.proxyHost,
      // proxyPort: item.proxyPort,
      // proxyUsername: item.proxyUsername,
      // proxyPassword: item.proxyPassword,
      location: item.location,
      timezone: item.timezone,
      webRTC: item.webRTC,
      startUrl: item.startUrl,
      extensions: item.extensions,
      accounts: item.accounts,
      desc: item.desc,
      order: item.order
    }
    if (item.timezone) {
      if (item.timezone.auto) item.timezone.auto = item.timezone.auto ? true : false
      if (item.timezone.TZ) item.timezone.TZ = item.timezone.TZ ? item.timezone.TZ : ''
    }
    if (item.location) {
      if (item.location.auto) set.location.auto = item.location.auto ? true : false
      if (item.location.latitude) set.location.latitude = parseFloat(item.location.latitude)
      if (item.location.longitude) set.location.longitude = parseFloat(item.location.longitude)
    }
    if (session) return MProfiles.updateOne({ _id: item._id }, { $set: set }, { session: session })
    else return MProfiles.updateOne({ _id: item._id }, { $set: set })
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}

export const Flag = async (id, session?) => {
  try {
    if (session) {
      const exist = await MProfiles.findById(id).session(session)
      if (exist) return MProfiles.updateOne({ _id: id }, { $set: { flag: exist.flag === 1 ? 0 : 1 } }, { session: session })
      else return null
    } else {
      const exist = await MProfiles.findById(id)
      if (exist) return MProfiles.updateOne({ _id: id }, { $set: { flag: exist.flag === 1 ? 0 : 1 } })
      else return null
    }
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}

export const Delete = async (id, session?) => {
  try {
    if (session) return MProfiles.deleteOne({ _id: id }, { session: session })
    else return MProfiles.deleteOne({ _id: id })
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}
