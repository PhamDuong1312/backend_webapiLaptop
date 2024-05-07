const express = require('express')
const config = require('config')
const routes = require('../routers/index')
const GoogleLogin=require('./controllers/social/GoogleController');
const FacebookLogin=require('./controllers/social/FacebookController')

const app = express()

//set template engine
app.set("views",config.app.view_folder)
app.set("view engine",config.app.view_engine)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(config.app.static_folder))
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
GoogleLogin()
FacebookLogin()




routes(app);



module.exports = app;