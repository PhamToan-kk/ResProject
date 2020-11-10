const url = process.env.MONGODB_URI
const dbName = process.env.DB_NAME
const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false);

const DATABASE_CONNECT_OPTION = {
    dbName:dbName,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
}
const connectMongo = mongoose.
connect(url, DATABASE_CONNECT_OPTION)
    .then(() => {
        console.log(' connect mongodb  successful !')
    })
    .catch((err) => {
        console.log(err)
    })

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to db')
})

mongoose.connection.on('error', (err) => {
    console.log(err.message)
})

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected.')
})

process.on('SIGINT', async () => {
    await mongoose.connection.close()
    process.exit(0)
  })
  