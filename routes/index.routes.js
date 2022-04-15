const express = require('express')
const { statusCheck, index, sendmailHandler } = require('../controller/index.controller')
const router = express.Router()

router.get('/api/v1/status', statusCheck)

router.get('/', index)

router.post('/send', sendmailHandler)


module.exports = router