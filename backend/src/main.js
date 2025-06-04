const express = require('express') 
const app = express()
const port = 3001
const db = require('../config/database')
const cors = require('cors')
const { where, Sequelize, Op } = require('sequelize')
const index = require('../api/index')

// DB imports
const user = require('../models/user')
const table = require('../models/table')
const bookings = require('../models/bookings')

// Relations
user.hasMany(bookings, { foreignKey: 'userId', onDelete: 'CASCADE' });
bookings.belongsTo(user, { foreignKey: 'userId' });
table.hasMany(bookings, { foreignKey: 'tableId', onDelete: 'CASCADE' });
bookings.belongsTo(table, { foreignKey: 'tableId' });

app.listen(port, () => { 
    console.log(`Example app listening on port ${port}`) })
    
db.authenticate() 
    .then(() => console.log("database connected")) 
    .catch(err => console.log("Error" + err)) 
db.sync({ alter: true }) 
app.use(cors()) 
let corsOptions = { origin: '*', optionSuccessStatus: 200, 
    methods: ['GET', 'PUT', 'POST', 'DELETE']}
    
app.use(cors(corsOptions))
app.use(express.json({ limit: '50mb'}))
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use("/api", index);