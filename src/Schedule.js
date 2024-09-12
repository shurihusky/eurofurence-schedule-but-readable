import React from 'react';
import FullCalendar from '@fullcalendar/react';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import {
  getAvailableRooms,
  getDateOfDay,
  getBuilding,
  enrichBuildingResources,
  getEarliestStartTime,
  getLatestEndTime,
  formatTimeForCalendar,
  getSimplerEventGrouping,
  getSimpleEventColors,
} from './utils.js';
import Box from '@mui/material/Box';
import './schedule.css';
import { Typography } from '@mui/material';

const Schedule = ({
  day,
  filteredGroups,
  events,
}) => {
  console.log("in events", events);
  console.log("lol", enrichBuildingResources(getAvailableRooms(events)));
  return (
    <Box>
      <h1>Event List</h1>
      <Box key={day}>
        <h2>{`${day}  (${getDateOfDay(day)})`}</h2>
        {events && events.length > 0 &&
          <FullCalendar
            schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
            plugins={[resourceTimelinePlugin]}
            headerToolbar={false}
            // resourceGroupField="building"
            resourceAreaWidth="20%"
            nowIndicator={true}
            slotMinTime={getEarliestStartTime(events)}
            slotMaxTime={getLatestEndTime(events)}
            locale="en-GB"
            initialView="resourceTimeline"
            aspectRatio={2.5}
            resourceAreaHeaderContent="Rooms"
            visibleRange={{
              start: getDateOfDay(day),
              end: getDateOfDay(day),
            }}
            // expandRows={true}
            // eventMaxStack={1}
            // title={`${getDateOfDay(day)}`}
            now={"2024-09-19T15:00:00"} // FIXME: Use actual current time
            slotDuration={'00:30'}
            slotLabelInterval={'00:30'}
            slotLabelFormat={[{ hour: 'numeric', meridiem: false }, { hour: 'numeric', minute: '2-digit', meridiem: false }]}
            // resources={getAvailableRooms(events).map(room => ({ id: room, title: room, building: getBuilding(room) }))}
            resources={enrichBuildingResources(getAvailableRooms(events))}
            events={events.map((event, index) => ({
              id: index,
              title: event.title,
              start: `${getDateOfDay(day)}T${formatTimeForCalendar(event.time)}`,
              end: `${getDateOfDay(day)}T${formatTimeForCalendar(event.endTime)}`,
              resourceId: event.room,
              // building: getBuilding(event.room),
              url: event.link,
              // color: event.room === 'Main Stage' ? 'red' : 'blue',
            }))}
            eventContent={(eventInfo) => {
              const now = new Date("2024-09-19T15:00:00"); // FIXME: Use actual current time
              return (
                <Box sx={{
                  backgroundColor: eventInfo.event.end < now ? 'grey' : getSimpleEventColors(getSimplerEventGrouping(events[eventInfo.event.id])),
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '5px',
                }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{eventInfo.event.title}</Typography>
                    {events[eventInfo.event.id].subtitle && <Typography variant="overline" sx={{ fontStyle: 'cursive', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '9px' }}>{events[eventInfo.event.id].subtitle}</Typography>}
                  </Box>
                </Box >
              );
            }}
          />
        }
      </Box >
    </Box >
  );

};

export default Schedule;