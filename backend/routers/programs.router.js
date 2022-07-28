let router = require('express').Router()
const {
  listPrograms,
  datatablePrograms,
  updatePrograms,
  createPrograms,
  deletePrograms,
  restorePrograms,
} = require('../controllers/programs.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')

router.use(jwtMiddleWare)

router.get('/datatables', datatablePrograms)
router.get('/', listPrograms)
router.post('/create', createPrograms)
router.put('/:id/restore', restorePrograms)
router.put('/:id', updatePrograms)
router.delete('/:id', deletePrograms)

module.exports = router