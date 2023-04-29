//core node module
const fs = require('fs');
const fsPromises = require('fs').promises;
const Path = require('path')

//third party module
const { format } = require('date-fns');
const {v4:uuid} = require('uuid');

const logEvent = async (message, fileName) =>{
    const date = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${date}\t${uuid()}\t${message}\n`
    // console.log(logItem)
    //text
    try{ 
        if(!fs.existsSync(Path.join(__dirname, '..', 'logs'))){
            await fsPromises.mkdir(Path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(Path.join(__dirname, '..', 'logs', fileName), logItem)
    }catch(err){
        console.error(err)
    }
}

const logger = (req, res, next)=>{
    logEvent(`${req.method}\t${req.header.origin}\t${req.url}`, 'reqLog.txt')
    console.log(`${req.method}\t${req.url}`)
    next()
}

module.exports = {logEvent, logger}