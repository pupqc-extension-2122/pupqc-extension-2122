// Import Router from express
const router = require('express').Router();
const PATH = 'content/monitoring/';
const sidebar = 'monitoring_sidebar';
const active_topbar = 'Monitoring';

// * Routes

// Redirect
router.get('/', (req, res) => res.redirect('/p/dashboard'));

// Dashboard
router.get('/dashboard', (req, res) => {
  res.render(PATH + 'dashboard', {
    document_title: 'Dashboard - Monitoring',
    active_topbar_tab: active_topbar,
    active_sidebar_tab: 'Dashboard',
    sidebar: sidebar,
    name: 'Ssam Jan Doe',
    role: 'Extensionist'
  });
});

// Project Proposals
router.get('/project-proposals', (req, res) => {
  res.render(PATH + 'project_proposals', {
    document_title: 'Project Proposals',
    active_topbar_tab: active_topbar,
    active_sidebar_tab: 'Project Proposals',
    sidebar: sidebar,
    name: 'Ssam Jan Doe',
    role: 'Extensionist'
  });
});


// Project Details
router.get('/project-proposals/:project_id', (req, res) => {
  res.render(PATH + 'project_details', {
    document_title: 'Project Details',
    active_topbar_tab: active_topbar,
    active_sidebar_tab: 'Project Proposals',
    sidebar: sidebar,
    name: 'Ssam Jan Doe',
    role: 'Extensionist'
  });
});

// Export module
module.exports = router; 