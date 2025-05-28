const express = require('express')
const router = express.Router()
const appendixImages = require("../../models/appendixImages")

/** 
 * API-Call to get all appendix images
 * @return {json} success/ error
*/
router.get('/', async(req, res) => {
    try {
        //console.log("Appendix get: ", req.query)
        const result = await appendixImages.findAll({
            order: [["id", "ASC"]],
        })
        //console.log("Found images: ", result);

        let rendered = [];
        for (i in result) {
            let uintArr = new Uint8Array(result[i].image);
            rendered.push({image: "data:image/png;base64,"+ uintArr.reduce((data, byte) => data + String.fromCharCode(byte), ''), id: result[i].id, place: result[i].place});
        }

        setTimeout(() => {
             //console.log("Found appendices: ", rendered);
            res.status(200).json({
                success: true,
                data: rendered
            })
        }, 500)
        
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err
        })
        console.log(err)
    }
})

router.post("/", async(req, res) => {
    try {
        const appendix = await appendixImages.create({
            image: req.body.image,
            place: req.body.place
        })

        res.status(200).json({
            success: appendix ? true : false,
            data: appendix
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err
        })
        console.log(err)
    }
})

router.delete("/", async(req, res) => {
    let id = req.query.id;
    try {
        const appendix = await appendixImages.destroy({
            where: {
                id: id
            }
        })
        res.status(appendix ? 200 : 404).json({
            success: appendix ? true : false
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err,
        })
        console.log(err);
    }
})

module.exports = router
