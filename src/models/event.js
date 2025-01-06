class Event {
  constructor(eventId, title, startTime, endTime, participants) {
    this.eventId = eventId;
    this.title = title;
    this.startTime = startTime;
    this.endTime = endTime;
    this.participants = participants;
  }

  static fromProviderData(data, provider) {
    switch (provider) {
      case 'google':
        return new Event(
          data.eventId,
          data.summary,
          data.start.dateTime,
          data.end.dateTime,
          data.attendees
        );
      case 'outlook':
        return new Event(
          data.id,
          data.subject,
          data.start,
          data.end,
          data.participants
        );
      case 'ical':
        return new Event(
          data.UID,
          data.SUMMARY,
          data.DTSTART,
          data.DTEND,
          data.ATTENDEES
        );
    }
  }
}

  module.exports = { Event };