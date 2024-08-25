const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  group: { type: String, default: null },
  title: { type: String, required: true },
  options: { type: Object, required: true },
  order: { type: Number, default: 1 },
  flag: { type: Number, default: 1 },
  created: { type: Object, default: { at: new Date(), by: '' } }
})
export default mongoose.model('tm-actions', schema)
