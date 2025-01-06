const { mockICalEvents } = require('../mocks');

const getICalEvents = (req, res) => {
  const calendarId = req.query.calendarId;
  res.json(mockICalEvents);
};

module.exports = {
  getICalEvents,
};