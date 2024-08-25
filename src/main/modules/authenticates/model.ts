const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  remember: { type: Boolean, default: false }
})
export default mongoose.model('authenticates', schema)
