let router = require('express').Router()
const { storeConfig, readConfig } = require('../controllers/activities_evaluation.controller')

const jwtMiddleWare = require('../../utils/jwtMiddleware')

router.use(jwtMiddleWare)

router.get('/read', readConfig)
router.post('/store', storeConfig)

module.exports = router