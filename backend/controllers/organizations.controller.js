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

exports.updateOrganizations = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Admin'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const id = req.params.id
    const body = req.body

    const data = await Organizations.findByPk(id)

    if (!data)
      return res.statu(404).send({ error: true, message: 'Branch/Campus/College not found' })

    data.name = body.name
    data.type = body.type
    await data.save()

    res.send({ error: false, message: `${data.type} updated successfully` })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}