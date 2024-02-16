const config = require('config')
const app=require('../apps/app.js')
const db=require('../../config/db/connect')

db.connect()

app.listen(port=config.app.port,() => {
    console.log("Server running port "+port);
})