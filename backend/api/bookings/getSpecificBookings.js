const express = require('express')
const router = express.Router()
const bookings = require('../../models/bookings')
const tables = require('../../models/table')
const { Op } = require('sequelize')

router.post('/', async (req, res) => {
    try {
        const result = await bookings.findAll({
            where: {
                userId: req.body.id,
                endTime: {
                    [Op.gt]: new Date()
                }
            },
            include: [
                {
                    model: tables,
                    required: true
                }
            ],
            order: [
                ["startTime", "DESC"]
            ]
        })

        if (result.length === 0) {
            res.status(404).json({
                success: false,
                data: "No Data was found"
            })
        } else {
            res.status(200).json({
                success: true,
                data: result
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: err
        })
    }
})

module.exports = router
