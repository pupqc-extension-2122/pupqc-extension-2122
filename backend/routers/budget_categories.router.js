let router = require('express').Router()
const {
  listCategories,
  createCategories,
  updateCategories,
  restoreCategories,
  deleteCategories,
  datatableCategories
} = require('../controllers/budget_categories.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')

router.use(jwtMiddleWare)

router.get('/datatables', datatableCategories)
router.get('/', listCategories)
router.post('/create', createCategories)
router.put('/:id/restore', restoreCategories)
router.put('/:id', updateCategories)
router.delete('/:id', deleteCategories)

module.exports = router