const { Memos } = require('../sequelize/models')
const datatable = require('../../utils/datatableResponse')

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

    if (req.auth.roles.include('Chief') && !req.auth.roles.include('Admin'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const id = req.params.id
    const body = req.body

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

    if (!req.auth.roles.includes('Extensionist')) {
      return res.status(403).send({ error: true, message: 'Forbidden Action' })
    }

    let data = await datatable(Memos, req.query, { include: ['organization'] })

    res.send(data)

  } catch (err) {
    console.log(err)
    res.send(err)
  }


}