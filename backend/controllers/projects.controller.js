const {
  Memos, Projects, Project_Partners, Project_Activities, Partners
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
              validity_date: {
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

exports.updateProject = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Extensionist'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const id = req.params.id
    const body = req.body

    let partners = body.partner_id

    let current_project = await Projects.findByPk(id, {
      include: ['project_partners']
    })

    let current_partners = current_project.project_partners.map(el => {
      return ({ id: el.id, partner_id: el.partner_id })
    })

    let retained_partners = []

    current_partners.forEach(el => {
      if (!partners.includes(el.partner_id)) {
        Project_Partners.findOne({ where: { id: el.id } })
          .then(async (result) => await result.destroy())
      } else
        retained_partners.push(el.partner_id)
    })

    partners = partners.filter(el => !retained_partners.includes(el))

    if (partners.length) {
      let new_partners = await Partners.findAll({
        where: {
          id: [...partners]
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
                validity_date: {
                  [Op.lte]: new Date(body.start_date)
                }
              }
            }
          }
        ]
      })

      if (!new_partners.length)
        return res.status(400).send({ error: true, message: 'One or more partnerships are not registered.' })

      let project_partners = new_partners.map(el => (
        {
          project_id: id,
          partner_id: el.id,
          memo_id: el.memos[0].id
        }
      ))

      await Project_Partners.bulkCreate(project_partners)
    }


    let updated_project = current_project
    updated_project.title = body.title
    updated_project.target_groups = body.target_groups
    updated_project.team_members = body.team_members
    updated_project.start_date = body.start_date
    updated_project.end_date = body.end_date
    updated_project.impact_statement = body.impact_statement
    updated_project.summary = body.summary
    updated_project.financial_requirements = body.financial_requirements
    updated_project.evaluation_plans = body.evaluation_plans

    await updated_project.save()

    res.send({
      error: false,
      message: 'Project Details Updated'
    })

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

// ? Acitivities
exports.listProjectActivities = async (req, res) => {
  try {

    const id = req.params.id

    let data = await Project_Activities.findAll({ where: { project_id: id } })

    res.send({
      error: false,
      data
    })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.createProjectActivities = async (req, res) => {

  try {

    if (!req.auth.roles.includes('Extensionist')) {
      return res.status(403).send({ error: true, message: 'Forbidden Action' })
    }

    const id = req.params.id
    const body = req.body

    let project = await Projects.findByPk(id)

    if (!project)
      return res.status(404).send({ error: true, message: 'Project not found' })

    let data = await Project_Activities.create({ ...body, project_id: id })

    if (data) {
      res.send({
        error: false,
        message: 'Activity added successfully'
      })
    }


  } catch (error) {
    console.log(error)
    res.send(error)
  }
}