const router = require('express').Router();
const jwtMiddleware = require('../../utils/jwtMiddleware');

// Constants
const PATH = 'content/reports/';
const RENDER_OPTION_DEFAULTS = {
  active_topbar_tab: 'Reports',
  sidebar: 'sidebars/reports_sidebar',
}


const renderRoles = (roles) => {
  let roleTemplate = '';
  roles.forEach((role, index) => {
    roleTemplate += role;
    if (index < roles.length - 1) roleTemplate += ', ';
  });
  return roleTemplate;
}

const render404 = (res) => {
  return res.status(404).render('content/errors/404', {
    layout: './layouts/error',
    document_title: '404 - Page not found',
  });
}

// *** ROUTES *** //


// Redirect
router.get('/', jwtMiddleware, (req, res) => res.redirect(`/r/dashboard`));



// Dashboard
router.get('/dashboard', jwtMiddleware, (req, res) => {
  const { roles, first_name, last_name } = req.auth;

  ['Extensionist','Chief','Director'].some(r => roles.includes(r))
    ? res.render(PATH + 'dashboard', {
        document_title: 'Dashboard',
        active_sidebar_tab: 'Dashboard',
        name: `${ first_name } ${ last_name }`,
        role: renderRoles(roles),
        roles: roles,
        ...RENDER_OPTION_DEFAULTS
      })
    : render404(res)
});

// Report 1
router.get('/report1', jwtMiddleware, (req, res) => {
  const { roles, first_name, last_name } = req.auth;

  ['Extensionist','Chief','Director'].some(r => roles.includes(r))
    ? res.render(PATH + 'report_1', {
        document_title: 'Status of Submitted Extension Project Proposal for Institutional Funding',
        active_sidebar_tab: 'Status of Submitted Extension Project Proposal for Institutional Funding',
        name: `${ first_name } ${ last_name }`,
        role: renderRoles(roles),
        roles: roles,
        ...RENDER_OPTION_DEFAULTS
      })
    : render404(res)
});

// Report 2
router.get('/report2', jwtMiddleware, (req, res) => {
  const { roles, first_name, last_name } = req.auth;

  ['Extensionist','Chief','Director'].some(r => roles.includes(r))
    ? res.render(PATH + 'report_2', {
        document_title: 'Status of University Extension Projects',
        active_sidebar_tab: 'Status of University Extension Projects',
        name: `${ first_name } ${ last_name }`,
        role: renderRoles(roles),
        roles: roles,
        ...RENDER_OPTION_DEFAULTS
      })
    : render404(res)
});

// Report 3
router.get('/report3', jwtMiddleware, (req, res) => {
  const { roles, first_name, last_name } = req.auth;

  ['Extensionist','Chief','Director'].some(r => roles.includes(r))
    ? res.render(PATH + 'report_3', {
        document_title: 'University Active Extension Partners and Adopted Communities',
        active_sidebar_tab: 'University Active Extension Partners and Adopted Communities',
        name: `${ first_name } ${ last_name }`,
        role: renderRoles(roles),
        roles: roles,
        ...RENDER_OPTION_DEFAULTS
      })
    : render404(res)
});

// Report 4
router.get('/report4', jwtMiddleware, (req, res) => {
  const { roles, first_name, last_name } = req.auth;

  ['Extensionist','Chief','Director'].some(r => roles.includes(r))
    ? res.render(PATH + 'report_4', {
        document_title: 'Inventory of University Faculty Experts on Extension Projects',
        active_sidebar_tab: 'Inventory of University Faculty Experts on Extension Projects',
        name: `${ first_name } ${ last_name }`,
        role: renderRoles(roles),
        roles: roles,
        ...RENDER_OPTION_DEFAULTS
      })
    : render404(res)
});

// Report 5
router.get('/report5', jwtMiddleware, (req, res) => {
  const { roles, first_name, last_name } = req.auth;

  ['Extensionist','Chief','Director'].some(r => roles.includes(r))
    ? res.render(PATH + 'report_5', {
        document_title: 'Project Monitoring',
        active_sidebar_tab: 'Project Monitoring',
        name: `${ first_name } ${ last_name }`,
        role: renderRoles(roles),
        roles: roles,
        ...RENDER_OPTION_DEFAULTS
      })
    : render404(res)
});

module.exports = router;
