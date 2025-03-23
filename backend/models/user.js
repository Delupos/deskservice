const sequelize = require('sequelize')
const db = require('../config/database')

const user = db.define('user',
    {
        id: {
            type: sequelize.INTEGER, 
            primaryKey: true, 
            autoIncrement: true,
            unique: true,
            allowNull: false 
        },
        email: {
            type: sequelize.STRING,
            allowNull: false,
            unique: true
        },
        name: {
            type: sequelize.STRING,
            allowNull: false
        },
        surname: {
            type: sequelize.STRING,
            allowNull: false
        },
        hashPsw: {
            type: sequelize.STRING,
            allowNull: false
        },
        lastLogin: {
            type: sequelize.DATE,
            allowNull: false,
            defaultValue: sequelize.NOW
        },
        loginAttemps: {
            type: sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        blocked: {
            type: sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        createdAt:{
            type: sequelize.DATE,
            allowNull: false
        },
        updatedAt:{
            type: sequelize.DATE,
            allowNull: false
        },
    },
    { tableName: 'user'}
)

module.exports = user