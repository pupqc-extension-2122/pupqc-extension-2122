const express = require('express')
const swaggerUI = require('swagger-ui-express')

let app = express()

// API Routes
app.use('/docs', swaggerUI.serve, swaggerUI.setup(require('./docs')))
app.use('/auth', require('./routers/auth.router'));
app.use('/partners', require('./routers/partners.router'));
app.use('/projects', require('./routers/projects.router'));
app.use('/memos', require('./routers/memos.router'));
app.use('/organizations', require('./routers/organizations.router'))
app.use('/documents', require('./routers/documents.router'))
app.use('/users', require('./routers/users.router'))
app.use('/roles', require('./routers/roles.router'))
app.use('/budget_categories', require('./routers/budget_categories.router'))
app.use('/dashboard', require('./routers/dashboard.router'))

module.exports = app