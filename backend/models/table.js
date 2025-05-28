const sequelize = require('sequelize')
const db = require('../config/database')

const table = db.define('table', 
    {
        id: {
            type: sequelize.INTEGER, 
            primaryKey: true, 
            autoIncrement: true,
            unique: true,
            allowNull: false
        },
        seatId: {
            type: sequelize.STRING,
            unique: true,
            allowNull: false,
        },
        place: {
            type: sequelize.STRING,
            allowNull: false,
        },
        street: {
            type: sequelize.STRING,
            allowNull: true
        },
        meetingRoom: {
            type: sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        seats: {
            type: sequelize.INTEGER,
            allowNull: true,
            defaultValue: null,
        }
    }, 
    { tableName: 'table'}
)

module.exports = table