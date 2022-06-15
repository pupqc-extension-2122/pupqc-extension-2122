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
  datatableExtensionistProposal,
  submitForReviewProposal
} = require('../controllers/projects.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')

router.use(jwtMiddleWare)

router.get('/approved/datatables', datatableApprovedProposal)
router.get('/datatables', datatableExtensionistProposal)
router.get('/:id/activities', datatableProjectActivities)
router.get('/:id', viewProposal)
router.post('/create', createProject)
router.post('/:id/activity/create', createProjectActivities)
router.put('/cancel/:id', cancelProposal)
router.put('/review/:id', submitForReviewProposal)
router.put('/:id', updateProject)

module.exports = router