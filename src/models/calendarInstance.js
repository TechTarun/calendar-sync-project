const { Calendar } = require('./calendar');

const googleCalendar = new Calendar();
const outlookCalendar = new Calendar();
const icalCalendar = new Calendar();

module.exports = {
  googleCalendar,
  outlookCalendar,
  icalCalendar,
};