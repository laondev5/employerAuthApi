const usersDB = {
    users : require('../model/user.json'),
    setUsers : function (data){this.users = data}
}


const fsPromises = require('fs').promises;
const Path = require('path');

const access = {httpOnly: true, sameSite: 'none', secure: true,}



const handleLogout =async (req, res)=>{
    const cookie = req.cookies
    if(!cookie?.jwt){
        return res.sendStatus(204)
    }
    const refreshToken = cookie.jwt;

    //checking if the refresh token exist
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken)
    if(!foundUser){
        res.clearCookie('jwt', access)
        return res.sendStatus(204)
    }

    //deleting the refresh token
    const otherUser = usersDB.users.filter(person => person.refreshToken !== refreshToken)
    const currentUser = {...foundUser, refreshToken: ''}
    usersDB.setUsers([...otherUser, currentUser])
    await fsPromises.writeFile(
        Path.join(__dirname, '..', 'model', 'user.json'),
        JSON.stringify(usersDB.users)
    )
    res.clearCookie('jwt', access)// add the flag secure: true on development
    res.sendStatus(204)
    
}

module.exports = {handleLogout}