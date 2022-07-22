const router = require('express').Router();
const jwtMiddleware = require('../../utils/jwtMiddleware');

// Constants
const PATH = 'content/user_info/';

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

  res.render(PATH + 'profile', {
    layout: './layouts/user',
    document_title: 'My Profile',
    name: `${ first_name } ${ last_name }`,
    role: renderRoles(roles),
    roles: roles,
  });
});

// Export module
module.exports = router;