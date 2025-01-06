const { googleCalendar, outlookCalendar, icalCalendar } = require('../models/calendarInstance');

const syncWithExternalCalendar = async (req, res) => {
  const { calendarId, provider } = req.body;

  if (!calendarId || !provider) {
    return res.status(400).json({ error: 'calendarId and provider are required' });
  }

  try {
    let calendar;
    switch (provider) {
      case 'google':
        calendar = googleCalendar;
        break;
      case 'outlook':
        calendar = outlookCalendar;
        break;
      case 'ical':
        calendar = icalCalendar;
        break;
      default:
        return res.status(400).json({ error: 'Unknown provider' });
    }
    await calendar.syncWithExternalCalendar(calendarId);
    res.status(200).json({ message: 'Sync completed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync with external calendar' });
  }
};

module.exports = {
  syncWithExternalCalendar,
};