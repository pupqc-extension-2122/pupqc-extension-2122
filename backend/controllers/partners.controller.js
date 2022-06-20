const { Op } = require('sequelize')
const datatable = require('../../utils/datatableResponse')
const { Partners, Memos } = require('../sequelize/models')

exports.listPartners = async (req, res) => {
  try {

    const start_date = req.query.start_date || null
    const end_date = req.query.end_date || null

    let options = {}
    if (start_date && end_date){
      options = {
        include: {
          model: Memos,
          as: 'memos',
          where: {
            [Op.and]: {
              end_date:{
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

    if (!req.auth.roles.includes('Extensionist') && !req.auth.roles.includes('Chief')) {
      return res.status(403).send({ error: true, message: 'Forbidden Action' })
    }

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
        attributes: { exclude: ['id'] },
        limit: 1,
        order: [['validity_date', 'DESC']]
      }
    })

    if (partner.memos) {
      if (new Date(partner.memos[0].end_date) > new Date()) {
        return res
          .status(400)
          .send({ error: true, message: 'There is an existing memo for this Partnership' })
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
      res
        .status(200)
        .send({ error: false, message: 'Partnership Added!' })
    }

  } catch (err) {
    console.log(err)
    res.send(err)
  }
}