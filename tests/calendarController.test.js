const { syncWithExternalCalendar } = require('../src/controllers/calendarController');
const axios = require('axios');
jest.mock('axios');

describe('Calendar Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  test('should sync events with Google Calendar', async () => {
    req.body = {
      calendarId: 'calendar-1',
      provider: 'google'
    };

    axios.get.mockResolvedValue({
      data: [
        {
          eventId: 'g-1',
          summary: 'Team Meeting',
          start: { dateTime: '2025-01-04T10:00:00Z' },
          end: { dateTime: '2025-01-04T11:00:00Z' },
          attendees: ['user-1', 'user-2']
        }
      ]
    });

    await syncWithExternalCalendar(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Sync completed successfully' });
  });

  test('should sync events with Outlook Calendar', async () => {
    req.body = {
      calendarId: 'calendar-1',
      provider: 'outlook'
    };

    axios.get.mockResolvedValue({
      data: [
        {
          id: 'o-1',
          subject: 'Client Call',
          start: '2025-01-04T12:00:00Z',
          end: '2025-01-04T13:00:00Z',
          participants: ['user-1']
        }
      ]
    });

    await syncWithExternalCalendar(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Sync completed successfully' });
  });

  test('should sync events with iCal', async () => {
    req.body = {
      calendarId: 'calendar-1',
      provider: 'ical'
    };

    axios.get.mockResolvedValue({
      data: [
        {
          UID: 'ical-1',
          SUMMARY: 'Project Kickoff',
          DTSTART: '20250104T090000Z',
          DTEND: '20250104T100000Z',
          ATTENDEES: ['user-1', 'user-3']
        }
      ]
    });

    await syncWithExternalCalendar(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Sync completed successfully' });
  });

  test('should return 400 for unknown provider', async () => {
    req.body = {
      calendarId: 'calendar-1',
      provider: 'unknown'
    };

    await syncWithExternalCalendar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unknown provider' });
  });

  test('should return 400 for missing calendarId or provider', async () => {
    req.body = {
      provider: 'google'
    };

    await syncWithExternalCalendar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'calendarId and provider are required' });

    req.body = {
      calendarId: 'calendar-1'
    };

    await syncWithExternalCalendar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'calendarId and provider are required' });
  });
});