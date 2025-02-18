const express = require('express');
const authRoutes = require('./routes/authRoutes');
const googleCalendarRoutes = require('./routes/googleCalendarRoutes');
const outlookCalendarRoutes = require('./routes/outlookCalendarRoutes');
const icalRoutes = require('./routes/icalRoutes');
const calendarRoutes = require('./routes/calendarRoutes');

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/google-calendar', googleCalendarRoutes);
app.use('/outlook-calendar', outlookCalendarRoutes);
app.use('/ical', icalRoutes);
app.use('/calendar', calendarRoutes);

module.exports = app;