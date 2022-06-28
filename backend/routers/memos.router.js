let router = require('express').Router()
const {
  viewMemo, dataTableMemo, updateMemo
} = require('../controllers/memos.controller')

const jwtMiddleWare = require('../../utils/jwtMiddleware')
const { uploadMemoDocument } = require('../../utils/multerHelper')

// router.use(jwtMiddleWare)

router.get('/datatables', dataTableMemo)
router.get('/:id', viewMemo)
router.put('/:id', uploadMemoDocument, updateMemo)

module.exports = router