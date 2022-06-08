const datatables = require('sequelize-datatables')
const { Memos } = require('../sequelize/models')

exports.viewMemo = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Chief')) {
      return res.status(403).send({ error: true, message: 'Forbidden Action' })
    }

    let id = req.params.id

    let data = await Memos.findByPk(id)

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

exports.dataTableMemo = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Chief')) {
      return res.status(403).send({ error: true, message: 'Forbidden Action' })
    }

    let partner_id = req.params.id

    let data = await datatables(Memos, req.query, { where: { partner_id } })

    res.send({
      error: false,
      data
    })

  } catch (err) {
    console.log(err)
    res.send(err)
  }


}