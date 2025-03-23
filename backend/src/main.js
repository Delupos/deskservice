const express = require('express') 
const app = express()
const port = 3001
const db = require('../config/database')
const cors = require('cors')
const { where, Sequelize, Op } = require('sequelize')

// DB imports
const user = require('../models/user')

app.listen(port, () => { 
    console.log(`Example app listening on port ${port}`) })
    
db.authenticate() 
    .then(() => console.log("database connected")) 
    .catch(err => console.log("Error" + err)) 
db.sync() 
app.use(cors()) 
let corsOptions = { origin: '*', optionSuccessStatus: 200, 
    methods: ['GET', 'PUT', 'POST', 'DELETE']}
    
app.use(cors(corsOptions))
app.use(express.json())
