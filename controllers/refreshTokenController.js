const usersDB = {
    users : require('../model/user.json'),
    setUsers : function (data){this.users = data}
}


require('dotenv').config()
const jwt = require('jsonwebtoken')



process.env.ACCESS_TOKEN_SECRET
process.env.REFRESH_TOKEN_SECRET

const handleRefreshToken = (req, res)=>{
    const cookie = req.cookies
    if(!cookie?.jwt){
        return res.sendStatus(401)
    }
    // console.log(cookie.jwt)
    const refreshToken = cookie.jwt
    //checking i user exist
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken)
    if(!foundUser) return res.sendStatus(403)
    jwt.verify(
       refreshToken,
       process.env.REFRESH_TOKEN_SECRET,
       (err, decoded)=>{
        if(err || foundUser.username !== decoded.username){
            return res.sendStatus(403)
        }
        const roles = Object.values(foundUser.roles)
        const accessToken = jwt.sign(
            {
                "userInfo":{
                    "username" : decoded.username,
                    "roles": roles,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn : '30S'}
        )
        res.json({accessToken})
       } 
    );
}

module.exports = {handleRefreshToken}