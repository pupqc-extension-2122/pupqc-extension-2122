let router = require('express').Router()
const {
  createPartner, datatablePartners, listPartners
} = require('../controllers/partners.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')

// Apply JWT Extraction to all routes
router.use(jwtMiddleWare)

// Routes
router.get('/', listPartners)
router.get('/datatables', datatablePartners)
router.post('/create', createPartner)

module.exports = router