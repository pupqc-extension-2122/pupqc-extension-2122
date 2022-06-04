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
      'last_name',
      'full_name',
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

      let { id, email, full_name } = user
      let roles = user.Roles.map(el => el.name)
      let data = { id, email, full_name, roles }


      let token = await jwt.sign(JSON.stringify(data), process.env.JWT_SECRET)
      res.cookie('token', token, { httpOnly: true })

      res.send({
        error: false,
        message: 'Login Success!'
      })
    } else {
      res.send({
        error: true,
      })
    }
  }

}

exports.logout = (req, res) => {
  res.set_cookie('token', null, {expires: new Date()})
  res.sent({
    error: false,
    message: 'You are now logged out.'
  })
}