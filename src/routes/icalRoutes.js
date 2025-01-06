const express = require('express');
const { getICalEvents, addICalEvent } = require('../controllers/icalController');

const router = express.Router();

router.get('/events', getICalEvents);
router.post('/add-event', addICalEvent);

module.exports = router;