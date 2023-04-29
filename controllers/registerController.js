const usersDB = {
    users : require('../model/user.json'),
    setUsers : function (data){this.users = data}
}
const fsPromises = require('fs').promises
const Path = require('path')
const bcrypt = require('bcrypt')


const handleNewUser = async (req, res)=>{
    const {user, pwd} = req.body
    // console.log(user)
    if(!user || !pwd){
        return res.status(400).json({'message':'username and password is required'})
    }
    //checking for duplicate user
    const duplicate = usersDB.users.find(person => person.username === user)
    if(duplicate){
        return res.sendStatus(409)
    }
    try{
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10)
        //store new user
        const newUser = {
            'username':user,
            'roles':{'user': 2001}, 
            'password':hashedPwd
        }
        // console.log(newUser)
        usersDB.setUsers([...usersDB.users, newUser])
        await fsPromises.writeFile(
            Path.join(__dirname, '..', 'model', 'user.json'),
            JSON.stringify(usersDB.users)
        );
        // console.log(usersDB.users)
        res.status(200).json({'success': `New user ${user} created successfully`})

    }catch(err){
        res.status(500).json({'message': err.message})
    }

}

module.exports = {handleNewUser}