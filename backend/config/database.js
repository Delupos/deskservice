const sequelize = require('sequelize')
const db = new sequelize('deskservice', 'postgres', 'postgres', 
    {
        host: 'localhost',
        dialect: 'postgres'
    })

module.exports = db
