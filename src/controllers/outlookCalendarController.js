const { mockOutlookCalendar } = require('../mocks');

const getOutlookCalendarEvents = (req, res) => {
  const calendarId = req.query.calendarId;
  if (!mockOutlookCalendar[calendarId]) {
    return res.status(404).json({ error: 'Calendar ID not found' });
  }

  res.json(mockOutlookCalendar[calendarId]);
};

module.exports = {
  getOutlookCalendarEvents,
};