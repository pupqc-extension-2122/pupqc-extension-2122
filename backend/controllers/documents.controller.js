const { Documents, Memos } = require('../sequelize/models')
const fs = require('fs')

exports.memoUploads = async (req, res) => {

  try {

    if (!req.auth.includes('Extensionist'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const id = req.params.id
    const files = req.files

    const memo = await Memos.findByPk(id)

    if (!memo)
      return res.status(404).send({ error: true, message: 'Memo not found' })

    const uploads = files.map(el => (
      {
        memo_id: memo.id,
        file_name: el.originalname,
        path: el.path
      }
    ))

    const documents = await Documents.bulkCreate(uploads)

    if (documents) {
      res.status(200).send({ error: false, message: 'Documents uploaded successfully!' })
    }

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.projectUploads = async (req, res) => {

  try {

    if (!req.auth.includes('Extensionist'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const id = req.params.id
    const files = req.files

    const project = await Project.findByPk(id)

    if (!project)
      return res.status(404).send({ error: true, message: 'Memo not found' })

    const uploads = files.map(el => (
      {
        project_id: project.id,
        file_name: el.originalname,
        path: el.path
      }
    ))

    const documents = await Documents.bulkCreate(uploads)

    if (documents) {
      res.status(200).send({ error: false, message: 'Documents uploaded successfully!' })
    }

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.deleteUploads = async (req, res) => {
  try {

    if (!req.auth.includes('Extensionist'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })


    const id = req.params.id

    const file = await Documents.findByPk(id)

    if (!file)
      return res.status(404).send({ error: true, message: 'File not found' })

    await file.destroy()
    fs.unlinkSync(file.path)

    res.status(200).send({ error: false, message: 'File deleted successfully' })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}