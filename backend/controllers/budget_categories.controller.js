const { Budget_Categories } = require('../sequelize/models')

exports.listCategories = async (req, res) => {

  try {
    let data = await Budget_Categories.findAll()

    res.send({
      error: false,
      data
    })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.createCategories = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Admin'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    let body = req.body

    let [data, created] = await Budget_Categories.findOrCreate({
      where: { name: body.name },
      paranoid: false
    })

    if (created)
      res.send({ error: false, message: 'Category Added' })
    else if (data.deletedAt != null) {
      await data.restore()
      res.send({ error: false, message: 'Category Restored' })
    } else
      res.send({ error: true, message: 'This category already exists' })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.updateCategories = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Admin'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const id = req.params.id

    const data = await Budget_Categories.findByPk(id)

    if (!data)
      return res.status(404).send({ error: true, message: 'Category not found' })

    data.name = body.name
    await data.save()

    res.send({ error: false, message: 'Budget Category updated successfully' })


  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.restoreCategories = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Admin'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const id = req.params.id

    let data = await Budget_Categories.findByPk(id, { paranoid: false })

    if (!data)
      return res.status(404).send({ error: true, message: 'Budget Category not found' })

    await data.restore()

    res.send({ error: false, message: 'Budget Category restored' })

  } catch (error) {

  }
}

exports.deleteCategories = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Admin'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const id = req.params.id

    let data = await Budget_Categories.findByPk(id)

    if (!data)
      return res.status(404).send({ error: true, message: 'Budget Category not found' })

    await data.destroy()

    res.send({ error: false, message: 'Budget Category deleted' })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}