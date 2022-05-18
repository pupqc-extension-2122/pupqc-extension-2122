// Import Router from express
const router = require('express').Router();
const PATH = 'content/extensionist/'

// * Routes

// Dashboard
router.get('/', (req, res) => {
  res.render(PATH + 'dashboard', {
      document_title: 'Dashboard',
      active_sidebar_tab: 'dashboard',
      sidebar: 'extensionist_sidebar',
      name: 'Ssam Jan Doe',
      role: 'Extensionist'
  });
});

// Project Proposals
router.get('/project-proposals', (req, res) => {
  res.render(PATH + 'project_proposals', {
      document_title: 'Project Proposals',
      active_sidebar_tab: 'dashboard',
      sidebar: 'extensionist_sidebar',
      name: 'Ssam Jan Doe',
      role: 'Extensionist'
  })
});

// Export module
module.exports = router; 