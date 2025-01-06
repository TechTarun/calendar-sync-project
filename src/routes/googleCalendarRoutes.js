const express = require('express');
const { getGoogleCalendarEvents, addGoogleCalendarEvent } = require('../controllers/googleCalendarController');

const router = express.Router();

router.get('/events', getGoogleCalendarEvents);
router.post('/add-event', addGoogleCalendarEvent);

module.exports = router;