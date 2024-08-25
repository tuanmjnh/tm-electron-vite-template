const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  key: { type: String, default: null },
  title: { type: String, required: true },
  order: { type: Number, default: 1 },
  flag: { type: Number, default: 1 },
  created: { type: Object, default: { at: new Date(), by: '' } }
})
export default mongoose.model('groups', schema)
