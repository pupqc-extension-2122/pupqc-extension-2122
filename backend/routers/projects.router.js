let router = require('express').Router()
const {
  createProject,
  cancelProposal,
  viewProposal,
  updateProject,
  createProjectActivities,
  listProjectActivities,
  submitProposal,
  datatableDraftProposal
} = require('../controllers/projects.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')

router.use(jwtMiddleWare)

router.get('/draft/datatables', datatableDraftProposal)
router.get('/pending/datatables', datatableDraftProposal)
router.get('/:id/activities', listProjectActivities)
router.get('/:id', viewProposal)
router.post('/create', createProject)
router.post('/:id/activity/create', createProjectActivities)
router.put('/cancel/:id', cancelProposal)
router.put('/submit/:id', submitProposal)
router.put('/:id', updateProject)

module.exports = router