const jwt = require('jsonwebtoken')
const { Users, Roles } = require('../sequelize/models')

exports.register = async (req, res) => {
  const user = req.body
  try {
    let data = await Users.create(user)

    if (data) {
      res.send({
        error: 'false',
        message: 'Registration Successful!'
      })
    }
  } catch (err) {
    res.send(err)
  }
}

exports.test = (req, res) => {
  res.json(req.auth)
}

exports.login = async (req, res) => {
  const body = req.body

  let user = await Users.findOne({
    where: {
      email: body.email
    },
    attributes: [
      'id',
      'email',
      'first_name',
      'middle_name',
      'last_name',
      'suffix_name',
      'password'
    ],
    include: {
      model: Roles,
      attributes: ['name'],
      through: {
        attributes: []
      }
    }
  })

  if (!user) {
    res.send({
      error: true,
      message: 'User not found!'
    })
  } else {
    let verified = user.verify(body.password)
    if (verified) {

      let { id, email, first_name, middle_name, last_name, suffix_name } = user
      let roles = user.Roles.map(el => el.name)
      let data = { id, email, first_name, middle_name, last_name, suffix_name, roles }
      let expiresIn
      let expires

      if (body.remember) {
        expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 5)
        expiresIn = '5y'
      } else {
        expiresIn = '7h'
        expires = new Date(Date.now() + 1000 * 60 * 60 * 7)
      }

      let token = await jwt.sign(data, process.env.JWT_SECRET, { expiresIn })
      res.cookie('token', token, { httpOnly: true, signed: true, expires })
      res.cookie('user', data.id)
      res.cookie('roles', JSON.stringify(roles))

      res.send({
        error: false,
        message: 'Login Success!',
        data: { id, email, first_name, middle_name, last_name, suffix_name }
      })
    } else {
      res.send({
        error: true,
      })
    }
  }

}

exports.logout = (req, res) => {
  res.cookie('token', null, { expires: new Date() })
  res.cookie('user', null)
  res.cookie('roles', null)
  res.send({
    error: false,
    message: 'You are now logged out.'
  })
}