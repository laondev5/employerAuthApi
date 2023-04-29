// core node modules
const http = require('http')
const Fs = require('fs') 
const Path = require('path')
const fsPromises = require('fs').promises
const eventEmitter = require('events');

//third party module
const dotenv = require('dotenv')

//initializing dotenv
dotenv.config()

const PORT = process.env.PORT || 6001

const serveFile = async (filePath, contentType, response)=>{
    try{
        const rawData = await fsPromises.readFile(
            filePath,
            !contentType.includes('image') ? 'utf8' : ''
             )
        const data = contentType === 'application/json'
            ? JSON.parse(rawData)
            : rawData
        response.writeHead(
            contentType.includes('404.html') ? 404 :200, 
            {'content-type': contentType})
        response.end(
            contentType === 'application/json'
                ? JSON.stringify(data)
                : data
        )
    }catch(err){
        console.log(err)
        response.statusCode = 500;
        myEvent.emit('log', `${err.name}: ${err.message}`, 'errorLog')
        response.end

    }
}

//custom modules
const logEvent = require('./middleware/logEvent')


// initializing the emit module
class Emitter extends eventEmitter {}
const myEvent = new Emitter()
myEvent.on('log', (msg, fileName)=>{
    logEvent(msg, fileName)
})




const server = http.createServer((req ,res)=>{
    console.log(req.url, req.method)
    myEvent.emit('log', `${req.url}\t${req.method}`, 'reqLog')
    const extension = Path.extname(req.url)

    switch(extension){
        case'.css':
            contentType = 'text/css';
            break;
        case'.js':
            contentType = 'text/javascript';
            break;
        case'.json':
            contentType = 'application/json';
            break;
        case'.jpeg':
            contentType = 'image/jpeg';
            break; 
        case'.jpg':
            contentType = 'image/jpg';
            break; 
        case'.png':
            contentType = 'image/png';
            break; 
        case'.txt':
            contentType = 'text/plain';
            break; 
        default:
            contentType = 'text/html';
            
    }

    let filePath =
        contentType === 'text/html' && req.url === '/'
        ? Path.join(__dirname, 'views', 'index.html')
        : contentType === 'text/html' && req.url.slice(-1) === '/'
            ? Path.join(__dirname, 'views', req.url, 'index.html')
            : contentType === 'text/html'
            ? Path.join(__dirname, 'views', req.url)
            : Path.join(__dirname,  req.url)

    //allowing a file with out an extension
    if(!extension && req.url.slice(-1) !=='/') filePath += '.html'  
    
    const fileExist = Fs.existsSync(filePath)

    if(fileExist){
        // take an action
        serveFile(filePath, contentType, res)
    }else{
        //404
        //301
        // console.log(Path.parse(filePath))
        switch(Path.parse(filePath).base){
            case 'old-page.htnl':
                res.writeHead(301, {'Location': '/new-page.html'});
                res.end()
                break;
            case 'www-page.htnl':
                res.writeHead(301, {'Location': '/'});
                res.end()
                break;
            default:
                serveFile(Path.join(__dirname, 'views', '404.html'), 'text/html', res)
        }
    }
})

server.listen(PORT, async ()=>{
    try{
        await console.log(`server running on ${PORT}`)
    }catch(err){
        console.log(err)
    }
})

