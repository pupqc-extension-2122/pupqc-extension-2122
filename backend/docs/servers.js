require('dotenv').config
module.exports = {
  servers: [
    {
      url: process.env.BASE_URL + '/api',
      description: 'Dev Server'
    }
  ]
}