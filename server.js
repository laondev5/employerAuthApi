const express = require('express')
const Path = require('path')
const dotenv = require('dotenv');
const cors = require('cors')
const {logEvent, logger} = require('./middleware/logEvent')
const errorHandler = require('./middleware/errorHandler')
const corsOptions = require('./config/corsOption')
const verifyJWT = require('./middleware/verifyJwt')
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/credentials')

//initializing express
const app = express()

// calling a custom middleware for the logger
app.use(logger)


// allow origin access
app.use(credentials)
//using the cors third party middleware
app.use(cors(corsOptions))

//initializing dotenv
dotenv.config()
const PORT = process.env.PORT

app.use(cookieParser())

//using built in middleware
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use('/',express.static(Path.join(__dirname, 'public')))
app.use('/subdir',express.static(Path.join(__dirname, 'public')))
app.use('/subdir', require('./routes/subdir'))
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/api/register'))
app.use('/auth', require('./routes/api/auth'))
app.use('/refresh', require('./routes/api/refresh'))
app.use('/logout', require('./routes/api/logout'))

app.use(verifyJWT)
app.use('/employees', require('./routes/api/employees'))



app.all('*', async (req, res)=>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(Path.join(__dirname, 'views', '404.html'))
    }else if(req.accepts('html')){
        res.json({err: '404 not found'})
    }else{
        res.type('text').send('404 not found')
    }
})

 app.use(errorHandler)


//listing for server
app.listen(PORT, async ()=>{
    try{
        console.log(`server running at port ${PORT}`)
    }catch(err){
        console.log(err)
    }
})