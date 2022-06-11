let router = require('express').Router()
const {
  createProjectActivities
} = require('../controllers/projects.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')

// Apply JWT Extraction to all routes
router.use(jwtMiddleWare)

// Routes
router.post('/create', createProjectActivities)

module.exports = router