const express = require('express')
const swaggerUI = require('swagger-ui-express')

let app = express()

// API Routes
app.use('/docs', swaggerUI.serve, swaggerUI.setup(require('./docs')))
app.use('/auth', require('./routers/auth.router'));

module.exports = app