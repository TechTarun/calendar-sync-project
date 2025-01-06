const { getICalEvents } = require('../src/controllers/icalController');
const { mockICal } = require('../src/mocks');

describe('iCal Controller', () => {
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
});