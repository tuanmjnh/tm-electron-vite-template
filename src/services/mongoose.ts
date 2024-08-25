const mongoose = require('mongoose')
// console.log(import.meta.env.MAIN_VITE_MONGODB)
// mongoose initialize
export const initialize = function () {
  const opts = {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    retryWrites: false,
    // replSet: { readPreference: 'ReadPreference.NEAREST' }
  }
  mongoose.connect(import.meta.env.MAIN_VITE_MONGODB).then(
    () => { console.log('Database connection is successful') },
    err => { console.log(`Error when connecting to the database ${err}`) }
  )
}
//  rs.initiate()
// const MongoClient = require('mongodb').MongoClient;
// const client = new MongoClient(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
// client.connect(() => {
//   client.close()
// })
// console.log(client)

// mongoose.set('debug', (coll, method, query, doc, options) => {
//   console.log(`${coll}.${method}`, JSON.stringify(query), doc, options);
// })
