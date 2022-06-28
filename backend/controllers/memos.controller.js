const { Memos, Documents } = require('../sequelize/models')
const datatable = require('../../utils/datatableResponse')
const fs = require('fs')

exports.viewMemo = async (req, res) => {
  try {

    let id = req.params.id

    let data = await Memos.findByPk(id, {
      include: ['organization', 'partner']
    })

    if (!data)
      return res.status(404).send({ error: true, message: 'Memo not found' })

    res.send({
      error: false,
      data
    })

  } catch (err) {
    console.log(err)
    res.send(err)
  }
}

exports.updateMemo = async (req, res) => {

  try {

    if (req.auth.roles.includes('Chief') && !req.auth.roles.includes('Admin'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const id = req.params.id
    const body = req.body
    const files = req.files

    let memo = await Memos.findOne({ where: { id } })

    if (!memo)
      return res.status(404).send({ error: true, message: 'Memo not found' })

    memo.duration = body.duration
    memo.validity_date = body.validity_date
    memo.end_date = new Date(new Date(body.validity_date).setDate(new Date(body.validity_date).getDate() + (body.duration * 365.25)))
    memo.representative_pup = body.representative_pup
    memo.representative_partner = body.representative_partner
    memo.notarized_date = body.notarized_date

    await memo.save()

    let documents = await Documents.findAll({ where: { memo_id: id } })
    let new_documents = files.map(el => el.originalname)
    let old_documents = documents.map(el => el.file_name)

    new_documents.forEach(async (el, index) => {
      if (!old_documents.includes(el)) {
        await Documents.create({
          memo_id: id,
          file_name: el,
          path: files[index].path
        })
      }
    })

    documents.forEach(async (el) => {
      fs.unlinkSync(el.path)
      if (new_documents.includes(el.file_name)) {
        let new_path = files.filter(row => row.originalname == el.file_name)[0].path
        el.path = new_path
        await el.save()
      } else {
        await el.destroy()
      }
    })


    res.send({
      error: false,
      message: 'Memo Updated Successfully!'
    })

  } catch (err) {
    console.log(err)
    res.send(err)
  }

}

exports.dataTableMemo = async (req, res) => {
  try {

    let data = await datatable(Memos, req.query, { include: ['organization'] })

    res.send(data)

  } catch (err) {
    console.log(err)
    res.send(err)
  }


}