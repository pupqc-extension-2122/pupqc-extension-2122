let router = require('express').Router()
const {
  memoUploads, projectUploads, deleteUploads, datatableMemoUploads
} = require('../controllers/documents.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')
const { uploadMemoDocument, uploadProjectDocument } = require('../../utils/multerHelper')

router.use(jwtMiddleWare)

router.get('/memo/:id/datatables', datatableMemoUploads)
router.post('/memo/:id', uploadMemoDocument, memoUploads)
router.post('/project/:id', uploadProjectDocument, projectUploads)
router.delete('/:id', deleteUploads)

module.exports = router