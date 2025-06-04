const express = require('express')
const router = express.Router()
const table = require('../../models/table')

router.delete('/', async(req, res) => {
    try {
        const id = req.query.id

        const deleted = await table.destroy({
            where: {
                id
            }
        })

        if(deleted) {
            return res.status(200).json({
                success: true
            })
        } else {
            return res.status(404).json({
                success: false,
                error: "Tisch nicht gefunden"
            })
        }
    } catch(err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: err
        })
    }
})

module.exports = router