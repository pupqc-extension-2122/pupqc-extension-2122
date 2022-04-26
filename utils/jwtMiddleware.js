const expressjwt = require('express-jwt')

const jwtMiddleware = expressjwt({
    secret: process.env.JWT_SECRET,
    getToken: req => req.cookies.token,
    algorithms: ['HS256']
})

module.exports = jwtMiddleware
