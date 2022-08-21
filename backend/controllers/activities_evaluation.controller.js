const { readFile, writeFile } = require('fs')


exports.storeConfig = async (req, res) => {
  try {

    const body = req.body

    writeFile('../activity_post_eval.json', JSON.stringify(body.config), (err) => { if (err) throw err })

    res.send({ error: false, message: 'Configuration Successful' })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.readConfig = async (req, res) => {
  try {

    readFile('../activity_post_eval.json', (err, data) => {
      if (err) throw err

      let config = JSON.parse(data)

      res.send({ error: false, data: config })
    })


  } catch (error) {
    console.log(error)
    res.send(error)
  }
}