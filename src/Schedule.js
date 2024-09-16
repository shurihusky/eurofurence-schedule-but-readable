import React, { useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import {
  getAvailableRooms,
  getDateOfDay,
  getEarliestStartTime,
  getLatestEndTime,
  formatTimeForCalendar,
  getSimplerEventGrouping,
  getSimpleEventColors,
  getGroup,
  getBuilding,
} from './utils.js';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import './schedule.css';
import { Typography } from '@mui/material';
import EventModal from './EventModal.js';
import GoogleIcon from '@mui/icons-material/Google';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import ParkIcon from '@mui/icons-material/Park';
import Popover from '@mui/material/Popover';

const Schedule = ({
  day,
  filteredGroups,
  events,
  zoom,
  currentTime,
  roomWidth,
}) => {
  const [filteredEvents, setFilteredEvents] = React.useState([]);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const [popoverState, setPopoverState] = React.useState({ anchorEl: null, resource: null });

  const handleDetailsOpen = () => setDetailsOpen(true);
  const handleDetailsClose = () => setDetailsOpen(false);

  const handleClick = (event, resource) => {
    setPopoverState({ anchorEl: event.currentTarget, resource });
  };

  const handleClose = () => {
    setPopoverState({ anchorEl: null, resource: null });
  };

  useEffect(() => {
    let filteredEvents = events.filter(event => {
      return filteredGroups.includes(getGroup(getSimplerEventGrouping(event)).name);
    });
    setFilteredEvents(filteredEvents);
  }, [events, filteredGroups]);


  return (
    <Box>
      {selectedEvent && filteredEvents[selectedEvent?.id] &&
        <EventModal event={filteredEvents[selectedEvent?.id]} open={detailsOpen} onClose={handleDetailsClose} />
      }
      <Box key={day} sx={{
        height: '70vh',
      }}>
        {filteredEvents && filteredEvents.length > 0 &&
          <FullCalendar
            schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
            plugins={[resourceTimelinePlugin]}
            headerToolbar={false}
            resourceAreaWidth={`${roomWidth}%`}
            nowIndicator={true}
            slotMinTime={getEarliestStartTime(filteredEvents)}
            slotMaxTime={getLatestEndTime(filteredEvents)}
            locale="en-GB"
            initialView="resourceTimeline"
            handleWindowResize={true}
            width="100%"
            height="100%"
            // aspectRatio={0.6}
            resourceAreaHeaderContent={`Rooms (${day})`}
            visibleRange={{
              start: getDateOfDay(day),
              end: getDateOfDay(day),
            }}
            // resourceLabelDidMount={info => {
            //   var questionMark = document.createElement('strong');
            //   questionMark.innerText = ' (?) ';

            //   info.el.querySelector('.fc-datagrid-cell-main')
            //     .appendChild(questionMark);

            //   var tooltip = new Tooltip(questionMark, {
            //     title: info.resource.title + '!!!',
            //     placement: 'top',
            //     trigger: 'hover',
            //     container: 'body'
            //   });
            // }}
            resourceLabelContent={(arg) => {
              const building = getBuilding(arg.resource.title);
              return (
                <>
                  <Tooltip title={building}>
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '30px !important' }} onClick={(event) => handleClick(event, arg.resource)}>
                      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {building === "Ground Floor" && <GoogleIcon sx={{ color: 'green' }} />}
                        {building === "1st Floor" && <LooksOneIcon sx={{ color: 'green' }} />}
                        {building === "2nd Floor" && <LooksTwoIcon sx={{ color: 'green' }} />}
                        {building === "Outdoor" && <ParkIcon sx={{ color: 'green' }} />}
                      </Box>
                      <Typography variant="overline">
                        {arg.resource.title}
                      </Typography>
                    </Box>
                  </Tooltip>
                </>
              );
            }}
            // expandRows={true}
            // eventMaxStack={1}
            // title={`${getDateOfDay(day)}`}
            // resourceGroupField="building"
            stickyHeaderDates={true}
            // now={currentTime}
            now={currentTime} // FIXME: buggy after midnight... but oh well https://github.com/fullcalendar/fullcalendar/issues/6394
            slotDuration={'00:30:00'} // Use '00:30:00' instead of '00:30'
            slotLabelInterval={'00:30'}
            slotLabelFormat={[{ hour: 'numeric', meridiem: false }, { minute: '2-digit', meridiem: false }]}
            slotMinWidth={zoom}
            resources={getAvailableRooms(filteredEvents).map(room => ({ id: room, title: room }))}
            // resources={getAvailableRooms(filteredEvents).map(room => ({ id: room, title: room, building: getBuilding(room) }))}
            // resources={enrichBuildingResources(getAvailableRooms(filteredEvents))}
            events={filteredEvents.map((event, index) => ({
              id: index,
              title: event.title,
              start: `${getDateOfDay(day)}T${formatTimeForCalendar(event.time)}`,
              end: `${getDateOfDay(day)}T${formatTimeForCalendar(event.endTime)}`,
              resourceId: event.room,
              // building: getBuilding(event.room),
              // url: event.link,
              // color: event.room === 'Main Stage' ? 'red' : 'blue',
            }))}
            eventContent={(eventInfo) => {
              const now = currentTime; // FIXME: Use actual current time
              return (
                <Box
                  sx={{
                    backgroundColor: eventInfo.event.end < now ? '#2F0743' : getSimpleEventColors(getSimplerEventGrouping(filteredEvents[eventInfo.event.id])),
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '5px',
                    border: '0.5px solid black',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setSelectedEvent(eventInfo.event);
                    handleDetailsOpen();
                  }}
                >
                  <Box sx={{
                    textAlign: 'center',
                    width: '100%',
                  }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 'bold',
                        fontStyle: 'cursive',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: eventInfo.event.end < now ? '#444' : getGroup(getSimplerEventGrouping(filteredEvents[eventInfo.event.id])).contrastColor,
                      }}
                    >
                      {eventInfo.event?.title}
                    </Typography>
                    {filteredEvents[eventInfo.event.id]?.subtitle &&
                      <Typography
                        // variant="overline"
                        sx={{
                          fontStyle: 'cursive',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontSize: '9px',
                          color: eventInfo.event.end < now ? '#444' : getGroup(getSimplerEventGrouping(filteredEvents[eventInfo.event.id])).contrastColor,
                        }}>
                        {filteredEvents[eventInfo.event.id]?.subtitle}
                      </Typography>}
                  </Box>
                </Box >
              );
            }}
          />
        }
        {filteredEvents && filteredEvents.length === 0 &&
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Typography variant="h4" component="h2">
              No events scheduled for this day
            </Typography>
          </Box>

        }
      </Box >
      <Popover
        open={Boolean(popoverState.anchorEl)}
        anchorEl={popoverState.anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography sx={{ p: 2 }}>{`${popoverState.resource?.title} (${getBuilding(popoverState.resource?.title)})`}</Typography>
      </Popover>
    </Box >
  );

};

export default Schedule;