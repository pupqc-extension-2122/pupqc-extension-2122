const express = require('express')

let app = express()

// API Routes
app.use('/auth', require('./routers/auth.router'));

module.exports = app