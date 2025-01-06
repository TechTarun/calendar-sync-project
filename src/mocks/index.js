const mockGoogleCalendar = {
  "gcal-1": [
    {
      eventId: "g-1",
      summary: "Team Meeting",
      start: { dateTime: "2025-01-04T10:00:00Z" },
      end: { dateTime: "2025-01-04T11:00:00Z" },
      attendees: ["user-1", "user-2"]
    }
  ]};
  
  const mockOutlookCalendar = {
    "outlook-cal-1": [
    {
      id: "o-1",
      subject: "Client Call",
      start: "2025-01-04T12:00:00Z",
      end: "2025-01-04T13:00:00Z",
      participants: ["user-1"]
    }
  ]};
  
  const mockICal = {
    "ical-1": [
    {
      UID: "ical-1",
      SUMMARY: "Project Kickoff",
      DTSTART: "20250104T090000Z",
      DTEND: "20250104T100000Z",
      ATTENDEES: ["user-1", "user-3"]
    }
  ]};

  module.exports = {
    mockGoogleCalendar,
    mockOutlookCalendar,
    mockICal,
  };