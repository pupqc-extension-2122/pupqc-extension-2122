let router = require('express').Router()
const {
  createProject
} = require('../controllers/projects.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')

router.use(jwtMiddleWare)

router.post('/create', createProject)


module.exports = router