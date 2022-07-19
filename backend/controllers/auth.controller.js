require('dotenv').config()
const crypto = require('crypto')
const ejs = require('ejs')
const jwt = require('jsonwebtoken')
const { sendMail } = require('../../utils/sendMail.js')
const { User_Verifications, Users, Roles } = require('../sequelize/models')

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
  let verification
  let verified = false
  let match = false

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
      'password',
      'verified'
    ],
    include: {
      model: Roles,
      as: 'roles',
      attributes: ['name'],
      through: {
        attributes: []
      }
    }
  })

  if (!user) return res.send({ error: true, message: 'User not found!' })

  else if (!user.verified) {
    verification = await User_Verifications.findOne({ where: { user_id: user.id } })
    verified = verification.verify(body.password)
  }

  else
    match = user.verify(body.password)


  if (match || verified) {

    let { id, email, first_name, middle_name, last_name, suffix_name } = user
    let roles = user.roles.map(el => el.name)
    let data = { id, email, first_name, middle_name, last_name, suffix_name, roles }
    let expiresIn
    let expires

    if (verified) {
      user.verified = true
      await user.save()

      verification.is_used = true
      await verification.save()
    }

    if (body.remember) {
      expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 5)
      expiresIn = '5y'
    } else {
      expiresIn = '7h'
      expires = new Date(Date.now() + 1000 * 60 * 60 * 7)
    }

    let token = await jwt.sign(data, process.env.JWT_SECRET, { expiresIn })
    res.cookie('token', token, { httpOnly: true, signed: true, expires })
    res.cookie('user', data.id, { expires })
    res.cookie('roles', JSON.stringify(roles), { expires })
    res.cookie('verified', Number(!verified), { expires })
    res.cookie('from_magic', 0, { expires })

    return res.send({
      error: false,
      message: 'Login Success!',
      data
    })
  }

  res.send({ error: true, message: 'Authentication failed' })

}


exports.logout = (req, res) => {
  res.clearCookie('token')
  res.clearCookie('user')
  res.clearCookie('roles')
  res.clearCookie('verified')
  res.clearCookie('from_magic')
  res.send({
    error: false,
    message: 'You are now logged out.'
  })
}

exports.sendMagic = async (req, res) => {
  const body = req.body

  let user = await Users.findOne({ where: { email: body.email } })

  if (!user || !user.verified)
    res.status(404).send({ error: true, message: 'User not found' })

  let data = JSON.stringify({
    email: body.email,
    expires: new Date(Date.now() + 1000 * 60 * 5)
  })

  let info = encrypt(data)

  magic_link = `${process.env.BASE_URL}/api/auth/magic?token=${info.encryptedData}&iv=${info.iv}&authTag=${info.authTag}`
  browser = req.get('User-Agent')
  date = new Date().toLocaleDateString('default', { month: 'long', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  const template = await ejs.renderFile(__dirname + '/../emails/magic_link.ejs', {
    magic_link,
    browser,
    date,
    email: user.email
  })

  const text_form = `We have received a request for a magic link. Go to the link below to log in to your account.\n\n${magic_link}\n\nThis log in was requested using ${browser} at ${date}\n\nPUP EPMS Team`

  let message_id = sendMail(user.email, text_form, template)

  if (message_id)
    res.send({ error: false, message: 'We have sent a log in link to your email. Please click the link to change your password.' })
}

exports.authMagic = async (req, res) => {
  const query = req.query

  const encrypted = {
    iv: query.iv,
    encryptedData: query.token,
    authTag: query.authTag
  }

  let decrypted = decrypt(encrypted)

  let info = JSON.parse(decrypted)

  if (new Date(info.expires).toLocaleTimeString() < new Date(Date.now()).toLocaleTimeString()){
    return res.status(410).send(`
      <html>
        <body>
          <div>This link is expired. Redirecting you to login page.</div>
          <script>setTimeout(()=>location.assign('/'),1000)</script>
        </body>
      </html>
    `)
}
  let user = await Users.findOne({
    where: { email: info.email },
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
      as: 'roles',
      attributes: ['name'],
      through: {
        attributes: []
      }
    }
  })

  if (!user)
    res.status(404).send({ error: true, message: 'User not found' })


  let { id, email, first_name, middle_name, last_name, suffix_name } = user
  let roles = user.roles.map(el => el.name)
  let data = { id, email, first_name, middle_name, last_name, suffix_name, roles }

  let expiresIn = '7h'
  let expires = new Date(Date.now() + 1000 * 60 * 60 * 7)

  let token = await jwt.sign(data, process.env.JWT_SECRET, { expiresIn })
  res.cookie('token', token, { httpOnly: true, signed: true, expires })
  res.cookie('user', data.id, { expires })
  res.cookie('roles', JSON.stringify(roles), { expires })
  res.cookie('verified', 1, { expires })
  res.cookie('from_magic', 1, { expires })

  let to_store = { id, email, first_name, middle_name, last_name, suffix_name }

  res.send(`
  <html>
    <body>
    <p>Redirecting you to the site...</p>
    <script>
      localStorage.setItem('user_data', ${JSON.stringify(JSON.stringify(to_store))});
      setTimeout( () =>  location.assign('/p'), 1000)
    </script>
    </body>
  </html>
  `)

}

function encrypt(data) {
  const iv = crypto.randomBytes(16)
  let cipher = crypto.createCipheriv('aes-128-gcm', Buffer.from(process.env.AES_SECRET), iv);
  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  let authTag = cipher.getAuthTag()
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex'), authTag: authTag.toString('hex') };
}

function decrypt(data) {
  let iv = Buffer.from(data.iv, 'hex');
  let encryptedText = Buffer.from(data.encryptedData, 'hex');
  let decipher = crypto.createDecipheriv('aes-128-gcm', Buffer.from(process.env.AES_SECRET), iv);
  decipher.setAuthTag(Buffer.from(data.authTag, 'hex'))
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
