const express = require('express')
const router = express.Router()
const bookings = require('../../models/bookings')
const { Op } = require('sequelize')
const { DateTime } = require('luxon')

router.post('/', async (req, res, next) => {
  try {
    const tableId = req.body.tableId
    const startTime = DateTime
    .fromISO(req.body.startTime, { setZone: true })
    .toJSDate()
  
  const endTime = DateTime
    .fromISO(req.body.endTime,   { setZone: true })
    .toJSDate()

    console.log(typeof tableId)
    if (typeof tableId !== 'number' || !startTime || !endTime) {
      return res.status(400).json({ error: 'tableId (Number), startTime und endTime (ISO-Strings) sind erforderlich.' })
    }

    const conflict = await bookings.findOne({
      where: {
        tableId,
        [Op.and]: [
          { startTime: { [Op.lt]: endTime   } },
          { endTime:   { [Op.gt]: startTime } }
        ]
      }
    })

    const isFree = !conflict

    return res.status(200).json({ 
      tableId, 
      isFree,
      data: conflict
    })
  }
  catch (err) {
    next(err)
  }
})

module.exports = router