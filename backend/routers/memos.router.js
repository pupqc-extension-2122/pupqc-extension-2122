let router = require('express').Router()
const {
  viewMemo
} = require('../controllers/memos.controller')

const jwtMiddleWare = require('../../utils/jwtMiddleware')

router.use(jwtMiddleWare)

router.get('/:id', viewMemo)

module.exports = router