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
      default:
        throw new Error('Unknown provider');
    }
  }

  toProviderData(provider) {
    switch (provider) {
      case 'google':
        return {
          eventId: this.eventId,
          summary: this.title,
          start: { dateTime: this.startTime },
          end: { dateTime: this.endTime },
          attendees: this.participants
        };
      case 'outlook':
        return {
          id: this.eventId,
          subject: this.title,
          start: this.startTime,
          end: this.endTime,
          participants: this.participants
        };
      case 'ical':
        return {
          UID: this.eventId,
          SUMMARY: this.title,
          DTSTART: this.startTime,
          DTEND: this.endTime,
          ATTENDEES: this.participants
        };
      default:
        throw new Error('Unknown provider');
    }
  }
}

module.exports = { Event };