const usersDB = {
    users : require('../model/user.json'),
    setUsers : function (data){this.users = data}
}

const bcrypt = require('bcrypt')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const fsPromises = require('fs').promises
const Path = require('path')


process.env.ACCESS_TOKEN_SECRET
process.env.REFRESH_TOKEN_SECRET

const handleLogin = async (req, res)=>{
    const {user, pwd} = req.body
    console.log(user)
    if(!user || !pwd){
        return res.status(400).json({'message':'username and password is required'})
    }
    //checking i user exist
    const foundUser = usersDB.users.find(person => person.username === user)
    if(!foundUser) return res.status(401).json({'message':'username does not exist'})
    const match = await bcrypt.compare(pwd, foundUser.password)
    if(match){
        // create refresh and access token
        const roles = Object.values(foundUser.roles)
        console.log(roles)
        const accessToken = jwt.sign(
            {
                'userInfo':{
                    'username': foundUser.username,
                    'roles':roles,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn : '30s'}

        )
        const refreshToken = jwt.sign(
            {'username': foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn : '1d'}

        )
        // saving current user with refresh token
        const otherUser = usersDB.users.filter(person => person.username !== foundUser.username)
        const currentUser = {...foundUser, refreshToken}
        usersDB.setUsers([...otherUser, currentUser])
        await fsPromises.writeFile(
            Path.join(__dirname, '..', 'model', 'user.json'),
            JSON.stringify(usersDB.users)
        );
        res.cookie('jwt', refreshToken, {httpOnly : true, sameSite: 'none', secure: true, maxAge: 24*60*60*1000})
        res.json({accessToken})
    }else{
        res.status(401).json({'message':'username or password does not exist'}) 
    }

}

module.exports = {handleLogin}