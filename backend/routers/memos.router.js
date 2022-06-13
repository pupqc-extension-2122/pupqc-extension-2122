let router = require('express').Router()
const {
  viewMemo, dataTableMemo, updateMemo
} = require('../controllers/memos.controller')

const jwtMiddleWare = require('../../utils/jwtMiddleware')

router.use(jwtMiddleWare)

router.get('/:id', viewMemo)
router.get('/datatables', dataTableMemo)
router.put('/:id', updateMemo)

module.exports = router