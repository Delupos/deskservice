const sequelize = require('sequelize')
const db = require('../config/database')

const bookings = db.define('bookings', 
    {
        id: {
            type: sequelize.INTEGER, 
            primaryKey: true, 
            autoIncrement: true,
            unique: true,
            allowNull: false 
        },
        userId: {
            type: sequelize.INTEGER,
            allowNull: false
        },
        tableId: {
            type: sequelize.INTEGER,
            allowNull: false
        },
        startTime: {
            type: sequelize.DATE,
            allowNull: false,
        },
        endTime: {
            type: sequelize.DATE,
            allowNull: false
        },
    }
)

module.exports = bookings