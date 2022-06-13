let router = require('express').Router()
const {
  listOrganizations
} = require('../controllers/organizations.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')

router.use(jwtMiddleWare)

router.get('/', listOrganizations)

module.exports = router