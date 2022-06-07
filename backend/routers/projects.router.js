let router = require('express').Router()
const {
  createProject, cancelProposal
} = require('../controllers/projects.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')

router.use(jwtMiddleWare)

router.post('/create', createProject)
router.put('/cancel/:id', cancelProposal)

module.exports = router