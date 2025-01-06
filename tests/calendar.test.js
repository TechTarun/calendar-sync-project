// Test Cases for Calendar Integration

const { Calendar } = require('../src/models/calendar');
const { Event } = require('../src/models/event');
const { Auth } = require('../src/models/auth');

const axios = require('axios');
jest.mock('axios');

describe('Calendar Integration Example Workflow', () => {
  let calendar;

  beforeEach(() => {
    calendar = new Calendar();
    jest.clearAllMocks();
  });

  test('should sync events, detect conflicts, and suggest time slots', async () => {
    // Mock API responses
    axios.get.mockImplementation((url) => {
      if (url.includes('google-calendar')) {
        return Promise.resolve({
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
      }
      if (url.includes('outlook-calendar')) {
        return Promise.resolve({
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
      }
      return Promise.reject(new Error('Unknown provider'));
    });

    console.log = jest.fn();

    // Initial local event
    const localEvent = new Event(
      'local-1',
      'Project Discussion',
      '2025-01-04T10:30:00Z',
      '2025-01-04T11:30:00Z',
      ['user-1', 'user-3']
    );
    calendar.addEvent('calendar-1', localEvent);

    // Sync with external calendars
    await calendar.syncWithExternalCalendar('calendar-1', 'google');
    await calendar.syncWithExternalCalendar('calendar-1', 'outlook');

    // Check logs for added events and conflicts
    expect(console.log).toHaveBeenCalledWith(
      'Fetching google events for calendarId: calendar-1'
    );
    expect(console.log).toHaveBeenCalledWith(
      'Conflict Detected: Team Meeting overlaps with Project Discussion in calendar calendar-1'
    );
    expect(console.log).toHaveBeenCalledWith(
      'Suggested Time Slots for Team Meeting:', expect.any(Array)
    );
    expect(console.log).toHaveBeenCalledWith(
      'Successfully synced events for calendar calendar-1 from google'
    );
    expect(console.log).toHaveBeenCalledWith(
      'Fetching outlook events for calendarId: calendar-1'
    );
    expect(console.log).toHaveBeenCalledWith(
      'Added Event: Client Call to calendar calendar-1'
    );
    expect(console.log).toHaveBeenCalledWith(
      'Successfully synced events for calendar calendar-1 from outlook'
    );

    // Ensure the final state of the calendar is as expected
    expect(calendar.calendars['calendar-1'].length).toBe(2);
  });
});

