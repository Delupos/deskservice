const express = require('express');
const router = express.Router();
const table = require('../../models/table');

/**
 * API-Call to create Table
 * @param {req.body.seatId} seatId Id to identify seat
 * @param {req.body.place} place place 
 * @param {req.body.street} street optional
 * @return {json} success/ error
 */
router.post('/', async(req, res) => {
    try {

        const temp = {
            seatId: req.body.seatId,
            place: req.body.place,
            meetingRoom: req.body.meetingRoom
        }

        if(!req.body.place) {
            temp.street = req.body.street;
        }
        
        await table.create(temp)

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