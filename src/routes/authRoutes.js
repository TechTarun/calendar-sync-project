const express = require('express');
const { generateToken, refreshToken } = require('../controllers/authController');

const router = express.Router();

router.post('/token', generateToken);
router.post('/refresh', refreshToken);

module.exports = router;