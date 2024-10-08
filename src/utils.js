/**
 * Calculates the end time based on the start time and duration.
 *
 * @param {string} startTime - The start time in the format 'HH:mm'.
 * @param {number} duration - The duration in the format 'HH:mm'.
 * @returns {string} The end time in the format 'HH:mm'.
 */
function calculateEndTime(startTime, duration) {
  const [hours, minutes] = startTime.split(':').map(Number);
  const [hoursDuration, minutesDuration] = duration.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);

  const endDate = new Date(startDate.getTime() + hoursDuration * 60 * 60 * 1000 + minutesDuration * 60 * 1000);

  const endHours = endDate.getHours().toString().padStart(2, '0');
  const endMinutes = endDate.getMinutes().toString().padStart(2, '0');

  return `${endHours}:${endMinutes}`;
}

/**
 * Formats the duration in minutes into a string representation of hours and minutes.
 *
 * @param {number} duration - The duration in minutes.
 * @returns {string} The formatted duration in the format "hours:minutes".
 */
function formatDuration(duration) {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Returns the next day of the week based on the given day.
 *
 * @param {string} day - The current day of the week.
 * @returns {string} - The next day of the week.
 */
function getNextDay(day) {
  const daysOfWeek = [
    "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
  ];
  const dayIndex = daysOfWeek.indexOf(day.split(' ')[0]);
  return daysOfWeek[(dayIndex + 1) % 7];
}

/**
 * Returns the previous day of the given day.
 *
 * @param {string} day - The day of the week.
 * @returns {string} - The previous day of the given day.
 */
function getPreviousDay(day) {
  const daysOfWeek = [
    "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
  ];
  const dayIndex = daysOfWeek.indexOf(day.split(' ')[0]);
  return daysOfWeek[(dayIndex - 1) % 7];
}

/**
 * Retrieves the available rooms from the given events.
 *
 * @param {Array<Object>} events - The array of events.
 * @returns {Array<string>} - The array of available rooms.
 */
function getAvailableRooms(events) {
  const rooms = new Set();
  events.forEach(event => {
    rooms.add(event.room);
  });
  return Array.from(rooms);;
}


/**
 * Retrieves the date corresponding to a given day.
 *
 * @param {string} day - The day of the week (e.g., "Tue").
 * @returns {string} The date in the format "YYYY-MM-DD".
 */
function getDateOfDay(day) {
  if (day === "Tue") return "2024-09-17";
  if (day === "Wed") return "2024-09-18";
  if (day === "Thu") return "2024-09-19";
  if (day === "Fri") return "2024-09-20";
  if (day === "Sat") return "2024-09-21";
  if (day === "Sun") return "2024-09-22";
  if (day === "Mon") return "2024-09-23";
}

/**
 * Returns the corresponding building for a given room.
 * 
 * @param {string} room - The name of the room.
 * @returns {string} The name of the building.
 */
function getBuilding(room) {
  if (room === undefined) return "idk man, something went wrong";
  if (room.includes("Outdoor")) return "Outdoor";
  if (room.includes("Lobby")) return "Ground Floor";
  if (room.includes("Check-In 1")) return "Ground Floor";
  if (room.includes("Check-In 2")) return "Ground Floor";
  if (room.includes("Hall H")) return "Ground Floor";
  if (room.includes("Hall 3")) return "Ground Floor";
  if (room.includes("Hall 4")) return "Ground Floor";
  if (room.includes("Foyer 4")) return "Ground Floor";
  if (room.includes("3+H")) return "Ground Floor";
  if (room.includes("Elbe")) return "Ground Floor";
  if (room.includes("Entrance")) return "Ground Floor";
  if (room.includes("Entrace")) return "Ground Floor";
  if (room.includes(" X")) return "1st Floor";
  if (room.includes("Hall A")) return "1st Floor";
  if (room.includes("Hall B")) return "1st Floor";
  if (room.includes("Hall C")) return "1st Floor";
  if (room.includes("Hall 5")) return "1st Floor";
  if (room.includes("Hall 6")) return "1st Floor";
  if (room.includes("Hall 7")) return "1st Floor";
  if (room.includes("Hall 8")) return "1st Floor";
  if (room.includes("Hall 9")) return "1st Floor";
  if (room.includes("Hall 10")) return "1st Floor";
  if (room.includes("Cloak")) return "1st Floor";
  if (room.includes(" Y")) return "2nd Floor";
  if (room.includes("Hall D")) return "2nd Floor";
  if (room.includes("Hall E")) return "2nd Floor";
  if (room.includes("Hall F")) return "2nd Floor";
  if (room.includes("Hall G")) return "2nd Floor";
  if (room.includes("Hall 1")) return "2nd Floor";
  if (room.includes("Rooftop Garden")) return "2nd Floor";
  if (room.includes(" Z")) return "3rd Floor";
  if (room.includes("Alster")) return "3rd Floor";
  if (room.includes("Hall Z")) return "3rd Floor";
  if (room.includes("Summerboat")) return "Other"

  return "idk man, something went wrong";
}

const buildingResources = [
  { id: "Ground Floor", title: "Ground Floor", childrenKeys: ["Hall H", "Hall 3", "Hall 4", "Foyer 4", "3+H", "Elbe", "Lobby", "Check-In 1", "Check-In 2", "Outdoor", "Entrance", "Entrace"] },
  { id: "1st Floor", title: "1st Floor", childrenKeys: ["Hall A", "Hall B", "Hall C", "Hall 5", "Hall 6", "Hall 7", "Hall 8", "Hall 9", "Hall 10", "Cloak"] },
  { id: "2nd Floor", title: "2nd Floor", childrenKeys: ["Hall D", "Hall E", "Hall F", "Hall G", "Hall 1", "Rooftop Garden"] },
  { id: "3rd Floor", title: "3rd Floor", childrenKeys: ["Alster", "Hall Z"] },
  { id: "Other", title: "Other", childrenKeys: ["Summerboat"] }
]

const enrichBuildingResources = (availableRooms) => {
  const enrichedResources = buildingResources.map(floor => {
    const enrichedChildren = [];

    availableRooms.forEach(room => {
      const building = getBuilding(room);
      if (building === floor.title) {
        enrichedChildren.push({ id: room, title: room });
      }
    });

    return {
      ...floor,
      children: enrichedChildren,
    };
  });

  // remove empty floors
  return enrichedResources.filter(floor => floor.children.length > 0);
};

function getEarliestStartTime(events) {
  let earliest = "23:59";
  events.forEach(event => {
    if (event.time < earliest) {
      earliest = event.time;
    }
  });
  if (earliest === "23:59") {
    return "09:00:00";
  }
  return `${Number(earliest.split(':')[0])}:00:00`;
}

function getLatestEndTime(events) {
  // Check if we have any end time between 00:00 and 04:00
  let latest = "00:00";
  events.forEach(event => {
    if (event.endTime < "04:00" && event.endTime > latest) {
      latest = event.endTime;
    }
  });
  if (latest !== "00:00") {
    return `${24 + Number(latest.split(':')[0]) + 1}:00:00`;
  }
  // If not, check if we have any end time between 04:00 and 08:00
  latest = "04:00";
  events.forEach(event => {
    if (event.endTime > latest) {
      latest = event.endTime;
    }
  });
  if (latest !== "04:00") {
    return `${Number(latest.split(':')[0]) + 1}:00:00`;
  }
  return "24:00:00";
}

function formatTimeForCalendar(time) {
  // events that go past midnight need to be formatted as e.g. 26:00 for 2am
  const hours = Number(time.split(':')[0]);
  const minutes = time.split(':')[1];
  if (hours < 6) {
    return `${hours + 24}:${minutes}`;
  }
  return time;
}

function getSimplerEventGroupList() {
  return ["EF", "Social", "Stage", "Music", "Fursuit", "Creative", "Games", "Other"];
}

function getSimplerEventGroupListStart() {
  return ["EF", "Social", "Stage", "Music", "Fursuit", "Creative", "Games", "Other"];
}

function getSimplerEventGrouping(event) {
  if (!event || !event.track) return "Other";
  // some special cases that don't fit the pattern in my opinion
  if (event.title === "Artists' Lounge") return "EF";
  if (event.title === "Fursuit Lounge") return "EF";

  // generic regrouping of events
  if (event.track === "EF-Services") return "EF";
  if (event.track === "Guest of Honor") return "Social";
  if (event.track === "Charity") return "Stage";
  if (event.track === "Supersponsor Event") return "EF";
  if (event.track === "Show") return "Stage";
  if (event.track === "Dance") return "Music";
  if (event.track === "Social & Meet") return "Social";
  if (event.track === "Fursuit") return "Fursuit";
  if (event.track === "Writing") return "Creative";
  if (event.track === "Creating Art") return "Creative";
  if (event.track === "Performance") return "Stage";
  if (event.track === "Games") return "Games";
  if (event.track === "Photography") return "Creative";
  if (event.track === "Misc.") return "Other";
  if (event.track === "Art Show") return "EF";
  if (event.track === "Dealers' Den") return "EF";
  if (event.track === "Music") return "Music";
  if (event.track === "Fandom") return "Social";
  return "Other";
}

function getSimpleEventColors(eventgroup) {
  if (eventgroup === "EF") return "#D1C5C0";
  if (eventgroup === "Social") return "#9370DB";
  if (eventgroup === "Stage") return "#37EBF3";
  if (eventgroup === "Music") return "#710000";
  if (eventgroup === "Fursuit") return "#1AC5B0";
  if (eventgroup === "Creative") return "#E455AE";
  if (eventgroup === "Games") return "#FDF500";
  if (eventgroup === "Other") return "#CB1DCD";
}

const groups = [
  { name: "EF", color: "#D1C5C0", contrastColor: "#000000" },
  { name: "Social", color: "#9370DB", contrastColor: "#000000" },
  { name: "Stage", color: "#37EBF3", contrastColor: "#000000" },
  { name: "Music", color: "#710000", contrastColor: "#FFFFFF" },
  { name: "Fursuit", color: "#1AC5B0", contrastColor: "#000000" },
  { name: "Creative", color: "#E455AE", contrastColor: "#000000" },
  { name: "Games", color: "#FDF500", contrastColor: "#000000" },
  { name: "Other", color: "#CB1DCD", contrastColor: "#FFFFFF" },
]

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const getGroup = (name) => groups.find(group => group.name === name);

const getWeekdayFromDate = (date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })

export {
  calculateEndTime,
  formatDuration,
  getNextDay,
  getPreviousDay,
  getAvailableRooms,
  enrichBuildingResources,
  getDateOfDay,
  getBuilding,
  getEarliestStartTime,
  getLatestEndTime,
  formatTimeForCalendar,
  getSimplerEventGroupList,
  getSimplerEventGroupListStart,
  getSimplerEventGrouping,
  getSimpleEventColors,
  groups,
  getGroup,
  getWeekdayFromDate,
  modalStyle,
};
