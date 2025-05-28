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
    },
    { tableName: 'appendixImages'}
)

module.exports = appendixImages
