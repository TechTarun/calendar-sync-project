const express = require('express');
const { getGoogleCalendarEvents } = require('../controllers/googleCalendarController');

const router = express.Router();

router.get('/events', getGoogleCalendarEvents);

module.exports = router;