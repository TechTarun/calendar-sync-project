const { getICalEvents, addICalEvent } = require('../src/controllers/icalController');
const { mockICal } = require('../src/mocks');
const { icalCalendar } = require('../src/models/calendarInstance');

describe('iCal Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { query: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    icalCalendar.calendars = {}; // Reset the calendar instance before each test
  });

  test('should return events for a valid calendarId', () => {
    req.query.calendarId = 'calendar-1';
    mockICal['calendar-1'] = [{ UID: 'ical-1', SUMMARY: 'Project Kickoff' }];

    getICalEvents(req, res);

    expect(res.json).toHaveBeenCalledWith(mockICal['calendar-1']);
  });

  test('should return 404 for an invalid calendarId', () => {
    req.query.calendarId = 'invalid-calendar';

    getICalEvents(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Calendar ID not found' });
  });

  test('should add events to iCal and verify they are stored in the same object', () => {
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

    addICalEvent(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Event added successfully' });

    req.body.event = {
      eventId: 'e-2',
      title: 'Event 2',
      startTime: '2025-01-05T10:00:00Z',
      endTime: '2025-01-05T11:00:00Z',
      attendees: ['user-2']
    };

    addICalEvent(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Event added successfully' });

    req.query.calendarId = 'calendar-1';
    getICalEvents(req, res);
    expect(res.json).toHaveBeenCalledWith([
      {
        UID: 'e-1',
        SUMMARY: 'Event 1',
        DTSTART: '2025-01-04T10:00:00Z',
        DTEND: '2025-01-04T11:00:00Z',
        ATTENDEES: ['user-1']
      },
      {
        UID: 'e-2',
        SUMMARY: 'Event 2',
        DTSTART: '2025-01-05T10:00:00Z',
        DTEND: '2025-01-05T11:00:00Z',
        ATTENDEES: ['user-2']
      }
    ]);
  });
});