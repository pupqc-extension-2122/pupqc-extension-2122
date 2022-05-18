// Import Router from express
const router = require('express').Router();
const PATH = 'auth/';

// Login
router.get('/login', (req, res) => {
  res.render(PATH + 'login', {
      layout: './layouts/auth',
      document_title: 'Login',
  });
});

// Export module
module.exports = router; 