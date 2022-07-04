let router = require('express').Router()
const {
  memoUploads
} = require('../controllers/documents.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')
const { uploadMemoDocument } = require('../../utils/multerHelper')

router.use(jwtMiddleWare)

router.post('/documents/memo/:id', uploadMemoDocument, memoUploads)

module.exports = router