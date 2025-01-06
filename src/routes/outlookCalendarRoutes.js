const express = require('express');
const { mockOutlookEvents } = require('../mocks');

const router = express.Router();

router.get('/events', (req, res) => {
  res.json(mockOutlookEvents);
});

module.exports = router;