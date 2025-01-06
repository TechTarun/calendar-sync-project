const { Auth } = require('./auth');
const { Event } = require('./event');
const axios = require('axios');

class Calendar {
  constructor() {
    this.calendars = {}; // Store events by calendarId
  }

  addEvent(calendarId, event) {
    if (!this.calendars[calendarId]) {
      this.calendars[calendarId] = [];
    }

    const conflict = this.calendars[calendarId].find(
      (e) => event.startTime < e.endTime && event.endTime > e.startTime
    );

    if (conflict) {
      console.log(
        `Conflict Detected: ${event.title} overlaps with ${conflict.title} in calendar ${calendarId}`
      );
      const suggestions = this.suggestTimeSlots(calendarId, event);
      console.log(`Suggested Time Slots for ${event.title}:`, suggestions);
      return;
    }

    this.calendars[calendarId].push(event);
    console.log(`Added Event: ${event.title} to calendar ${calendarId}`);
  }

  suggestTimeSlots(calendarId, event) {
    const workHoursStart = "09:00:00";
    const workHoursEnd = "18:00:00";
    const existingEvents = this.calendars[calendarId].sort(
      (a, b) => new Date(a.startTime) - new Date(b.startTime)
    );

    let suggestions = [];
    let previousEnd = new Date(`${event.startTime.split('T')[0]}T${workHoursStart}Z`);
    const endOfDay = new Date(`${event.startTime.split('T')[0]}T${workHoursEnd}Z`);

    for (const existingEvent of existingEvents) {
      const currentStart = new Date(existingEvent.startTime);

      if (previousEnd < currentStart) {
        suggestions.push({
          start: previousEnd.toISOString(),
          end: currentStart.toISOString()
        });
      }

      previousEnd = new Date(existingEvent.endTime);
    }

    if (previousEnd < endOfDay) {
      suggestions.push({
        start: previousEnd.toISOString(),
        end: endOfDay.toISOString()
      });
    }

    return suggestions;
  }

  async syncWithExternalCalendar(calendarId, provider) {
    let attempt = 0;
    const maxRetries = 3;

    while (attempt < maxRetries) {
      try {
        const accessToken = Auth.getAccessToken();
        let url;
        switch (provider) {
          case 'google':
            url = `http://localhost:3000/google-calendar/events?calendarId=${calendarId}`;
            break;
          case 'outlook':
            url = `http://localhost:3000/outlook-calendar/events?calendarId=${calendarId}`;
            break;
          case 'ical':
            url = `http://localhost:3000/ical/events?calendarId=${calendarId}`;
            break;
          default:
            console.error('Unknown provider');
            return;
        }

        console.log(`Fetching ${provider} events for calendarId: ${calendarId}`);
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const events = response.data.map((data) => Event.fromProviderData(data, provider));

        events.forEach((event) => this.addEvent(calendarId, event));
        console.log(`Successfully synced events for calendar ${calendarId} from ${provider}`);
        break; // Exit loop on success
      } catch (error) {
        attempt++;
        if (attempt >= maxRetries) {
          console.error(`Error syncing calendar ${calendarId} after ${maxRetries} attempts: ${error.message}`);
        } else {
          console.warn(`Retrying... Attempt ${attempt} of ${maxRetries}`);
        }
      }
    }
  }
}

module.exports = { Calendar };