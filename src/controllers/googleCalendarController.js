const { mockGoogleCalendar } = require('../mocks');
const { googleCalendar } = require('../models/calendarInstance');
const { Event } = require('../models/event');

const getGoogleCalendarEvents = (req, res) => {
  const calendarId = req.query.calendarId;

  if (googleCalendar.calendars[calendarId]) {
    return res.json(googleCalendar.calendars[calendarId].map(event => event.toProviderData('google')));
  }

  if (!mockGoogleCalendar[calendarId]) {
    return res.status(404).json({ error: 'Calendar ID not found' });
  }

  res.json(mockGoogleCalendar[calendarId]);
};

const addGoogleCalendarEvent = (req, res) => {
  const { calendarId, event } = req.body;

  if (!calendarId || !event) {
    return res.status(400).json({ error: 'calendarId and event are required' });
  }

  const newEvent = new Event(event.eventId, event.title, event.startTime, event.endTime, event.attendees);
  response = googleCalendar.addEvent(calendarId, newEvent);

  if (response.conflict) {
    return res.status(409).json({
      error: 'Event conflicts with existing event',
      conflict: response.conflict,
      suggestions: response.suggestions,
    });
  } else {
    return res.status(201).json({ message: 'Event added successfully' });
  }
};

module.exports = {
  getGoogleCalendarEvents,
  addGoogleCalendarEvent,
};