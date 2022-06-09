let router = require('express').Router()
const {
  viewMemo, dataTableMemo
} = require('../controllers/memos.controller')

const jwtMiddleWare = require('../../utils/jwtMiddleware')

router.use(jwtMiddleWare)

router.get('/:id', viewMemo)
router.get('/datatables/:id', dataTableMemo)

module.exports = router