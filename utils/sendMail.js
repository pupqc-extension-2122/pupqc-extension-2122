require('dotenv').config()
const nodemailer = require('nodemailer')

const configOptions = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_LOGIN,
    pass: process.env.SMTP_PASSWORD
  }
}

const transporter = nodemailer.createTransport(configOptions)

exports.sendMail = async (to, text, html, subject = 'Log In to PUP-EPMS') => {
  try {
    
    let info = await transporter.sendMail({
      from: 'PUP Extension Office <noreply@pupextension.com>',
      to,
      subject,
      text,
      html
    })

    return info.messageId

  } catch (error) {
    console.log(error)
  }
}