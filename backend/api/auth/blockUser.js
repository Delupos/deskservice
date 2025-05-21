const express = require('express')
const router = express.Router()
const user = require('../../models/user')

/**
 * API-Call to block/ unblock user
 * @param {req.body.data} email/blocked
 * @return {json} success/ error
 */
router.post('/', async(req, res) => {
    try {

        const email = req.body.email
        const newStatus = req.body.blocked

        await user.update(
            { 
                'blocked': newStatus
            },
            {
                where: {
                    email: email
                }
            }
        )

        res.status(201).json({
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