let router = require('express').Router()
const {
  createProject, cancelProposal, viewProposal, updateProject, createProjectActivities, listProjectActivities
} = require('../controllers/projects.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')

router.use(jwtMiddleWare)

router.get('/:id', viewProposal)
router.get('/:id/activities', listProjectActivities)
router.post('/:id/activity/create', createProjectActivities)
router.post('/create', createProject)
router.put('/cancel/:id', cancelProposal)
router.put('/:id', updateProject)

module.exports = router