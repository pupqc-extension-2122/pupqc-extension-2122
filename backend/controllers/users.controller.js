const ejs = require('ejs')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const { sendMail } = require('../../utils/sendMail.js')
const { Users } = require('../sequelize/models')
const datatable = require('../../utils/datatableResponse')

exports.datatableUsers = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Admin'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const data = await datatable(Users, req.query, { include: ['roles'], attributes: { exclude: ['password'] } })

    res.send(data)

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.viewUser = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Admin'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const id = req.params.id

    const user = await Users.findByPk(id, { attributes: { exclude: ['password'] } })

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
    const code = crypto.randomBytes(8).toString('hex')

    let user = await Users.create({ ...body, verification: { code } }, { include: ['user_roles', 'verification'] })

    let template = await ejs.renderFile(__dirname + '/../emails/temp_password.ejs', {
      url: process.env.BASE_URL,
      email: body.email,
      password: code
    })

    const subject = 'Welcome to PUP-EPMS'

    const text_form = `Good Day!\n\nYou have been added as a user on PUP Extension Project Monitoring App. A temporary password has been generated for you and you will be prompted to change it after your first log in.\n\nUse the following credentials to log in:\nEmail: ${body.email}\nPassword: ${code}\n\nHere is the link for the app ${process.env.BASE_URL}\n\nMake sure to keep your credentials hidden.\n\n-PUP-EPMS Team`

    let message_id = sendMail(body.email, text_form, template, subject)

    if (user && message_id)
      res.send({ error: false, message: 'User has been created successfully', data: code })

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

    const body = req.body

    const user = await Users.findByPk(req.auth.id)

    if (!user)
      return res.status(404).send({ error: true, message: 'User not found' })

    let verify = await user.verify(body.old_password)

    if (!verify)
      return res.status(401).send({ error: true, message: 'Unauthorized' })

    user.password = await bcrypt.hash(body.new_password, 12)
    await user.save()

    res.send({ error: false, message: 'Password has been changed successfully' })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}
