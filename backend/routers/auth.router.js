let router = require('express').Router()
const {
  register, login, test, logout
} = require('../controllers/auth.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/test', jwtMiddleWare, test)

module.exports = router