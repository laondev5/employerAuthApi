// list of end point allowed to make request to the api 
const allowedOrigin = require('./allowedOrigin')

const corsOptions = {
    origin: (origin, callBack)=>{
        if(allowedOrigin.indexOf(origin) !== -1 || !origin){
            callBack(null, true)
        }else{
            callBack(new Error('Not allowed by corse'))
        }
    },
    optionSuccessStatus : 200
}

module.exports = corsOptions