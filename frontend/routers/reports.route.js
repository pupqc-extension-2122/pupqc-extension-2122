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


module.exports = router;
