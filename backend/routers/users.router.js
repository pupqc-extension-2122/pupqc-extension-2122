let router = require('express').Router()
const {
  viewUser, createUser, updateUser, deleteUser, changePassword
} = require('../controllers/users.controller')
const jwtMiddleWare = require('../../utils/jwtMiddleware')

router.use(jwtMiddleWare)

router.get('/:id', viewUser)
router.post('/create', createUser)
router.put('/change_password', changePassword)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

module.exports = router