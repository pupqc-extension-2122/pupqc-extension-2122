let router = require('express').Router()
const {
  createPartner, datatablePartners, listPartners, datatableMemos
} = require('../controllers/partners.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')

// Apply JWT Extraction to all routes
router.use(jwtMiddleWare)

// Routes
router.get('/:id/memos', datatableMemos)
router.get('/datatables', datatablePartners)
router.get('/', listPartners)
router.post('/create', createPartner)

module.exports = router