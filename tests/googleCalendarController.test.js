const { getGoogleCalendarEvents } = require('../src/controllers/googleCalendarController');
const { mockGoogleCalendar } = require('../src/mocks');

describe('Google Calendar Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
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
});