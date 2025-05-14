const express = require('express')
const router = express.Router()
const bookings = require('../../models/bookings')
const { where } = require('sequelize')

/**
 * API-Call to delete booking
 * @param {req.body.id} id BookingId
 * @return {json} success/ error
 */
router.delete('/', async(req, res) => {
    try {

        console.log(req.query.id)
        
        await bookings.destroy({
            where: {
                id: req.query.id
            }
        })

        res.status(200).json({
            success: true
        })

    } catch(err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: err
        })
    }
})

module.exports = router