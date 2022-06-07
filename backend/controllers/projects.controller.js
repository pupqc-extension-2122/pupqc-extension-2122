const {
  Evaluation_Plans, Financial_Requirements, Projects, Partners
} = require('../sequelize/models')


exports.createProject = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Extensionist'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    let body = req.body

    let partner = await Partners.findOne({
      where: {
        id: body.partner_id
      },
      include: ['memos']
    })

    if (!partner)
      return res.status(400).send({ error: true, message: 'Partnership not found' })


    let active_memo = partner.memos.map(el => (
      {
        id: el.id,
        signed_date: el.signed_date,
        end_date: el.end_date
      }
    ))

    active_memo = active_memo.filter(el => (
      new Date(el.end_date) > new Date(body.start_date) &&
      new Date(el.signed_date) <= new Date(body.start_date)
    ))

    let data = await Projects.create({
      memo_id: active_memo[0].id,
      title: body.title,
      target_groups: body.target_groups,
      team_members: body.team_members,
      start_date: body.start_date,
      end_date: body.end_date,
      status: 'Pending',
      impact_statement: body.impact_statement,
      summary: body.summary,
      financial_requirements: body.financial_requirements,
      evaluation_plans: body.evaluation_plans,
      project_partners: [{ partner_id: body.partner_id }],
      created_by: req.auth.id
    }, {
      include: [
        {
          model: Financial_Requirements,
          as: 'financial_requirements'
        },
        {
          model: Evaluation_Plans,
          as: 'evaluation_plans'
        },
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

  let proposal = await Projects.findByPK(id)

  if (!proposal)
    return res.status(404).send({ error: true, message: 'Proposal Not Found' })

  if (proposal.status != 'Pending')
    return res.status(400).send({ error: true, message: 'Bad Request' })

  proposal.status = 'Cancel'

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
      'financial_requirements',
      'evaluation_plans',
      'partners'
    ]

  })

  if (!proposal)
    return res.status(404).send({ error: true, message: 'Proposal Not Found' })

  res.send({
    error: false,
    data: proposal
  })

}