let router = require('express').Router()
const {
  listOrganizations,
  datatableOrganizations,
  updateOrganizations,
  createOrganizations,
  deleteOrganizations,
  restoreOrganizations,
} = require('../controllers/organizations.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')

router.use(jwtMiddleWare)

router.get('/datatables', datatableOrganizations)
router.get('/', listOrganizations)
router.post('/create', createOrganizations)
router.put('/:id/restore', restoreOrganizations)
router.put('/:id', updateOrganizations)
router.delete('/:id', deleteOrganizations)

module.exports = router