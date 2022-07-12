const ejs = require('ejs')
const bcrypt = require('bcrypt')
const { sendMail } = require('../../utils/sendMail.js')
const { Users } = require('../sequelize/models')



exports.viewUser = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Admin'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const id = req.params.id

    const user = await Users.findByPk(id)

    if (!user)
      return res.status(404).send({ error: true, message: 'User not found' })

    res.send({ error: false, data: user })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.createUser = async (req, res) => {

  try {

    if (!req.auth.roles.includes('Admin'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const body = req.body

    let user = await Users.create({ ...body }, { include: ['user_roles'] })

    // TODO: IMPLEMENT EMAIL OTP WITH EXPIRATION

    if (user)
      res.send({ error: false, message: 'User has been created successfully' })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.updateUser = async (req, res) => {

  try {

    const id = req.params.id
    const body = req.body

    if (id != req.auth.id && !req.auth.roles.includes('Admin'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const user = await Users.findByPk(id)

    if (!user)
      return res.status(404).send({ error: true, message: 'User not found' })

    const verify = await user.verify(body.password)

    if (!verify)
      return res.status(401).send({ error: true, message: 'Authentication Failed' })

    user.first_name = body.first_name
    user.middle_name = body.middle_name
    user.last_name = body.last_name
    user.suffix_name = body.suffix_name

    await user.save()

    res.send({ error: false, message: 'User updated successfully' })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.deleteUser = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Admin'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const id = req.params.id

    if (id == req.auth.id)
      return res.status(400).send({ error: true, message: 'Bad Request' })

    const user = await Users.findByPk(id)

    if (!user)
      return res.status(404).send({ error: true, message: 'User not found' })

    await user.destroy()

    res.send({ error: false, message: 'User is now inactive' })

  } catch (error) {

  }
}

exports.changePassword = async (req, res) => {
  try {

    const id = req.params.id
    const body = req.body

    const user = await Users.findByPk(id)

    if (!user)
      return res.status(404).send({ error: true, message: 'User not found' })

    let verify = await user.verify(body.old_password)

    if (!verify)
      return res.status(401).send({ error: true, message: 'Unauthorized' })

    user.password = body.new_password
    await user.save()

    res.send({ error: false, message: 'Password has been changed successfully' })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}
