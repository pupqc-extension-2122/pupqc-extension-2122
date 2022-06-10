const datatables = require('sequelize-datatables')
const { Partners, Memos } = require('../sequelize/models')

exports.datatablePartners = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Chief')) {
      return res.status(403).send({ error: true, message: 'Forbidden Action' })
    }
    
    let data = await datatables(Partners, req.query, {})

    res.send(data)

  } catch (err) {
    res.send(err)
  }
}

exports.createPartner = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Chief')) {
      return res.status(403).send({ error: true, message: 'Forbidden Action' })
    }
    const body = req.body

    let [partner, created] = await Partners.findOrCreate({
      where: {
        name: body.name.toUpperCase()
      },
      defaults:{
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