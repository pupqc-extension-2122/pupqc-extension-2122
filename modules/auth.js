const express = require('express')

let app = express()

app.use('/', require('../routers/api/auth.router.js'))

module.exports = app