const router = require('express').Router();
const jwtMiddleware = require('../../utils/jwtMiddleware');
const { Partners, Memos } = require('../../backend/sequelize/models');

// Constants
const PATH = 'content/memo/';
const RENDER_OPTION_DEFAULTS = {
  active_topbar_tab: 'MOA/MOU',
  // sidebar: 'sidebars/memo_sidebar',
  sidebar: 'sidebars/main_sidebar',
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
router.get('/', jwtMiddleware, (req, res) => res.redirect(`/p/dashboard`));


// Dashboard
// router.get('/dashboard', jwtMiddleware, (req, res) => {
//   const { roles, first_name, last_name } = req.auth;

//   ['Extensionist','Chief','Director'].some(r => roles.includes(r))
//     ? res.render(PATH + 'dashboard', {
//       document_title: 'Dashboard',
//       active_sidebar_tab: 'Dashboard',
//       name: `${ first_name } ${ last_name }`,
//       role: renderRoles(roles),
//       roles: roles,
//       ...RENDER_OPTION_DEFAULTS
//     })
//     : render404(res)
// });


// Partners
router.get('/partners', jwtMiddleware, (req, res) => {
  const { roles, first_name, last_name } = req.auth;

  ['Extensionist','Chief','Director'].some(r => roles.includes(r))
    ? res.render(PATH + 'partners', {
      document_title: 'Partnerships',
      active_sidebar_tab: 'Partners',
      name: `${ first_name } ${ last_name }`,
      role: renderRoles(roles),
      roles: roles,
      ...RENDER_OPTION_DEFAULTS
    })
    : render404(res)
});


// Partner Details
router.get('/partners/:partner_id', jwtMiddleware, async (req, res) => {
  const { roles, first_name, last_name } = req.auth;
  const { partner_id } = req.params;

  const partner = await Partners.findOne({
    where: { id: partner_id }
  });

  if(!partner)
    return render404(res);

  ['Extensionist','Chief','Director'].some(r => roles.includes(r))
    ? res.render(PATH + 'partner_details', {
      document_title: 'Partner Details',
      active_sidebar_tab: 'Partners',
      name: `${ first_name } ${ last_name }`,
      role: renderRoles(roles),
      roles: roles,
      ...RENDER_OPTION_DEFAULTS
    })
    : render404(res)
});


// MOA/MOU
router.get('/memo/', jwtMiddleware, (req, res) => {
  const { roles, first_name, last_name } = req.auth;

  ['Extensionist','Chief','Director'].some(r => roles.includes(r))
    ? res.render(PATH + 'memos', {
      document_title: 'MOA/MOU',
      active_sidebar_tab: 'MOA/MOU',
      name: `${ first_name } ${ last_name }`,
      role: renderRoles(roles),
      roles: roles,
      ...RENDER_OPTION_DEFAULTS
    })
    : render404(res)
});


// MOA/MOU Details
router.get('/memo/:memo_id', jwtMiddleware, async (req, res) => {
  const { roles, first_name, last_name } = req.auth;
  const { memo_id } = req.params;

  const memo = await Memos.findOne({
    where: { id: memo_id }
  });

  if(!memo)
    return render404(res);

  ['Extensionist','Chief','Director'].some(r => roles.includes(r))
    ? res.render(PATH + 'memo_details', {
      document_title: 'MOA/MOU Details',
      active_sidebar_tab: 'MOA/MOU',
      name: `${ first_name } ${ last_name }`,
      role: renderRoles(roles),
      roles: roles,
      ...RENDER_OPTION_DEFAULTS
    })
    : render404(res)
});


module.exports = router;