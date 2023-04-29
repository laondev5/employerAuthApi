const express = require('express')
const Path = require('path')
const router = express.Router()

//first get request
router.get('^/$|index(.html)?', async (req, res)=>{
    try{
        res.sendFile(Path.join(__dirname, '..', 'views', 'index.html'))
    }catch(err){
        console.log(err)
    }
})
router.get('/new-page(.html)?', async (req, res)=>{
    res.sendFile(Path.join(__dirname, '..', 'views', 'new-page.html'))
})
router.get('/old-page(.html)?', async (req, res)=>{
    res.status(301).redirect('new-page.html')
})

module.exports = router