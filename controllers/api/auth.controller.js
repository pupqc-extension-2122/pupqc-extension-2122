const jwt = require('jsonwebtoken')
const { Users } = require('../../sequelize/models')

exports.register = async (req, res) => {
  const user = req.body
  try{
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

exports.login = async (req, res) => {
  const user = req.body

  let data = await Users.findOne({
    where: {
      email: user.email
    }
  })

  if (!data) {
    res.send({
      error: true,
      message: 'User not found!'
    })
  } else {
    let verified = data.verify(user.password)
    if (verified){

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