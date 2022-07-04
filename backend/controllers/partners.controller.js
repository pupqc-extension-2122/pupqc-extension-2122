const { Op } = require('sequelize')
const datatable = require('../../utils/datatableResponse')
const { Partners, Memos, Documents } = require('../sequelize/models')

exports.countPartners = async (req, res) => {
  let all_count = await Partners.count()

  let active_count = await Partners.count({
    include: {
      model: Memos,
      as: 'memos',
      where: { validity_date: { [Op.gte]: new Date() } }
    }
  })

  res.send({ error: false, data: { all_count, active_count } })
}

exports.listPartners = async (req, res) => {
  try {

    const start_date = req.query.start_date || null
    const end_date = req.query.end_date || null

    let options = {}
    if (start_date && end_date) {
      options = {
        include: {
          model: Memos,
          as: 'memos',
          where: {
            [Op.and]: {
              end_date: {
                [Op.gt]: end_date
              },
              validity_date: {
                [Op.lte]: start_date
              }
            }
          }
        }
      }
    }

    let data = await Partners.findAll(options)

    res.send({
      error: false,
      data
    })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.datatableMemos = async (req, res) => {
  try {

    const id = req.params.id

    const data = await datatable(Memos, req.query, {
      where: { partner_id: id },
      include: ['projects']
    })

    res.send(data)

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.datatablePartners = async (req, res) => {
  try {

    let data = await datatable(Partners, req.query, {})

    res.send(data)

  } catch (err) {
    res.send(err)
  }
}

exports.createPartner = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Extensionist')) {
      return res.status(403).send({ error: true, message: 'Forbidden Action' })
    }
    const body = req.body
    const files = req.files

    let [partner, created] = await Partners.findOrCreate({
      where: {
        name: body.name.toUpperCase()
      },
      defaults: {
        address: body.address
      },
      include: {
        model: Memos,
        as: 'memos',
        limit: 1,
        order: [['validity_date', 'DESC']]
      }
    })

    if (partner.memos) {
      if (new Date(partner.memos[0].end_date) > new Date()) {
        return res
          .status(400)
          .send({ warning: true, message: 'There is an existing memo for this partner' })
      }
    }

    let memo = await Memos.create({
      partner_id: partner.id,
      partner_name: partner.name,
      organization_id: body.organization_id,
      duration: body.duration,
      validity_date: body.validity_date,
      end_date: null,
      representative_pup: body.representative_pup,
      representative_partner: body.representative_partner,
      notarized_date: body.notarized_date,
    })

    if (memo) {
      if (typeof files != 'undefined') {
        files.forEach(async (el) => {
          await Documents.create({
            memo_id: memo.id,
            file_name: el.originalname,
            path: el.path
          })
        })
      }

      res
        .status(200)
        .send({ error: false, message: 'Partnership Added!' })
    }

  } catch (err) {
    console.log(err)
    res.send(err)
  }
}


exports.viewPartner = async (req, res) => {
  let id = req.params.id

  let partner = await Partners.findOne({
    where: { id },
  })

  if (!partner)
    return res.status(404).send({ error: true, message: 'Partner Not Found' })

  res.send({
    error: false,
    data: partner
  })

}