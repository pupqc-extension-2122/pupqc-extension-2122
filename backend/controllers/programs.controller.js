const { Programs } = require('../sequelize/models')
const { datatable } = require('../../utils/datatableResponse')

exports.datatablePrograms = async (req, res) => {
  try {

    let data = await datatable(Progrmas, req.query, { paranoid: false })

    res.send(data)

  } catch (error) {

  }
}

exports.listPrograms = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Admin'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    let programs = await Programs.findAll()

    res.send({
      error: false,
      data: programs
    })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.createPrograms = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Admin'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const body = req.body

    let [data, created] = await Programs.findOrCreate({
      where: { short_name: body.short_name },
      paranoid: false,
      defaults: { full_name: body.full_name }
    })

    if (created)
      res.send({ error: false, message: `Program created successfully` })
    else
      res.send({ error: true, message: `Duplicate Program` })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.updatePrograms = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Admin'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const id = req.params.id
    const body = req.body

    const data = await Programs.findByPk(id)

    if (!data)
      return res.statu(404).send({ error: true, message: 'Program not found' })

    data.full_name = body.full_name
    data.short_name = body.short_name
    await data.save()

    res.send({ error: false, message: `Program updated successfully` })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.restorePrograms = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Admin'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const id = req.params.id

    let data = await Programs.findByPk(id, { paranoid: false })

    if (!data)
      return res.status(404).send({ error: true, message: 'Program not found' })

    await data.restore()

    res.send({ error: false, message: 'Program restored successfully' })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.deletePrograms = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Admin'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const id = req.params.id

    let data = await Programs.findByPk(id)

    if (!data)
      return res.status(404).send({ error: true, message: 'Program not found' })

    await data.destroy()

    res.send({ error: false, message: 'Program deleted successfully' })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}