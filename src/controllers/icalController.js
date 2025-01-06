const { mockICal } = require('../mocks');
const { icalCalendar } = require('../models/calendarInstance');
const { Event } = require('../models/event');

const getICalEvents = (req, res) => {
  const calendarId = req.query.calendarId;

  if (icalCalendar.calendars[calendarId]) {
    return res.json(icalCalendar.calendars[calendarId].map(event => event.toProviderData('ical')));
  }

  if (!mockICal[calendarId]) {
    return res.status(404).json({ error: 'Calendar ID not found' });
  }

  res.json(mockICal[calendarId]);
};

const addICalEvent = (req, res) => {
  const { calendarId, event } = req.body;

  if (!calendarId || !event) {
    return res.status(400).json({ error: 'calendarId and event are required' });
  }

  const newEvent = new Event(event.eventId, event.title, event.startTime, event.endTime, event.attendees);
  response = icalCalendar.addEvent(calendarId, newEvent);

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
  getICalEvents,
  addICalEvent,
};