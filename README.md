# Calendar Integration and Event Sync

This project simulates the integration of various external calendar services (Google Calendar, Outlook Calendar, iCal) and synchronizes their events with a local calendar. It demonstrates clean code architecture using OOP principles, proper error handling, and conflict detection during event synchronization.

## Features

### Mock API Setup:
- Endpoints for mock calendar services:
  - `GET /google-calendar/events`
  - `GET /outlook-calendar/events`
  - `GET /ical/events`
  
- Endpoints for mock authentication:
  - `POST /auth/token`
  - `POST /auth/refresh`

### Calendar Class:
- `addEvent`: Adds an event to the local calendar after checking for conflicts.
- `syncWithExternalCalendar`: Fetches events from an external provider, normalizes them, and adds them to the local calendar.

### Event class
- `fromProviderData`: Converts events from various providers into a common format.

### Conflict Detection:
- Detects overlapping events.
- Logs conflicts and skips conflicting events.
- Suggests time slots for rescheduling conflicting calls.

## Getting Started

### Prerequisites
- Node.js (v14 or later)

### Install dependencies

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/calendar-sync-project.git
    cd calendar-sync-project
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

### Run the server

Start the mock server:
```bash
npm start
```

### Run tests

Execute the test cases:
```bash
npm test
```

## Testing the APIs
- Fetch Events (GET): `http://localhost:3000/ical/events?calendarId=<calendarId>`
    - Return events with 200 status if calendar ID is found
    - Return 404 status with error message if calendar ID is not found

## Error Handling Scenarios

- `Network Errors`: If there is a network error while fetching events from an external calendar, the system will retry up to 3 times before logging an error message and aborting the sync process.
- `Conflict Detection`: When adding an event, if there is a conflict with an existing event, the system will log a conflict message and suggest alternative time slots.
- `Invalid Provider`: If an unknown provider is specified for syncing, the system will log an error message and abort the sync process.

## Test Cases for Code Validation
The project includes comprehensive test cases to validate the functionality of the calendar integration and event sync.

### Test Cases:
1. Add Event Without Conflicts:
    - Adds a new event to the local calendar and verifies that it is added successfully without conflicts.

2. Detect Conflict and Skip Adding Event:
    - Attempts to add an event that conflicts with an existing event and verifies that the conflict is detected and the event is not added.

3. Remove Existing Event:
    - Adds an event to the local calendar, removes it, and verifies that it is removed successfully.

4. Update Existing Event:
    - Adds an event to the local calendar, updates it, and verifies that the event is updated successfully.

5. Sync with External Calendar:
    - Mocks API responses for external calendar events, syncs events with the local calendar, and verifies that events are added or conflicts are detected as expected.

### Example Test Case:
```bash
// Test Cases for Calendar Integration

const { Calendar } = require('../src/models/calendar');
const { Event } = require('../src/models/event');
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
      if (url.includes('ical')) {
        return Promise.resolve({
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
```

## Challenges Faced

Project is surely very interesting and since I am working in Node.js after a little while, its fun to do as well since I have learned a lot!

I have structured the project in a manner that is following `Object-Oriented design principles` throughout the code.
Writing test cases in this project is also a learning experience.

So initially structuring and planing the task was surely a challenge, but then it was very fun during implementation.

