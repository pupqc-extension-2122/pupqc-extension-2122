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
  viewProjectActivities,
  updateProjectActivities,
  approveProposal
} = require('../controllers/projects.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')

router.use(jwtMiddleWare)

// * Projects
router.get('/approved/datatables', datatableApprovedProposal)
router.get('/datatables', datatableProposal)
router.put('/:id', updateProject)
router.get('/:id', viewProposal)
router.post('/create', createProject)

// * Activities
router.get('/:project_id/activities/:activity_id', viewProjectActivities)
router.get('/:id/activities', datatableProjectActivities)
router.post('/:id/activities/create', createProjectActivities)
router.put('/:project_id/activities/:activity_id', updateProjectActivities)

// * For submission
router.put('/cancel/:id', cancelProposal)
router.put('/review/:id', submitForReviewProposal)
router.put('/evaluation/:id', submitForEvaluationProposal)
router.put('/approve/:id', approveProposal)

module.exports = router