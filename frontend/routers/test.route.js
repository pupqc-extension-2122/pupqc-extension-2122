const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('content/test', {
    layout: './layouts/test',
    document_title: 'Test',
  })
});

module.exports = router;
