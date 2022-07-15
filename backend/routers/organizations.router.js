let router = require('express').Router()
const {
  listOrganizations,
  datatableOrganizations
} = require('../controllers/organizations.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')

router.use(jwtMiddleWare)

router.get('/datatables', datatableOrganizations)
router.get('/', listOrganizations)

module.exports = router