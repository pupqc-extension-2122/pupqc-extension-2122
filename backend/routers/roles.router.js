let router = require('express').Router()

const { listRoles } = require('../controllers/roles.controllers')
const jwtMiddleWare = require('../../utils/jwtMiddleware')

router.use(jwtMiddleWare)

router.get('/', listRoles)

module.exports = router