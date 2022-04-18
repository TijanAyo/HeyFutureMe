require('dotenv').config()

const express = require('express')
const app = express()
const ConnectDB = require('./config/db')

app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(__dirname + '/public'))

// Route
const statusCheck = require('./routes/index.routes')
const sendmailHandler= require('./routes/index.routes')

// Use Route
app.use(statusCheck)
app.use(sendmailHandler)

// Connecting DB
ConnectDB()

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>{
    console.log(`Server running on port: ${PORT}`)
})