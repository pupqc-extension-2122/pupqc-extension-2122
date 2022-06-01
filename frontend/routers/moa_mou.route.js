// Import Router from express
const router = require('express').Router();
const PATH = 'content/moa_mou/';
const sidebar = 'moa_mou_sidebar';
const active_topbar = 'MOA/MOU';

// * Routes

// Redirect
router.get('/', (req, res) => res.redirect('/m/dashboard'));

// Dashboard
router.get('/dashboard', (req, res) => {
  res.render(PATH + 'dashboard', {
    document_title: 'Dashboard - MOA/MOU',
    active_topbar_tab: active_topbar,
    active_sidebar_tab: 'Dashboard',
    sidebar: sidebar,
    name: 'Ssam Jan Doe',
    role: 'Extensionist'
  });
});

// Export module
module.exports = router; 
