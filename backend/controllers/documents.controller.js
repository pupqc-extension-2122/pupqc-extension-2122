const { Documents, Memos, Projects } = require('../sequelize/models')
const datatable = require('../../utils/datatableResponse')
const fs = require('fs')

exports.datatableMemoUploads = async (req, res) => {
  try {

    const id = req.params.id

    const memo = await Memos.findByPk(id)

    if (!memo)
      return res.status(404).send({ error: true, message: 'Memo not found' })

    let data = await datatable(Documents, req.query, { where: { memo_id: memo.id } })

    res.send(data)

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.datatableProjectUploads = async (req, res) => {
  try {

    const id = req.params.id

    const project = await Projects.findByPk(id)

    if (!project)
      return res.status(404).send({ error: true, message: 'Project not found' })

    let data = await datatable(Documents, req.query, { where: { project_id: project.id } })

    res.send(data)

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.memoUploads = async (req, res) => {

  try {

    if (!req.auth.roles.includes('Extensionist'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const id = req.params.id
    const files = req.files
    // console.log(req.files)

    const memo = await Memos.findByPk(id)

    if (!memo)
      return res.status(404).send({ error: true, message: 'Memo not found' })

    const uploads = files.map(el => (
      {
        memo_id: memo.id,
        file_name: '/uploads/memo/' + el.filename,
        mimetype: el.mimetype,
        path: el.path
      }
    ))

    const documents = await Documents.bulkCreate(uploads)

    if (documents) {
      res.status(200).send({ error: false, message: 'Documents uploaded successfully!' })
    }

  } catch (error) {
    req.files.forEach(el=>{
      fs.unlinkSync(el.path)
    })
    console.log(error)
    res.send(error)
  }
}

exports.projectUploads = async (req, res) => {

  try {

    if (!req.auth.roles.includes('Extensionist'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const id = req.params.id
    const files = req.files

    const project = await Projects.findByPk(id)

    if (!project)
      return res.status(404).send({ error: true, message: 'Project not found' })

    const uploads = files.map(el => (
      {
        project_id: project.id,
        file_name: '/uploads/project/' + el.filename,
        mimetype: el.mimetype,
        path: el.path
      }
    ))

    const documents = await Documents.bulkCreate(uploads)

    if (documents) {
      res.status(200).send({ error: false, message: 'Documents uploaded successfully!' })
    }

  } catch (error) {
    req.files.forEach(el=>{
      fs.unlinkSync(el.path)
    })
    console.log(error)
    res.send(error)
  }
}

exports.deleteUploads = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Extensionist'))
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