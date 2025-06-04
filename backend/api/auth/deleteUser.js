const express = require('express');
const router = express.Router();
const user = require('../../models/user');

router.delete('/', async(req, res) => {
    try {

        let id = req.query.id

        await user.destroy({
            where: {
                id: id
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