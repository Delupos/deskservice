const jwt = require('jsonwebtoken')
// const jwt_token = process.env.JWT_TOKEN
const jwt_token = "DasIstEinGeheimnis"

module.exports = function(req, res, next){
    const authHeader = req.headers.authorization
    if(!authHeader) {
        return res.status(401).json({
            success: false,
            error: "Token not found"
        })
    }
    
    try {
        const token = jwt.verify(authHeader, jwt_token)
        next()
    } catch(err) {
        console.log(err)
        return res.status(403).json({
            success: false,
            error: "Token is invalid"
        })
    }
}
