const router = require('express').Router();
const jwtMiddleware = require('../../utils/jwtMiddleware');

// Constants
const PATH = 'content/projects/';
const RENDER_OPTION_DEFAULTS = {
  active_topbar_tab: 'Projects',
  sidebar: 'projects_sidebar',
}


// *** ROUTES *** //


// Redirect
router.get('/', (req, res) => res.redirect(`/p/dashboard`));


// Dashboard
router.get('/dashboard', jwtMiddleware, (req, res) => {
  const { roles, first_name, last_name } = req.auth;

  roles.includes('Extensionist') || roles.includes('Chief')
    ? res.render(PATH + 'dashboard', {
      document_title: 'Dashboard',
      active_sidebar_tab: 'Dashboard',
      name: `${ first_name } ${ last_name }`,
      role: 'Extensionist',
      roles: roles,
      ...RENDER_OPTION_DEFAULTS
    })
    : console.log('404')
});


// Project Proposals
router.get('/proposals', jwtMiddleware, (req, res) => {
  const { roles, first_name, last_name } = req.auth;

  roles.includes('Extensionist') || roles.includes('Chief')
    ? res.render(PATH + 'project_proposals', {
      document_title: 'Project Proposals',
      active_sidebar_tab: 'Project Proposals',
      name: `${ first_name } ${ last_name }`,
      role: 'Extensionist',
      roles: roles,
      ...RENDER_OPTION_DEFAULTS
    })
    : console.log('404')
});


// Create Project Proposal
router.get('/create-proposal', jwtMiddleware, (req, res) => {
  const { roles, first_name, last_name } = req.auth;

  roles.includes('Extensionist') 
    ? res.render(PATH + 'create_proposal', {
      document_title: 'Create Project Proposal',
      active_sidebar_tab: 'Project Proposals',
      name: `${ first_name } ${ last_name }`,
      role: 'Extensionist',
      roles: roles,
      ...RENDER_OPTION_DEFAULTS
    })
    : console.log('404')
});


// Project Details
router.get('/proposals/:project_id', jwtMiddleware, (req, res) => {
  const { roles, first_name, last_name } = req.auth;

  roles.includes('Extensionist') || roles.includes('Chief')
    ? res.render(PATH + 'project_details', {
      document_title: 'Project Details',
      active_sidebar_tab: 'Project Proposals',
      name: `${ first_name } ${ last_name }`,
      role: 'Extensionist',
      roles: roles,
      ...RENDER_OPTION_DEFAULTS
    })
    : console.log('404')
});


// Project Activities
router.get('/proposals/:project_id/activities', jwtMiddleware, (req, res) => {
  const { roles, first_name, last_name } = req.auth;

  roles.includes('Extensionist') || roles.includes('Chief')
    ? res.render(PATH + 'project_activities', {
      document_title: 'Project Activities',
      active_sidebar_tab: 'Project Proposals',
      name: `${ first_name } ${ last_name }`,
      role: 'Extensionist',
      roles: roles,
      ...RENDER_OPTION_DEFAULTS
    })
    : console.log('404')
});



// Edit Project Proposal
router.get('/edit-proposal/:project_id', jwtMiddleware, (req, res) => {
  const { roles, first_name, last_name } = req.auth;

  roles.includes('Extensionist')
    ? res.render(PATH + 'edit_proposal', {
      document_title: 'Edit Project Proposal',
      active_sidebar_tab: 'Project Proposals',
      name: `${ first_name } ${ last_name }`,
      role: 'Extensionist',
      roles: roles,
      ...RENDER_OPTION_DEFAULTS
    })
    : console.log('404')
});


// Project Monitoring
router.get('/monitoring/', jwtMiddleware, (req, res) => {
  const { roles, first_name, last_name } = req.auth;

  roles.includes('Extensionist') || roles.includes('Chief')
    ? res.render(PATH + 'project_monitoring', {
      document_title: 'Project Monitoring',
      active_sidebar_tab: 'Project Monitoring',
      name: `${ first_name } ${ last_name }`,
      role: 'Extensionist',
      roles: roles,
      ...RENDER_OPTION_DEFAULTS
    })
    : console.log('404')
});

// Project Evaluation
router.get('/evaluation/', jwtMiddleware, (req, res) => {
  const { roles, first_name, last_name } = req.auth;

  roles.includes('Extensionist') || roles.includes('Chief')
    ? res.render(PATH + 'project_evaluation', {
      document_title: 'Project Evaluation',
      active_sidebar_tab: 'Project Evaluation',
      name: `${ first_name } ${ last_name }`,
      role: 'Extensionist',
      roles: roles,
      ...RENDER_OPTION_DEFAULTS
    })
    : console.log('404')
});

// Project Evaluation Details
router.get('/evaluation/:project_id', jwtMiddleware, (req, res) => {
  const { roles, first_name, last_name } = req.auth;

  roles.includes('Extensionist') || roles.includes('Chief')
    ? res.render(PATH + 'project_evaluation_details', {
      document_title: 'Project Details',
      active_sidebar_tab: 'Project Evaluation',
      name: `${ first_name } ${ last_name }`,
      role: 'Extensionist',
      roles: roles,
      ...RENDER_OPTION_DEFAULTS
    })
    : console.log('404')
});

// Project Activities
router.get('/evaluation/:project_id/activities', jwtMiddleware, (req, res) => {
  const { roles, first_name, last_name } = req.auth;

  roles.includes('Extensionist') || roles.includes('Chief')
    ? res.render(PATH + 'project_evaluation_activities', {
      document_title: 'Project Activities',
      active_sidebar_tab: 'Project Evaluation',
      name: `${ first_name } ${ last_name }`,
      role: 'Extensionist',
      roles: roles,
      ...RENDER_OPTION_DEFAULTS
    })
    : console.log('404')
});

// Project Monitoring Details
router.get('/monitoring/:project_id', jwtMiddleware, (req, res) => {
  const { roles, first_name, last_name } = req.auth;

  roles.includes('Extensionist') || roles.includes('Chief')
    ? res.render(PATH + 'project_monitoring_details', {
      document_title: 'Project Monitoring Details',
      active_sidebar_tab: 'Project Monitoring',
      name: `${ first_name } ${ last_name }`,
      role: 'Extensionist',
      roles: roles,
      ...RENDER_OPTION_DEFAULTS
    })
    : console.log('404')
});

/* NOT YET FINISHED, NO EJS, JS, ETC.
// Project Monitoring Activities
router.get('/monitoring/:project_id/activities', jwtMiddleware, (req, res) => {
  const { roles, first_name, last_name } = req.auth;

  roles.includes('Extensionist') || roles.includes('Chief')
    ? res.render(PATH + 'project_monitoring_activities', {
      document_title: 'Project Monitoring Activities',
      active_sidebar_tab: 'Project Monitoring',
      name: `${ first_name } ${ last_name }`,
      role: 'Extensionist',
      roles: roles,
      ...RENDER_OPTION_DEFAULTS
    })
    : console.log('404')
});

*/
module.exports = router;