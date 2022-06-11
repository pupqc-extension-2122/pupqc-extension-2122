let router = require('express').Router()
const {
  createProject, cancelProposal, viewProposal, updateProject
} = require('../controllers/projects.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')

router.use(jwtMiddleWare)

router.get('/:id', viewProposal)
router.post('/create', createProject)
router.put('/cancel/:id', cancelProposal)
router.put('/:id', updateProject)

module.exports = router