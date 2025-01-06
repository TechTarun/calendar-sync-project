const express = require('express');
const { getOutlookCalendarEvents, addOutlookCalendarEvent } = require('../controllers/outlookCalendarController');

const router = express.Router();

router.get('/events', getOutlookCalendarEvents);
router.post('/add-event', addOutlookCalendarEvent);

module.exports = router;