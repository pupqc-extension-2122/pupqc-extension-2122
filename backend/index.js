const express = require('express')
const swaggerUI = require('swagger-ui-express')

let app = express()

// API Routes
app.use('/docs', swaggerUI.serve, swaggerUI.setup(require('./docs')))
app.use('/auth', require('./routers/auth.router'));
app.use('/partners', require('./routers/partners.router'));
app.use('/projects', require('./routers/projects.router'));
app.use('/memos', require('./routers/memos.router'));

module.exports = app