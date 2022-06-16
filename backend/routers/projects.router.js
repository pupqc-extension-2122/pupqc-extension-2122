let router = require('express').Router()
const {
  createProject,
  cancelProposal,
  viewProposal,
  updateProject,
  createProjectActivities,
  submitForReviewProposal,
  datatableApprovedProposal,
  datatableProjectActivities,
  submitForEvaluationProposal,
  datatableProposal,
  viewProjectActivities
} = require('../controllers/projects.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')

router.use(jwtMiddleWare)

router.get('/approved/datatables', datatableApprovedProposal)
router.get('/datatables', datatableProposal)
router.get('/:project_id/activities/:activity_id', viewProjectActivities)
router.get('/:id/activities', datatableProjectActivities)
router.get('/:id', viewProposal)
router.post('/create', createProject)
router.post('/:id/activities/create', createProjectActivities)
router.put('/cancel/:id', cancelProposal)
router.put('/review/:id', submitForReviewProposal)
router.put('/evaluation/:id', submitForEvaluationProposal)
router.put('/:id', updateProject)

module.exports = router