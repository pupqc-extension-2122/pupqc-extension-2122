const { Organizations } = require('../sequelize/models')
const datatable = require('../../utils/datatableResponse')

exports.datatableOrganizations = async (req, res) => {
  if (!req.auth.roles.includes('Admin'))
    return res.status(403).send({ error: true, message: 'Forbidden Action' })

  let data = await datatable(Organizations, req.query, { paranoid: false })

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

exports.createOrganizations = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Admin'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const body = req.body

    let [data, created] = await Organizations.findOrCreate({
      where: { name: body.name },
      paranoid: false,
      defaults: { type: body.type }
    })

    if (created)
      res.send({ error: false, message: `${data.type} created successfully` })
    else
      res.send({ error: true, message: `Duplicate ${body.type}` })

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

exports.restoreOrganizations = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Admin'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const id = req.params.id

    let data = await Organizations.findByPk(id, { paranoid: false })

    if (!data)
      return res.status(404).send({ error: true, message: 'Record not found' })

    await data.restore()

    res.send({ error: false, message: 'Record restored successfully' })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.deleteOrganizations = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Admin'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const id = req.params.id

    let data = await Organizations.findByPk(id)

    if (!data)
      return res.status(404).send({ error: true, message: 'Record not found' })

    await data.destroy()

    res.send({ error: false, message: 'Record deleted successfully' })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}
