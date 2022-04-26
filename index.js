const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config()

let app = express()

//* Static Files
app.use('/static', express.static('./static'))

//* Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(cookieParser(process.env.COOKIE_SECRET))


//* View Engine 
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.set('layout', 'layouts/common')
app.set("layout extractScripts", true)
app.set("layout extractStyles", true)
app.set("layout extractMetas", true)

app.get('/', (req,res)=>{
    res.render('content/index')
})

//* Port
let PORT = process.env.PORT || 3000
app.listen(PORT, ()=>console.log('App is running!'))