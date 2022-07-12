const router = require('express').Router();
const PATH = 'auth/';


// Redirect to login
router.get('/', (req, res) => {
  res.redirect('/login');
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


// Export module
module.exports = router;