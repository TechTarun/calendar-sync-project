const express = require('express');
const { getOutlookCalendarEvents } = require('../controllers/outlookCalendarController');

const router = express.Router();

router.get('/events', getOutlookCalendarEvents);

module.exports = router;