const express = require('express')
const config = require('config')
const routes = require('../routers/index')


const app = express()



app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(config.app.static_folder))
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});




routes(app);



module.exports = app;