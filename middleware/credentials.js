const allowedOrigin = require('../config/allowedOrigin')


const credentials = (req, res, next)=>{
    const origin = req.header.origin;
    if(allowedOrigin.includes(origin)){
        res.herder('Access-Control-Allow-Credentials', true)   
    }
    next()
}

module.exports = credentials