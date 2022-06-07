const { Partners, Memos, Sequelize } = require('../sequelize/models')

exports.createMemo = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Chief')) {
      return res.status(403).send({ error: true, message: 'Forbidden Action' })
    }
    const body = req.body

    let [partner, created] = await Partners.findOrCreate({
      where: {
        name: body.name.toUpperCase()
      },
      include: {
        model: Memos,
        as: 'memos',
        attributes: { exclude: ['id'] },
        limit: 1,
        order: [['signed_date', 'DESC']]
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
      type: body.type,
      partner_id: partner.id,
      partner_name: partner.name,
      duration: body.duration,
      signed_date: body.signed_date,
      end_date: null,
      signed_by_pup: body.signed_by_pup,
      signed_by_partner: body.signed_by_partner,
      notarized_by: body.notarized_by,
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