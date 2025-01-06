const express = require('express');
const { syncWithExternalCalendar } = require('../controllers/calendarController');

const router = express.Router();

router.post('/sync', syncWithExternalCalendar);

module.exports = router;