const sequelize = require('sequelize')
const db = require('../config/database')

const appendixImages = db.define('appendixImages',
    {
        id: {
            type: sequelize.INTEGER, 
            primaryKey: true, 
            autoIncrement: true,
            unique: true,
            allowNull: false 
        },
        image: {
          type: sequelize.BLOB,
          allowNull: false
        },
        createdAt:{
            type: sequelize.DATE,
            allowNull: false
        },
        updatedAt:{
            type: sequelize.DATE,
            allowNull: false
        },
        place: {
            type: sequelize.STRING,
            allowNull: false,
            defaultValue: 'Duesseldorf',
        }
    },
    { tableName: 'appendixImages'}
)

module.exports = appendixImages
