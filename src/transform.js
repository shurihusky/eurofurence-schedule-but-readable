import { calculateEndTime, getPreviousDay, getWeekdayFromDate } from './utils.js';

/**
 * The base URL for event details.
 * @type {string}
 */
const eventDetailsBaseUrl = "https://www.eurofurence.org/EF28/schedule/events/";

/**
 * Parses the event data from the provided event XML.
 * 
 * @param {string} eventXML - The XNL content of the events.
 * @returns {Array} - An array of event objects.
 */
function parseEventXMLData(eventXML) {
  if (!eventXML || !eventXML.schedule) {
    console.error('No event data found.');
    return [];
  }
  const events = [];
  let days = eventXML.schedule.day;
  days.forEach(day => {
    let dayName = getWeekdayFromDate(day.date[0]);

    day.room.forEach(room => {
      let roomName = room.name[0];

      if (room.event) {
        room.event.forEach(event => {
          let eventId = event.id[0];
          let link = eventDetailsBaseUrl + eventId + ".en.html";
          let time = event.start[0];
          let duration = event.duration[0];
          let title = event.title[0];
          let subtitle = event.subtitle ? event.subtitle[0] : '';
          let description = event.description ? event.description[0] : '';
          let type = event.type ? event.type[0] : '';
          let track = event.track ? event.track[0] : '';
          let endTime = calculateEndTime(time, duration);
          let language = event.language ? event.language[0] : '';
          let links = event.link ? event.link : [];
          let speaker = event.persons ? event.persons?.[0]?.person?.[0]?._ : [];

          events.push({
            day: dayName,
            time,
            duration,
            endTime,
            room: roomName,
            title,
            description,
            link,
            subtitle,
            speaker,
            language,
            type,
            track,
            links,
          });
        });
      }
    })
  });

  return events;
}

function reboxDays(allEvents) {
  const dayMap = new Map([
    ['Tue', []],
    ['Wed', []],
    ['Thu', []],
    ['Fri', []],
    ['Sat', []],
    ['Sun', []],
    ['Mon', []],
  ]);

  allEvents.forEach(event => {
    const eventStartHour = Number(event.time.split(':')[0]); // type: string
    const eventEndHour = Number(event.endTime.split(':')[0]); // type: string

    // Check if the event runs past midnight (e.g. 23:00 - 01:00), then do nothing
    if (eventEndHour < eventStartHour) {
      dayMap.get(event.day).push(event);
      return;
    }

    // Check if the event starts after 0:00 and before 6:00, then it's a late night event of the previous day
    if (eventStartHour > 0 && eventStartHour < 6) {
      const previousDay = getPreviousDay(event.day);
      const copiedEvent = { ...event }; // make a copy of the event object
      copiedEvent.day = previousDay;
      dayMap.get(previousDay).push(copiedEvent);
      return;
    }

    // If the event starts exactly at 0:00, it might be a new late night event of the previous day or a cut-off snippet of an event from the previous day
    if (eventStartHour === 0) {
      // let's check if there is an event of the previous day with the same link (i.e. same event id)
      const previousDay = getPreviousDay(event.day);
      const previousDayEvents = allEvents.filter(e => e.day === previousDay && e.link === event.link);
      if (previousDayEvents.length > 0) {
        // We found a matching event, so this is a cut-off snippet we can ignore
        return;
      }
      // No matching event found, so this is a new late night event
      const copiedEvent = { ...event }; // make a copy of the event object
      copiedEvent.day = previousDay;
      dayMap.get(previousDay).push(copiedEvent);
      return;
    }

    // we should have covered all cases. any other event should be added to the current day
    dayMap.get(event.day).push(event);
    return;
  });

  // // Remove duplicate events starting at 0:00 in the next day
  // dayMap.forEach((events, day) => {
  //     const filteredEvents = events.filter(event => {
  //         const startDate = new Date(`1970-01-01T${event.time}:00`);
  //         return !(startDate.getHours() === 0 && startDate.getMinutes() === 0 && day !== event.day);
  //     });
  //     dayMap.set(day, filteredEvents);
  // });

  return dayMap;
}

export { parseEventXMLData, reboxDays };