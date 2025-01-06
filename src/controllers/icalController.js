const { mockICal } = require('../mocks');

const getICalEvents = (req, res) => {
  const calendarId = req.query.calendarId;
  if (!mockICal[calendarId]) {
    return res.status(404).json({ error: 'Calendar ID not found' });
  }

  res.json(mockICal[calendarId]);
};

module.exports = {
  getICalEvents,
};