const express = require('express')
const router = express.Router()
const user = require('../../models/user')

/**
 * API-Call to get all Users for display
 * @return {json} success/ error
 */
router.get('/', async(req, res) => {
    try {

        const result = await user.findAll({
            order: [
                ["id", "ASC"]
            ]
        })

        res.status(200).json({
            data: result,
            success: true
        })

    } catch(err) {
        console.log(err)
        res.status(500).json({
            success: false
        })
    }
})

module.exports = router