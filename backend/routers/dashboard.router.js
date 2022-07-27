let router = require('express').Router()
const { getCards } = require('../controllers/dashboard.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')

router.use(jwtMiddleWare)

router.get('/cards', getCards)

module.exports = router