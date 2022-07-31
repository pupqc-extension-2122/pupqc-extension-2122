const { Op } = require('sequelize')
const { Projects, Memos } = require('../sequelize/models')

exports.getCards = async (req, res) => {
  try {

    let data = {
      total: 0,
      upcoming: 0,
      ongoing: 0,
      concluded: 0,
      created: 0,
      for_review: 0,
      for_evaluation: 0,
      pending: 0,
      approved: 0,
      for_revision: 0,
      evaluated: 0,
      memos: 0,
    }


    let projects = await Projects.findAll({ include: 'evaluation' })

    data.total = projects.length;

    projects.forEach(el => {
      let status = el.status.toLowerCase()
      data[status]++

      if (el.evaluation)
        data['evaluated']++

      if (status == 'approved') {
        if (el.start_date > new Date())
          data['upcoming']++
        else if (el.start_date <= new Date() && el.end_date >= new Date())
          data['ongoing']++
        else
          data['concluded']++
      }
    });

    data['memos'] = await Memos.count({
      where: {
        [Op.and]: {
          validity_date: {
            [Op.lte]: new Date()
          },
          end_date: {
            [Op.gt]: new Date()
          }
        }
      }
    })

    res.send(data)

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}