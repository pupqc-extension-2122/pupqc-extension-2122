const { Organizations } = require('../sequelize/models')
const datatable = require('../../utils/datatableResponse')

exports.datatableOrganizations = async (req, res) => {
  if (!req.auth.roles.includes('Admin'))
    return res.status(403).send({ error: true, message: 'Forbidden Action' })

  let data = await datatable(Organizations, req.query, {})

  res.send(data)
}

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

