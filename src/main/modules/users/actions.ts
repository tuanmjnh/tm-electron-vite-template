import MUsers from './model'
export const collectionName = MUsers.collection.collectionName
export const Get = (conditions) => {
  try {
    return MUsers.aggregate([
      { $match: conditions },
      {
        $lookup: {
          from: 'tm-actions',
          let: { ext: '$personNumber' },
          as: 'tmActions',
          pipeline: [
            { $addFields: { 'id': { $toString: '$_id' } } },
            { $match: { $expr: { $eq: ['$id', '$$ext'] } } },
            { $project: { _id: 0, title: 1 } }
          ]
        }
      },
      // { $unwind: "$tmActions" } // Change array to object
      // { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$roles', 0] }, '$$ROOT'] } } },
      // { $project: { roles: 0 } }
    ])
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}
export const Select = (conditions, fields) => {
  try {
    if (fields) return MUsers.find(conditions).select(fields)
    else return MUsers.find(conditions)
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}

export const FindOne = (conditions, fields) => {
  try {
    if (fields) return MUsers.findOne(conditions).select(fields)
    else return MUsers.findOne(conditions)
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}

export const Exist = async (username) => {
  try {
    const exist = await MUsers.findOne({ username: new RegExp(username, 'i') })
    if (exist) return true
    else return false
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}

export const Distinct = (field, conditions?) => {
  try {
    if (conditions) return MUsers.distinct(field, conditions)
    else return MUsers.distinct(field)
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}

export const Insert = async (item, createdBy, session?) => {
  try {
    item.created = { at: new Date(), by: createdBy }
    // item.dateBirth = Moment(item.dateBirth, 'DD/MM/YYYY')
    const data = new MUsers(item)
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
    const set = {} as any
    if (item.group !== undefined) set.group = item.group
    if (item.email !== undefined) set.email = item.email
    if (item.fullName !== undefined) set.fullName = item.fullName
    if (item.phone !== undefined) set.phone = item.phone
    // if (item.personNumber !== undefined) set.personNumber = item.personNumber
    if (item.region !== undefined) set.region = item.region
    if (item.avatar !== undefined) set.avatar = item.avatar
    if (item.dateBirth !== undefined) set.dateBirth = item.dateBirth
    if (item.gender !== undefined) set.gender = item.gender
    // if (item.address !== undefined) set.address = item.address
    if (item.roles !== undefined) set.roles = item.roles
    // if (item.note !== undefined) set.note = item.note
    // const set = {
    //   group: item.group,
    //   email: item.email,
    //   fullName: item.fullName,
    //   phone: item.phone,
    //   personNumber: item.personNumber,
    //   region: item.region,
    //   avatar: item.avatar,
    //   dateBirth: item.dateBirth,
    //   gender: item.gender,
    //   address: item.address,
    //   roles: item.roles,
    //   note: item.note
    // }
    // if (!Object.keys(set).length) return 0
    // if (session) return MUsers.updateOne({ _id: item._id }, { $set: set }, { session: session })
    // else return MUsers.updateOne({ _id: item._id }, { $set: set })
    if (session) return MUsers.updateOne({ _id: item._id }, { $set: set }, { session: session })
    else return MUsers.updateOne({ _id: item._id }, { $set: set })
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}

export const Password = async (item, session?) => {
  try {
    if (session) return MUsers.updateOne({ _id: item._id }, { $set: { password: item.password } }, { session: session })
    else return MUsers.updateOne({ _id: item._id }, { $set: { password: item.password } })
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}

export const Verified = async (item, session?) => {
  try {
    if (session) return MUsers.updateOne({ _id: item._id }, { $set: { verified: item.verified === 'true' ? true : false } }, { session: session })
    else return MUsers.updateOne({ _id: item._id }, { $set: { verified: item.verified === 'true' ? true : false } })
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}

export const Flag = async (id, session?) => {
  try {
    if (session) {
      const exist = await MUsers.findById(id).session(session)
      if (exist) return MUsers.updateOne({ _id: id }, { $set: { enable: exist.enable === true ? false : true } }, { session: session })
      else return null
    } else {
      const exist = await MUsers.findById(id)
      if (exist) return MUsers.updateOne({ _id: id }, { $set: { enable: exist.enable === true ? false : true } })
      else return null
    }
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}

export const Delete = async (id, session?) => {
  try {
    if (session) return MUsers.deleteOne({ _id: id }, { session: session })
    else return MUsers.deleteOne({ _id: id })
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}

export const setPersonNumber = async (args, session?) => {
  try {
    if (session) {
      const exist = await MUsers.findById(args.id).session(session)
      if (exist) return MUsers.updateOne({ _id: args.id }, { $set: { personNumber: args.personNumber } }, { session: session })
      else return null
    } else {
      const exist = await MUsers.findById(args.id)
      if (exist) return MUsers.updateOne({ _id: args.id }, { $set: { personNumber: args.personNumber } })
      else return null
    }
  } catch (e) {
    if (e instanceof Error) throw new Error(e.message)
    else throw new Error((e as any).toString())
  }
}
