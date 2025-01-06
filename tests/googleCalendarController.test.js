const { getGoogleCalendarEvents, addGoogleCalendarEvent } = require('../src/controllers/googleCalendarController');
const { mockGoogleCalendar } = require('../src/mocks');
const { googleCalendar } = require('../src/models/calendarInstance');

describe('Google Calendar Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { query: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    googleCalendar.calendars = {}; // Reset the calendar instance before each test
  });

  test('should return events for a valid calendarId', () => {
    req.query.calendarId = 'calendar-1';
    mockGoogleCalendar['calendar-1'] = [{ eventId: 'g-1', summary: 'Team Meeting' }];

    getGoogleCalendarEvents(req, res);

    expect(res.json).toHaveBeenCalledWith(mockGoogleCalendar['calendar-1']);
  });

  test('should return 404 for an invalid calendarId', () => {
    req.query.calendarId = 'invalid-calendar';

    getGoogleCalendarEvents(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Calendar ID not found' });
  });

  test('should add events to Google Calendar and verify they are stored in the same object', () => {
    req.body = {
      calendarId: 'calendar-1',
      event: {
        eventId: 'e-1',
        title: 'Event 1',
        startTime: '2025-01-04T10:00:00Z',
        endTime: '2025-01-04T11:00:00Z',
        attendees: ['user-1']
      }
    };

    addGoogleCalendarEvent(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Event added successfully' });

    req.body.event = {
      eventId: 'e-2',
      title: 'Event 2',
      startTime: '2025-01-05T10:00:00Z',
      endTime: '2025-01-05T11:00:00Z',
      attendees: ['user-2']
    };

    addGoogleCalendarEvent(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Event added successfully' });

    req.query.calendarId = 'calendar-1';
    getGoogleCalendarEvents(req, res);
    expect(res.json).toHaveBeenCalledWith([
      {
        eventId: 'e-1',
        summary: 'Event 1',
        start: { dateTime: '2025-01-04T10:00:00Z' },
        end: { dateTime: '2025-01-04T11:00:00Z' },
        attendees: ['user-1']
      },
      {
        eventId: 'e-2',
        summary: 'Event 2',
        start: { dateTime: '2025-01-05T10:00:00Z' },
        end: { dateTime: '2025-01-05T11:00:00Z' },
        attendees: ['user-2']
      }
    ]);
  });
});