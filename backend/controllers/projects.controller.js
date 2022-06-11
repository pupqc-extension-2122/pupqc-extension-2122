const {
  Memos, Projects, Project_Partners, Partners
} = require('../sequelize/models')
const { Op } = require('sequelize')


exports.createProject = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Extensionist'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    let body = req.body

    let partners = await Partners.findAll({
      where: {
        id: [...body.partner_id]
      },
      include: [
        {
          model: Memos,
          as: 'memos',
          where: {
            [Op.and]: {
              end_date: {
                [Op.gt]: new Date(body.start_date)
              },
              signed_date: {
                [Op.lte]: new Date(body.start_date)
              }
            }
          }
        }
      ]
    })

    if (!partners.length)
      return res.status(400).send({ error: true, message: 'Partnership not found' })

    let project_partners = partners.map(el => (
      {
        partner_id: el.id,
        memo_id: el.memos[0].id
      }
    ))

    let data = await Projects.create({
      title: body.title,
      target_groups: body.target_groups,
      team_members: body.team_members,
      start_date: body.start_date,
      end_date: body.end_date,
      status: 'Created',
      impact_statement: body.impact_statement,
      summary: body.summary,
      financial_requirements: body.financial_requirements,
      evaluation_plans: body.evaluation_plans,
      project_partners: project_partners,
      created_by: req.auth.id
    }, {
      include: [
        {
          model: Project_Partners,
          as: 'project_partners'
        }
      ]
    })

    if (data) {
      res.send({
        error: false,
        message: 'Project Created!'
      })
    }
  } catch (err) {
    console.log(err)
    res.send(err)
  }
}

exports.cancelProposal = async (req, res) => {
  if (!req.auth.roles.includes('Extensionist'))
    return res.status(403).send({ error: true, message: 'Forbidden Action' })

  let id = req.params.id

  let proposal = await Projects.findByPk(id)

  if (!proposal)
    return res.status(404).send({ error: true, message: 'Proposal Not Found' })

  if (proposal.status != 'Pending')
    return res.status(400).send({ error: true, message: 'Bad Request' })

  proposal.status = 'Cancelled'

  await proposal.save()

  res.send({
    error: false,
    message: 'Proposal cancelled successfully!'
  })
}

exports.viewProposal = async (req, res) => {
  let id = req.params.id

  let proposal = await Projects.findOne({
    where: { id },
    include: [
      {
        model: Partners,
        as: 'partners',
        through: {
          attributes: []
        }
      }
    ]

  })

  if (!proposal)
    return res.status(404).send({ error: true, message: 'Proposal Not Found' })

  res.send({
    error: false,
    data: proposal
  })

}


exports.createProjectActivities = async (req, res) => {
  if (!req.auth.roles.includes('Extensionist')) {
    return res.status(403).send({ error: true, message: 'Forbidden Action' })
  }
  const body = req.body

  let id = req.params.id

  let [project_activites, created] = await Project.findByPK({
    where: {
      name: body.name.toUpperCase()
    },
    defaults: {
      address: body.address
    },
    include: {
      model: Project_Activities,
      as: 'project_activities',
      attributes: { exclude: ['id'] },
      limit: 1,
      order: [['validity_date', 'DESC']]
    }
  })

  if (project.project_activities) {
    if (new Date(project.project_activities[0].end_date) > new Date()) {
      return res
        .status(400)
        .send({ error: true, message: 'There is an existing activity for this Project' })
    }
  }

  let project_activities = await Project_Activities.create({
    project_id: project.id,
    project_name: project.name,
    organization_id: body.organization_id,
    duration: body.duration,
    validity_date: body.validity_date,
    end_date: null,
    representative_pup: body.representative_pup,
    representative_partner: body.representative_partner,
    notarized_date: body.notarized_date,
  })

  if (project_activity) {
    res
      .status(200)
      .send({ error: false, message: 'Project Actvity Created!' })
  }
}