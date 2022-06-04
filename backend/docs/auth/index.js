const login = require('./login')
const logout = require('./logout')

module.exports = {
  paths: {
    '/auth/login': {
      ...login
    },
    'auth/logout': {
      ...logout
    }
  }
}