const { mockOutlookEvents } = require('../mocks');

const getOutlookCalendarEvents = (req, res) => {
  const calendarId = req.query.calendarId;
  res.json(mockOutlookEvents);
};

module.exports = {
  getOutlookCalendarEvents,
};