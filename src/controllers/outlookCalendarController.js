const { mockOutlookCalendar } = require('../mocks');
const { outlookCalendar } = require('../models/calendarInstance');
const { Event } = require('../models/event');

const getOutlookCalendarEvents = (req, res) => {
  const calendarId = req.query.calendarId;

  if (outlookCalendar.calendars[calendarId]) {
    return res.json(outlookCalendar.calendars[calendarId].map(event => event.toProviderData('outlook')));
  }

  if (!mockOutlookCalendar[calendarId]) {
    return res.status(404).json({ error: 'Calendar ID not found' });
  }

  res.json(mockOutlookCalendar[calendarId]);
};

const addOutlookCalendarEvent = (req, res) => {
  const { calendarId, event } = req.body;

  if (!calendarId || !event) {
    return res.status(400).json({ error: 'calendarId and event are required' });
  }

  const newEvent = new Event(event.eventId, event.title, event.startTime, event.endTime, event.attendees);
  outlookCalendar.addEvent(calendarId, newEvent);

  res.status(201).json({ message: 'Event added successfully' });
};

module.exports = {
  getOutlookCalendarEvents,
  addOutlookCalendarEvent,
};