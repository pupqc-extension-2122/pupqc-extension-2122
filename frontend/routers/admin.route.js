const router = require('express').Router();
const jwtMiddleware = require('../../utils/jwtMiddleware');

// Constants
const PATH = 'content/admin/';
const RENDER_OPTION_DEFAULTS = {
  active_topbar_tab: 'SysAdmin',
  sidebar: 'admin_sidebar',
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


// Redirect
router.get('/', jwtMiddleware, (req, res) => {
  req.auth.roles.includes('Admin')
    ? res.redirect(`/a/dashboard`)
    : render404(res)
});


// Dashboard
router.get('/dashboard', jwtMiddleware, (req, res) => {
  const { roles, first_name, last_name } = req.auth;

  roles.includes('Admin')
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


// Users
router.get('/users', jwtMiddleware, (req, res) => {
  const { roles, first_name, last_name } = req.auth;

  roles.includes('Admin')
    ? res.render(PATH + 'users', {
      document_title: 'Users',
      active_sidebar_tab: 'Users',
      name: `${ first_name } ${ last_name }`,
      role: renderRoles(roles),
      roles: roles,
      ...RENDER_OPTION_DEFAULTS
    })
    : render404(res)
});

// Budget Item Categories
router.get('/budget-item-categories', jwtMiddleware, (req, res) => {
  const { roles, first_name, last_name } = req.auth;

  roles.includes('Admin')
    ? res.render(PATH + 'budget_item_categories', {
      document_title: 'Budget Item Categories',
      active_sidebar_tab: 'Budget Item Categories',
      name: `${ first_name } ${ last_name }`,
      role: renderRoles(roles),
      roles: roles,
      ...RENDER_OPTION_DEFAULTS
    })
    : render404(res)
});

// Branches/Campuses
router.get('/branches-campuses', jwtMiddleware, (req, res) => {
  const { roles, first_name, last_name } = req.auth;

  roles.includes('Admin')
    ? res.render(PATH + 'branches_campuses', {
      document_title: 'Branches/Campuses',
      active_sidebar_tab: 'Branches/Campuses',
      name: `${ first_name } ${ last_name }`,
      role: renderRoles(roles),
      roles: roles,
      ...RENDER_OPTION_DEFAULTS
    })
    : render404(res)
});

// Post Evaluation
router.get('/post-evaluation', jwtMiddleware, (req, res) => {
  const { roles, first_name, last_name } = req.auth;

  roles.includes('Admin')
    ? res.render(PATH + 'post_evaluation', {
      document_title: 'Post Evaluation',
      active_sidebar_tab: 'Post Evaluation',
      name: `${ first_name } ${ last_name }`,
      role: renderRoles(roles),
      roles: roles,
      ...RENDER_OPTION_DEFAULTS
    })
    : render404(res)
});

// Export module
module.exports = router;