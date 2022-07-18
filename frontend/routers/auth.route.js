const router = require('express').Router();
const PATH = 'auth/';


// Redirect to login
router.get('/', (req, res) => {
  if (req.cookies.roles) {
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
  if (req.cookies.roles) {
    const roles = JSON.parse(req.cookies.roles);
    if (roles.includes('Admin'))
      res.redirect('/a');
    else {
      res.redirect('/p');
    }
  } else {
    res.clearCookie('first_time');
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
  if (req.cookies.user && req.cookies.roles && req.cookies.first_time) {
    res.render(PATH + 'change_password', {
      layout: './layouts/auth',
      document_title: 'Forgot Password',
    });
  } else {
    ['first_time','user','roles','token'].forEach(k => res.clearCookie(k));
    res.redirect('/login');
  }
});


// Export module
module.exports = router;