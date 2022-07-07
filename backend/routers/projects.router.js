let router = require('express').Router()
const {
  createProject,
  cancelProposal,
  requestForRevision,
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
  approveProposal,
  addComment,
  editComment,
  deleteComment,
  evaluateProposal,
  evaluateActivity
} = require('../controllers/projects.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')
const { uploadProjectDocument } = require('../../utils/multerHelper')

router.use(jwtMiddleWare)

// * Projects
router.get('/approved/datatables', datatableApprovedProposal)
router.get('/datatables', datatableProposal)
router.get('/:id', viewProposal)
router.post('/create', uploadProjectDocument, createProject)
router.put('/:id', updateProject)

// * Activities
router.get('/:project_id/activities/:activity_id', viewProjectActivities)
router.get('/:id/activities', datatableProjectActivities)
router.post('/:id/activities/create', createProjectActivities)
router.put('/:project_id/activities/:activity_id', updateProjectActivities)

// * For submission
router.put('/cancel/:id', cancelProposal)
router.put('/revise/:id', requestForRevision)
router.put('/review/:id', submitForReviewProposal)
router.put('/evaluation/:id', submitForEvaluationProposal)
router.put('/approve/:id', approveProposal)


// * For comments
router.post('/:project_id/comments/add', addComment)
router.put('/:project_id/comments/:comment_id', editComment)
router.delete('/:project_id/comments/:comment_id', deleteComment)

// * For evaluations
router.post('/:project_id/evaluate', evaluateProposal)
router.post('/:project_id/activities/:activity_id/evaluate', evaluateActivity)
module.exports = router