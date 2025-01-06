const { getOutlookCalendarEvents } = require('../src/controllers/outlookCalendarController');
const { mockOutlookCalendar } = require('../src/mocks');

describe('Outlook Calendar Controller', () => {
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
});