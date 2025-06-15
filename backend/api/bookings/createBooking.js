const express = require('express')
const router = express.Router()
const user = require('../../models/user')
const table = require('../../models/table')
const bookings = require('../../models/bookings')
const { Op } = require('sequelize');


/**
 * API-Call to create booking
 * @param {req.body.userId} userId FK to booking User
 * @param {req.body.tableId} tableId FK to the booked Table
 * @param {req.body.start} startTime Beginning of booking
 * @param {req.body.end} endTime Ending of Booking 
 * @return {json} success/ error
 */
router.post('/', async(req, res) => {
    try {

        const startTime = convertToDate(req.body.start)
        const endTime = convertToDate(req.body.end)

        const temp = {
            userId: req.body.userId,
            tableId: req.body.tableId,
            startTime: startTime,
            endTime: endTime
        }

        const conflictingBookings = await bookings.findAll({
            where: {
                tableId: req.body.tableId,
                [Op.and]: [
                    { startTime: { [Op.lt]: temp.endTime } },
                    { endTime: { [Op.gt]: temp.startTime } }
                ]
            }
        })

        console.log(conflictingBookings)

        if (conflictingBookings.length > 0) {
            return res.status(409).json({
                success: false,
                error: "Dieser Zeitraum überschneidet sich mit einer bestehenden Buchung."
            })
        }

        await bookings.create(temp)

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

function convertToDate(str) {
    const [datePart, timePart] = str.split(' ');
    const [year, month, day] = datePart.split('/').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);

    return new Date(year, month - 1, day, hour, minute);
}

module.exports = router