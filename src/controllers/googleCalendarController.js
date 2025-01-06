const { mockGoogleEvents } = require('../mocks');

const getGoogleCalendarEvents = (req, res) => {
  const calendarId = req.query.calendarId;
  res.json(mockGoogleEvents);
};

module.exports = {
  getGoogleCalendarEvents,
};