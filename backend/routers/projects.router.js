let router = require('express').Router()
const {
  createProject, cancelProposal, viewProposal
} = require('../controllers/projects.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')

router.use(jwtMiddleWare)

router.get('/:id', viewProposal)
router.post('/create', createProject)
router.put('/cancel/:id', cancelProposal)

module.exports = router