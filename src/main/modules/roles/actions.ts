import MRoles from './model'
export const collectionName = MRoles.collection.collectionName
export const Get = (conditions) => {
  try {
    if (conditions) return MRoles.aggregate([{ $match: conditions }])
    else return MRoles.find()
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}
export const Select = (conditions, fields) => {
  try {
    if (fields) return MRoles.where(conditions, fields)
    else return MRoles.where(conditions)
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}

export const FindOne = (conditions, fields?) => {
  try {
    if (fields) return MRoles.findOne(conditions).select(fields)
    else return MRoles.findOne(conditions)
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}

export const Exist = async (key) => {
  try {
    const exist = await MRoles.findOne({ key: key.toUpperCase() })
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
    // item.dateBirth = Moment(item.dateBirth, 'DD/MM/YYYY')
    const data = new MRoles(item)
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
      desc: item.desc,
      level: item.level,
      color: item.color,
      routes: item.routes
    }
    if (session) return MRoles.updateOne({ _id: item._id }, { $set: set }, { session: session })
    else return MRoles.updateOne({ _id: item._id }, { $set: set })
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}

export const Flag = async (id, session?) => {
  try {
    if (session) {
      const exist = await MRoles.findById(id).session(session)
      if (exist) return MRoles.updateOne({ _id: id }, { $set: { flag: exist.flag === 1 ? 0 : 1 } }, { session: session })
      else return null
    } else {
      const exist = await MRoles.findById(id)
      if (exist) return MRoles.updateOne({ _id: id }, { $set: { flag: exist.flag === 1 ? 0 : 1 } })
      else return null
    }
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}

export const Delete = async (id, session?) => {
  try {
    if (session) return MRoles.deleteOne({ _id: id }, { session: session })
    else return MRoles.deleteOne({ _id: id })
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}
