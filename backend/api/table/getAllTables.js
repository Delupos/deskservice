const express = require('express');
const router = express.Router();
const table = require('../../models/table');

router.get('/', async(req, res) => {
    try {
        const result = await table.findAll({
            order: [
                ["id", "ASC"]
            ]
        })

        res.status(200).json({
            data: result,
            success: true
        })
    } catch(err) {
        res.status(500).json({
            success: false,
            error: err
        })
    }
})

module.exports = router