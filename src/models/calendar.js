const axios = require('axios');
const { Event } = require('./event');
const { Auth } = require('./auth');

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
        const suggestionStart = previousEnd;
        const suggestionEnd = currentStart;

        if (suggestionEnd - suggestionStart >= event.endTime - event.startTime) {
          suggestions.push({
            start: suggestionStart,
            end: suggestionEnd
          });
        }
      }

      previousEnd = new Date(existingEvent.endTime);
    }

    if (previousEnd < endOfDay) {
      suggestions.push({
        start: previousEnd,
        end: endOfDay
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

        events.forEach(event => this.addEvent(calendarId, event));

        console.log('Sync completed successfully.');
        return;
      } catch (error) {
        console.error('Error syncing with external calendar:', error);
        attempt++;
        if (attempt >= maxRetries) {
          console.error('Max retries reached. Sync failed.');
          return;
        }
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
}

module.exports = { Calendar };