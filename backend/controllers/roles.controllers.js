const { Roles } = require('../sequelize/models')

exports.listRoles = async (req, res) => {

  try {
    let data = await Roles.findAll()

    res.send({
      error: false,
      data
    })

  } catch (error) {
    console.log(error)
    res.send(error)
  }

}