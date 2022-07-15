let router = require('express').Router()
const {
  listOrganizations,
  datatableOrganizations,
  updateOrganizations,
} = require('../controllers/organizations.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')

router.use(jwtMiddleWare)

router.get('/datatables', datatableOrganizations)
router.get('/', listOrganizations)
router.put('/:id', updateOrganizations)

module.exports = router