const {
  Comments,
  Documents,
  Memos,
  Projects,
  Project_Partners,
  Project_Activities,
  Project_Evaluations,
  Project_History,
  Partners,
  Users
} = require('../sequelize/models')
const { Op } = require('sequelize')
const datatable = require('../../utils/datatableResponse')

// ? Projects

exports.viewProposal = async (req, res) => {
  let id = req.params.id

  let project = await Projects.findOne({
    where: { id },
    include: [
      {
        model: Partners,
        as: 'partners',
        through: {
          attributes: []
        }
      },
      {
        model: Project_Evaluations,
        as: 'evaluation'
      },
      {
        model: Comments,
        as: 'comments',
        include: [
          {
            model: Users,
            as: 'user',
            attributes: {
              exclude: [
                // 'id',
                'password'
              ]
            }
          }
        ],
      },
      {
        model: Project_History,
        as: 'history',
        include: [
          {
            model: Users,
            as: 'author',
            attributes: {
              exclude: [
                'password'
              ]
            }
          }
        ]
      }
    ],
    order: [
      ['history', 'created_at', 'ASC'],
      ['comments', 'created_at', 'ASC']
    ]

  })

  if (!project)
    return res.status(404).send({ error: true, message: 'Proposal Not Found' })

  res.send({
    error: false,
    data: project
  })

}

exports.datatableProposal = async (req, res) => {
  try {

    let options;

    if (req.auth.roles.includes('Admin'))
      options = {}

    else if (req.auth.roles.includes('Extensionist'))
      options = { where: { created_by: req.auth.id } };

    else
      options = { where: { status: { [Op.not]: 'Created' } } }

    options.include = ['memos', 'partners'];

    let data = await datatable(Projects, req.query, options)

    res.send(data)

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.datatableApprovedProposal = async (req, res) => {
  try {

    let data = await datatable(Projects, req.query, {
      where: { status: 'Approved' },
      include: ['memos', 'partners', 'activities']
    })
    res.send(data)

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.createProject = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Extensionist'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const body = req.body
    const files = req.files

    let project = await Projects.findOne({
      where: {
        title: body.title,
        start_date: body.start_date
      }
    })

    if (project)
      return res.status(400).send({ error: true, message: 'This Project is already created' })

    if (new Date(req.body.start_date) > new Date(req.body.end_date))
      return res.status(400).send({ error: true, message: 'Start Date cannot be later than End Date' })

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

    let project_partners = []
    if (partners.length) {
      project_partners = partners.map(el => (
        {
          partner_id: el.id,
          memo_id: el.memos[0].id
        }
      ))
    }

    let documents = []
    if (typeof files != 'undefined') {
      documents = files.map(el => (
        {
          upload_name: el.filename,
          file_name: el.originalname,
          mimetype: el.mimetype,
          path: el.path
        }
      ))
    }

    let data = await Projects.create({
      title: body.title,
      project_type: body.project_type,
      implementer: body.implementer,
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
      created_by: req.auth.id,
      documents: documents,
      history: [
        {
          current_value: 'Created',
          author_id: req.auth.id
        }
      ]
    }, {
      include: [
        {
          model: Project_Partners,
          as: 'project_partners'
        },
        {
          model: Project_History,
          as: 'history'
        },
        {
          model: Documents,
          as: 'documents'
        }
      ]
    })

    if (data) {
      res.send({
        error: false,
        data: data,
        message: 'Project Created!'
      })
    }
  } catch (err) {
    if (typeof req.files != 'undefined') {
      req.files.forEach(el => {
        fs.unlinkSync(el.path)
      })
    }
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
    const allowed_status = ['Created', 'For Revision']

    if (new Date(req.body.start_date) > new Date(req.body.end_date))
      return res.status(400).send({ error: true, message: 'Start Date cannot be later than End Date' })

    let partners = body.partner_id

    let current_project = await Projects.findByPk(id, {
      where: {
        status: {
          [Op.in]: allowed_status
        }
      },
      include: ['project_partners'],
    })

    if (!current_project)
      return res.status(404).send({ error: true, message: 'Project is either not found or not available for updates' })

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
    updated_project.project_type = body.project_type
    updated_project.implementer = body.implementer
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

exports.updateMonitoring = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Extensionist'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const id = req.params.id
    const body = req.body

    let project = await Projects.findByPk(id, { where: { status: 'Approved' } })

    if (!project)
      return res.status(404).send({ error: true, message: 'Project not found' })

    const previous_dates = [project.start_date, project.end_date]

    project.start_date = body.start_date
    project.end_date = body.end_date
    await project.save()

    let remarks = Comments.create({
      project_id: project.id,
      body: `<p>The schedule of this project was changed from <strong>${previous_dates[0]} - ${previous_dates[1]}</strong> to <strong>${body.start_date} - ${body.end_date}</strong></p><p>REMARKS: ${body.remarks}</p>`,
      user_id: req.auth.id
    })

    if (project && remarks)
      res.send({ error: false, message: 'Project Schedule Updated' })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

// ? For Submission

exports.cancelProposal = async (req, res) => {
  if (!req.auth.roles.includes('Extensionist'))
    return res.status(403).send({ error: true, message: 'Forbidden Action' })

  const id = req.params.id
  const body = req.body

  let project = await Projects.findByPk(id, {
    where: {
      status: {
        [Op.notIn]: ['Approved', 'Cancelled', 'Created']
      }
    }
  })

  if (!project)
    return res.status(404).send({ error: true, message: 'Proposal Not Found' })

  const previous_value = project.status

  project.status = 'Cancelled'

  await project.save()

  let history = await Project_History.create({
    project_id: project.id,
    current_value: 'Cancelled',
    previous_value,
    author_id: req.auth.id,
    remarks: body.remarks,
  })

  res.send({
    error: false,
    message: 'Proposal cancelled successfully!',
    data: history
  })
}

exports.requestForRevision = async (req, res) => {
  if (!req.auth.roles.includes('Chief'))
    return res.status(403).send({ error: true, message: 'Forbidden Action' })

  const id = req.params.id
  const body = req.body
  const allowed_status = ['Pending', 'For Review']

  let project = await Projects.findByPk(id, {
    where: {
      status: {
        [Op.in]: allowed_status
      }
    }
  })

  if (!project)
    return res.status(404).send({ error: true, message: 'Proposal Not Found' })

  if (!allowed_status.includes(project.status))
    return res.status(400).send({ error: true, message: 'Bad Request' })

  const previous_value = project.status

  project.status = 'For Revision'

  await project.save()

  let history = await Project_History.create({
    project_id: project.id,
    current_value: 'For Revision',
    previous_value,
    author_id: req.auth.id,
    remarks: body.remarks
  })

  res.send({
    error: false,
    message: 'Request for revision has been saved successfully!',
    data: history
  })
}

exports.submitForReviewProposal = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Extensionist'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const id = req.params.id
    const body = req.body

    let project = await Projects.findByPk(id, { include: ['activities'] })

    if (!project)
      return res.status(404).send({ error: true, message: 'Bad Request' })

    if (!project.activities.length)
      return res.send({ warning: true, message: 'Please include at least one project activity' })

    if (!(project.status == 'Created' || project.status == 'For Revision'))
      return res.status(400).send({ error: true, message: 'Invalid action' })

    const previous_value = project.status

    project.status = 'For Review'
    await project.save()

    let history = await Project_History.create({
      author_id: req.auth.id,
      project_id: project.id,
      current_value: 'For Review',
      previous_value
    })

    res.send({
      error: false,
      message: 'Project Proposal is submitted For Review',
      data: history
    })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.submitForEvaluationProposal = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Chief'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const id = req.params.id
    const body = req.body

    let project = await Projects.findByPk(id, { where: { status: 'For Review' } })

    if (!project)
      return res.status(404).send({ error: true, message: 'Project not found' })

    const previous_value = project.status

    project.status = 'For Evaluation'
    project.presentation_date = body.presentation_date
    await project.save()

    let history = await Project_History.create({
      project_id: project.id,
      current_value: 'For Evaluation',
      previous_value,
      author_id: req.auth.id,
    })

    res.send({
      error: false,
      message: 'Project is now For Evaluation',
      data: history
    })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.approveProposal = async (req, res) => {
  if (!req.auth.roles.includes('Chief'))
    return res.status(403).send({ error: true, message: 'Forbidden Action' })

  const id = req.params.id
  const body = req.body

  let project = await Projects.findByPk(id)

  if (!project)
    return res.status(404).send({ error: true, message: 'Proposal Not Found' })

  if (project.status != 'Pending')
    return res.status(400).send({ error: true, message: 'Bad Request' })

  const previous_value = project.status

  project.status = 'Approved'
  project.SO_number = body.SO_number

  await project.save()

  let history = await Project_History.create({
    project_id: project.id,
    current_value: 'Approved',
    previous_value,
    author_id: req.auth.id,
    remarks: body.remarks
  })

  res.send({
    error: false,
    message: 'Proposal approved successfully!',
    data: history
  });
}

// ? Evaluations
exports.evaluateProposal = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Chief'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const project_id = req.params.project_id
    const body = req.body

    let project = await Projects.findByPk(project_id, { where: { status: 'For Evaluation' } })
    if (!project)
      return res.status(404).send({ error: true, message: 'Project not Found' })

    let project_evaluation = await Project_Evaluations.create({
      project_id: project.id,
      project_title: project.title,
      evaluation_date: body.evaluation_date,
      evaluators: body.evaluators,
      average_points: body.average_points
    })

    if (project_evaluation) {
      project.status = 'Pending'
      await project.save()

      let history = await Project_History.create({
        project_id: project.id,
        previous_value: 'For Evaluation',
        current_value: 'Pending'
      })

      res.send({
        error: false,
        message: 'Project Evaluation recorded',
        data: history
      })
    }


  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.reschedulePresentation = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Chief'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const id = req.params.id
    const body = req.body

    let project = await Projects.findByPk(id, { where: { status: 'For Evaluation' } })

    if (!project)
      return res.status(404).send({ error: true, message: 'Project not Found' })

    project.presentation_date = body.presentation_date
    await project.save()

    const previous_value = project.status

    let history = await Project_History.create({
      project_id: project.id,
      current_value: 'Re-sched Presentation',
      previous_value: previous_value,
      author_id: req.auth.id,
      remarks: body.remarks
    })

    res.send({
      error: false,
      data: history,
      message: 'Project Presentation Date Updated',
    })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.evaluateActivity = async (req, res) => {
  try {

    if (!req.auth.roles.includes('Chief'))
      return res.status(403).send({ error: true, message: 'Forbidden Action' })

    const project_id = req.params.project_id
    const activity_id = req.params.activity_id
    const body = req.body

    let project = await Projects.findByPk(project_id, { where: { status: 'Approved' } })
    if (!project)
      return res.status(404).send({ error: true, message: 'Project not Found' })

    let activity = await Project_Activities.findOne({
      where: {
        id: activity_id,
        project_id: project.id
      }
    })

    if (!activity)
      return res.status(404).send({ error: true, message: 'Activity not Found' })

    activity.evaluation = body.evaluation

    await activity.save()

    res.send({
      error: false,
      message: 'Activity Evaluation recorded',
    })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}


// ? Activities

exports.datatableProjectActivities = async (req, res) => {
  try {

    const id = req.params.id

    let data = await datatable(Project_Activities, req.query, { where: { project_id: id } })

    res.send(data)

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.viewProjectActivities = async (req, res) => {
  try {

    const project_id = req.params.project_id
    const activity_id = req.params.activity_id

    let data = await Project_Activities.findOne({
      where: {
        id: activity_id,
        project_id
      }
    })

    if (!data)
      return res.status(404).send({ error: true, message: 'Project or Activity not found' })

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

    if (new Date(req.body.start_date) > new Date(req.body.end_date))
      return res.status(400).send({ error: true, message: 'Start Date cannot be later than End Date' })

    let data = await Project_Activities.create({ ...body, project_id: project.id })

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

exports.updateProjectActivities = async (req, res) => {

  try {

    if (!req.auth.roles.includes('Extensionist')) {
      return res.status(403).send({ error: true, message: 'Forbidden Action' })
    }

    const project_id = req.params.project_id
    const activity_id = req.params.activity_id
    const body = req.body
    const allowed_status = ['Created', 'For Review']

    if (new Date(body.start_date) > new Date(body.end_date))
      return res.status(400).send({ error: true, message: 'Start Date cannot be later than End Date' })

    let data = await Project_Activities.findOne({
      where: {
        id: activity_id,
        project_id,
      },
      include: [
        {
          model: Projects,
          as: 'project',
          where: {
            status: {
              [Op.in]: allowed_status
            }
          }
        }
      ]
    })

    if (!data)
      return res.status(404).send({ error: true, message: 'Project or Activity not found' })

    data.activity_name = body.activity_name
    data.topics = body.topics
    data.outcomes = body.outcomes
    data.start_date = body.start_date
    data.end_date = body.end_date
    data.details = body.details
    data.details = body.details

    await data.save()

    res.send({
      error: false,
      message: 'Activity updated successfully'
    })



  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

// ? Comments
exports.addComment = async (req, res) => {
  try {

    const project_id = req.params.project_id

    let project = await Projects.findByPk(project_id)

    if (!project)
      return res.status(404).send({ error: true, message: 'Project Not Found' })

    // if (!project.status == 'For Review' && !project.status == 'For Revision')
    //   return res.status(404).send({ error: true, message: 'Bad Request' })

    let comment = await Comments.create({
      body: req.body.body,
      project_id,
      user_id: req.auth.id
    }).then(async result => {
      return await Comments.findByPk(result.id, {
        include: [
          {
            model: Users,
            as: 'user',
            attributes: {
              exclude: [
                // 'id',
                'password'
              ]
            }
          }
        ]
      })
    })

    if (comment) {
      res.send({
        error: false,
        data: comment,
        message: 'Comment added!'
      })
    }

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.editComment = async (req, res) => {
  try {

    const project_id = req.params.project_id
    const comment_id = req.params.comment_id

    let comment = await Comments.findByPk(comment_id, { where: { project_id, user_id: req.auth.id } })

    if (!comment)
      return res.status(404).send({ error: true, message: 'Bad Request' })

    comment.body = req.body.body
    await comment.save()

    res.send({
      error: false,
      message: 'Comment updated!'
    })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.deleteComment = async (req, res) => {
  try {

    const project_id = req.params.project_id
    const comment_id = req.params.comment_id

    let comment = await Comments.findByPk(comment_id, { where: { project_id, user_id: req.auth.id } })

    if (!comment)
      return res.status(404).send({ error: false, message: 'Comment not found' })

    await comment.destroy()

    res.send({
      error: false,
      message: 'Comment deleted successfully'
    })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
}