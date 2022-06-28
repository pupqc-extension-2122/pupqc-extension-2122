const jwtMiddleware = require('../../utils/jwtMiddleware');
const router = require('express').Router();
const PATH = 'auth/';


// Redirect to login
router.get('/', (req, res) => {
  res.redirect('/login');
});


// Login
router.get('/login', (req, res) => {
  res.render(PATH + 'login', {
    layout: './layouts/auth',
    document_title: 'Login',
  });
});


// Forgot password
router.get('/forgot-password', (req, res) => {
  res.render(PATH + 'forgot_password', {
    layout: './layouts/auth',
    document_title: 'Login',
  });
});


// Export module
module.exports = router;