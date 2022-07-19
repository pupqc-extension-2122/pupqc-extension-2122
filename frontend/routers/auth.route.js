const router = require('express').Router();
const PATH = 'auth/';
const user_cookies = ['verified','user','roles'];

const hasPrivilege = (req) => user_cookies.every(k => req.cookies[k] !== undefined);


// Redirect to login
router.get('/', (req, res) => {
  console.log("TEST");
  if (hasPrivilege(req)) {
    const roles = JSON.parse(req.cookies.roles);
    if (roles.includes('Admin'))
      res.redirect('/a');
    else {
      res.redirect('/p');
    }
  } else res.redirect('/login');
});


// Login
router.get('/login', (req, res) => {
  const cookies = req.cookies;
  if (hasPrivilege(req)) {
    const roles = JSON.parse(cookies.roles);
    if (roles.includes('Admin'))
      res.redirect('/a');
    else {
      res.redirect('/p');
    }
  } else {
    res.render(PATH + 'login', {
      layout: './layouts/auth',
      document_title: 'Login',
    });
  }
});


// Forgot password
router.get('/forgot-password', (req, res) => {
  res.render(PATH + 'forgot_password', {
    layout: './layouts/auth',
    document_title: 'Forgot Password',
  });
});


// Change Password (For first timers)
router.get('/change-password', (req, res) => {

  if (hasPrivilege(req) && req.cookies.verified == '0') {
    res.render(PATH + 'change_password', {
      layout: './layouts/auth',
      document_title: 'Forgot Password',
    });
  } else {
    [...user_cookies,'token'].forEach(k => res.clearCookie(k));
    res.redirect('/login');
  }
});


// Export module
module.exports = router;