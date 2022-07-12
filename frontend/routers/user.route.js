const router = require('express').Router();
const jwtMiddleware = require('../../utils/jwtMiddleware');

// Constants
const PATH = 'content/users/';
const RENDER_OPTION_DEFAULTS = {
  active_topbar_tab: 'SysAdmin',
  sidebar: 'sidebars/admin_sidebar',
}

const renderRoles = (roles) => {
  let roleTemplate = '';
  roles.forEach((role, index) => {
    roleTemplate += role;
    if (index < roles.length - 1) roleTemplate += ', ';
  });
  return roleTemplate;
}

// Profile
router.get('/', jwtMiddleware, (req, res) => {
  const { roles, first_name, last_name } = req.auth;

  res.render(PATH + 'user_profile', {
    document_title: 'My Profile',
    active_sidebar_tab: '',
    name: `${ first_name } ${ last_name }`,
    role: renderRoles(roles),
    roles: roles,
    ...RENDER_OPTION_DEFAULTS
  })
});

// Export module
module.exports = router;