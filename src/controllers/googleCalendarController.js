const { mockGoogleCalendar } = require('../mocks');

const getGoogleCalendarEvents = (req, res) => {
  const calendarId = req.query.calendarId;

  if (!mockGoogleCalendar[calendarId]) {
    return res.status(404).json({ error: 'Calendar ID not found' });
  }

  res.json(mockGoogleCalendar[calendarId]);
};

module.exports = {
  getGoogleCalendarEvents,
};