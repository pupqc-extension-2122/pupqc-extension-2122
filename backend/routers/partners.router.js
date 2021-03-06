let router = require('express').Router()
const {
  createPartner, datatablePartners, listPartners, datatableMemos, countPartners, viewPartner
} = require('../controllers/partners.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')
const { uploadMemoDocument } = require('../../utils/multerHelper')

// Apply JWT Extraction to all routes
router.use(jwtMiddleWare)

// Routes
router.get('/datatables', datatablePartners)
router.get('/count', countPartners)
router.get('/:id', viewPartner)
router.get('/:id/memos', datatableMemos)
router.get('/', listPartners)
router.post('/create', uploadMemoDocument, createPartner)

module.exports = router