const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  _id: { type: String, default: null },
  group: { type: String, default: null },
  username: { type: String, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  deviceId: { type: String, required: true },
  fullName: { type: String, default: null },
  email: { type: String, required: true },
  phone: { type: String, default: null },
  personNumber: { type: String, default: null },
  region: { type: String, default: 'vi-vn' },
  avatar: { type: Array, default: null },
  note: { type: String, default: null },
  dateBirth: { type: Date, default: null },
  gender: { type: String, default: null },
  address: { type: String, default: null },
  roles: { type: String, default: null },
  verified: { type: Boolean, default: false },
  enable: { type: Boolean, default: true },
  lastLogin: { type: Date, default: null },
  lastChangePass: { type: Date, default: null },
  created: { type: Object, default: { at: new Date(), by: '', ip: '' } },
  createdAt: { type: Date, default: new Date() },
  createdBy: { type: String, default: null }
})
export default mongoose.model('users', schema)
