const jwt = require('jsonwebtoken')
const { Organizations } = require('../sequelize/models')

exports.listOrganizations = async (req, res) => {

  try {
    let data = await Organizations.findAll()

    res.send({
      error: false,
      data
    })

  } catch (error) {
    console.log(error)
    res.send(error)
  }

}