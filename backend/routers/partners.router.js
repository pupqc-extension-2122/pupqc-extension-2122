let router = require('express').Router()
const { 
  createMemo 
} = require('../controllers/partners.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')

// Apply JWT Extraction to all routes
router.use(jwtMiddleWare)

// Routes
router.post('/create', createMemo)

module.exports = router