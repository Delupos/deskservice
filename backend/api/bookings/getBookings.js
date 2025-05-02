const express = require('express')
const router = express.Router()
const bookings = require('../../models/bookings')

router.get('/', async(req, res) => {
    try {

        const result = await bookings.findAll({
            order: [
                ["startTime", "DESC"]
            ]
        }) 

        res.status(200).json({
            data: result,
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