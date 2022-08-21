const { readFile, writeFile } = require('fs')


exports.storeConfig = async (req, res) => {
  try {

    const body = req.body

    writeFile('../activity_post_eval.json', JSON.stringify(body.config))
      .catch(err => { if (err) throw err })

    res.send({ error: false, message: 'Configuration Successful' })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.readConfig = async (req, res) => {
  try {

    const template = await readFile('../activity_post_eval.json')

    const data = JSON.parse(template)

    res.send({ error: false, data })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}