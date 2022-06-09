let router = require('express').Router()
const {
  createPartner, datatablePartners
} = require('../controllers/partners.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')

// Apply JWT Extraction to all routes
router.use(jwtMiddleWare)

// Routes
router.get('/datatables', datatablePartners)
router.post('/create', createPartner)

module.exports = router