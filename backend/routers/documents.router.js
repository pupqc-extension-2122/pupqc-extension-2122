let router = require('express').Router()
const {
  memoUploads, projectUploads
} = require('../controllers/documents.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')
const { uploadMemoDocument, uploadProjectDocument } = require('../../utils/multerHelper')

router.use(jwtMiddleWare)

router.post('/memo/:id', uploadMemoDocument, memoUploads)
router.post('/project/:id', uploadProjectDocument, projectUploads)

module.exports = router