const { getOutlookCalendarEvents, addOutlookCalendarEvent } = require('../src/controllers/outlookCalendarController');
const { mockOutlookCalendar } = require('../src/mocks');
const { outlookCalendar } = require('../src/models/calendarInstance');

describe('Outlook Calendar Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { query: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    outlookCalendar.calendars = {}; // Reset the calendar instance before each test
  });

  test('should return events for a valid calendarId', () => {
    req.query.calendarId = 'calendar-1';
    mockOutlookCalendar['calendar-1'] = [{ id: 'o-1', subject: 'Client Call' }];

    getOutlookCalendarEvents(req, res);

    expect(res.json).toHaveBeenCalledWith(mockOutlookCalendar['calendar-1']);
  });

  test('should return 404 for an invalid calendarId', () => {
    req.query.calendarId = 'invalid-calendar';

    getOutlookCalendarEvents(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Calendar ID not found' });
  });

  test('should add events to Outlook Calendar and verify they are stored in the same object', () => {
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

    addOutlookCalendarEvent(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Event added successfully' });

    req.body.event = {
      eventId: 'e-2',
      title: 'Event 2',
      startTime: '2025-01-05T10:00:00Z',
      endTime: '2025-01-05T11:00:00Z',
      attendees: ['user-2']
    };

    addOutlookCalendarEvent(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Event added successfully' });

    req.query.calendarId = 'calendar-1';
    getOutlookCalendarEvents(req, res);
    expect(res.json).toHaveBeenCalledWith([
      {
        id: 'e-1',
        subject: 'Event 1',
        start: '2025-01-04T10:00:00Z',
        end: '2025-01-04T11:00:00Z',
        participants: ['user-1']
      },
      {
        id: 'e-2',
        subject: 'Event 2',
        start: '2025-01-05T10:00:00Z',
        end: '2025-01-05T11:00:00Z',
        participants: ['user-2']
      }
    ]);
  });
});