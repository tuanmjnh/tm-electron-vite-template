import MTMActions from './model'
export const collectionName = MTMActions.collection.collectionName
export const Get = (conditions) => {
  try {
    if (conditions) return MTMActions.aggregate([{ $match: conditions }])
    else return MTMActions.find()
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}
export const Select = (conditions, fields) => {
  try {
    if (fields) return MTMActions.where(conditions, fields)
    else return MTMActions.where(conditions)
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}

export const FindOne = (conditions, fields?) => {
  try {
    if (fields) return MTMActions.findOne(conditions).select(fields)
    else return MTMActions.findOne(conditions)
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}

export const Exist = async (key) => {
  try {
    const exist = await MTMActions.findOne({ key: key.toUpperCase() })
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
    const data = new MTMActions(item)
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
      title: item.title,
      order: item.order
    }
    if (session) return MTMActions.updateOne({ _id: item._id }, { $set: set }, { session: session })
    else return MTMActions.updateOne({ _id: item._id }, { $set: set })
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}

export const Flag = async (id, session?) => {
  try {
    if (session) {
      const exist = await MTMActions.findById(id).session(session)
      if (exist) return MTMActions.updateOne({ _id: id }, { $set: { flag: exist.flag === 1 ? 0 : 1 } }, { session: session })
      else return null
    } else {
      const exist = await MTMActions.findById(id)
      if (exist) return MTMActions.updateOne({ _id: id }, { $set: { flag: exist.flag === 1 ? 0 : 1 } })
      else return null
    }
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}

export const Delete = async (id, session?) => {
  try {
    if (session) return MTMActions.deleteOne({ _id: id }, { session: session })
    else return MTMActions.deleteOne({ _id: id })
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}
