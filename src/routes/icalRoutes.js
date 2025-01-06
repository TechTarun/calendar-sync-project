const express = require('express');
const { getICalEvents } = require('../controllers/icalController');

const router = express.Router();

router.get('/events', getICalEvents);

module.exports = router;