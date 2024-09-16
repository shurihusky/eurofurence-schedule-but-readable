import React, { useEffect, useState } from 'react';
import { parseEventXMLData, reboxDays } from './transform.js';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ButtonGroup from '@mui/material/ButtonGroup';
import Schedule from './Schedule.js';
import GroupButtonGroup from './GroupButtonGroup';
import Badge from '@mui/material/Badge';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  getSimplerEventGroupList,
  getSimplerEventGroupListStart,
  groups,
  getWeekdayFromDate,
  modalStyle,
} from './utils.js';
import { IconButton, Modal } from '@mui/material';
import EventModal from './EventModal.js';

const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    width: '100%',
    backgroundColor: '#37EBF3',
  }
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-selected': {
      color: '#37EBF3',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&.Mui-focusVisible': {
      backgroundColor: '#37EBF3',
    },
  }),
);

function Copyright() {
  return (
    <Typography
      variant="body2"
      align="center"
      sx={{
        color: 'text.secondary',
      }}
      my={4}
    >
      {'Information without guarantee | Made with ❤️ by '}
      <Link color="inherit" href="https://shurihusky.github.io/">
        ShuriHusky
      </Link>
      {' | '}
      <Link color="inherit" href="https://github.com/shurihusky/eurofurence-schedule-but-readable/">
        Source Code
      </Link>
      {' | '}
      <Link color="inherit" href="https://www.eurofurence.org/EF28/schedule/">
        Official Schedule
      </Link>
    </Typography>
  );
}

const App = () => {
  const [currentTime] = useState(new Date())
  // const [currentTime] = useState(new Date("2024-09-18T18:19:54.458Z")) // debug time
  const [day, setDay] = useState(0); // index of the selected day
  const [filteredGroups, setFilteredGroups] = useState(getSimplerEventGroupListStart());
  const [optionsOn, setOptionsOn] = useState(false);
  const [data, setData] = useState(null); // Raw unprocessed data
  const [events, setEvents] = useState(null); // Processed data
  const [zoomValue, setZoomValue] = React.useState(40);
  const [roomWidth, setRoomWidth] = React.useState(20);
  const [filtersOn] = React.useState(true); // setFiltersOn
  const [zoomOn] = React.useState(true); // setZoomOn
  const [searchOn, setSearchOn] = React.useState(false);
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [whyOpen, setWhyOpen] = useState(false);
  const [error, setError] = useState(null); // State to hold the error

  const toggleWhy = () => setWhyOpen(!whyOpen);
  const toggleOptions = () => setOptionsOn(!optionsOn);

  const handleZoomSliderChange = (event, newValue) => {
    setZoomValue(newValue);
  };

  const handleRoomWidthSliderChange = (event, newValue) => {
    setRoomWidth(newValue);
  }

  // const toggleFilters = () => setFiltersOn(!filtersOn);
  // const toggleZoom = () => setZoomOn(!zoomOn);
  const toggleSearch = () => setSearchOn(!searchOn);


  useEffect(() => {
    // console.log("Filtered Groups: ", filteredGroups);
    // fetch('http://localhost:5001/fetch-events')
    fetch('http://192.168.178.66:5001/fetch-events')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching event data');
        }
        return response.json();
      })
      .then(data => {
        setError(null);
        setData(data);
        let parsedData = parseEventXMLData(data)
        // rebox events, currently they cut off at midnight, that's not good for viz
        let reboxedEvents = reboxDays(parsedData);
        setEvents(reboxedEvents);
      })
      .catch(error => {
        console.error('Error fetching event data:', error.message);
        setError(error);
      });
  }, [filteredGroups]);

  // useEffect(() => {
  //   // console.log("Filtered Groups: ", filteredGroups);
  //   // fetch('http://localhost:5001/fetch-events')
  //   fetch('http://192.168.178.66:5001/fetch-events')
  //     .then(response => response.json())
  //     .then(data => {
  //       setData(data);
  //       let parsedData = parseEventXMLData(data)
  //       // rebox events, currently they cut off at midnight, that's not good for viz
  //       let reboxedEvents = reboxDays(parsedData);
  //       setEvents(reboxedEvents);
  //     }).catch(error => {
  //       console.error('Error fetching event data:', error);
  //     });
  // }, [filteredGroups]);

  // Display the error message if there is an error
  // if (error) {
  //   return (
  //     <Box sx={{ width: '100%', padding: 2 }}>
  //       <Typography variant="h6" color="error">
  //         Error: {error.message}
  //       </Typography>
  //     </Box>
  //   );
  // }

  const handleDayChange = (newValue) => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('tab', newValue);
    window.history.replaceState(null, '', '?' + urlParams.toString());
    setDay(newValue);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam !== null) {
      setDay(parseInt(tabParam, 10));
    } else {
      const currentDate = new Date();
      const currentDay = currentDate.getDay();
      setDay(currentDay);
    }
  }, []);

  const resetFilters = () => {
    setFilteredGroups(getSimplerEventGroupList());
    setZoomValue(50);
    setRoomWidth(20);
  }

  const handleSearch = (query) => {
    if (query.length < 3) {
      setResults([]);
      return;
    }
    if (events === null) {
      return;
    }
    const allEvents = Array.from(events.values()).flat();
    const lowerCaseQuery = query.toLowerCase();
    const filteredEvents = allEvents.filter(event =>
      event.title.toLowerCase().includes(lowerCaseQuery) ||
      event.subtitle.toLowerCase().includes(lowerCaseQuery) ||
      event.description.toLowerCase().includes(lowerCaseQuery)
    );
    setResults(filteredEvents);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam !== null) {
      setDay(parseInt(tabParam, 10));
    }
  }, []);

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      {/* Search Result Modal */}
      {selectedResult !== null &&
        <EventModal event={selectedResult} open={selectedResult !== null} onClose={() => setSelectedResult(null)} />
      }
      {/* Why Modal */}
      <Modal
        open={whyOpen}
        onClose={() => toggleWhy()}
      >
        <Box sx={{ ...modalStyle, p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6" component="h2">
            Why?
          </Typography>
          <Typography variant="body1">
            I find the official schedule a bit hard to read, especially on mobile devices.
            I'm also not happy with the way things are grouped, so I regrouped them into new categories.
            {/* There are also a lot of all-day events shown by default, which I find unnecessary to show as default. */}
            A filter system is implemented to show only the events you're interested in.
            Use Ctrl+Click to select single groups.
            Click on a room to see the full name and where it is.
            The cutoff between dates is also shifted to make late night events appear on the same day.
            This version is optimized for readability and quick access to the most important information.
            Furthermore, it comes with a search function.
          </Typography>
        </Box>
      </Modal>
      {/* Search Modal */}
      <Modal
        open={searchOn}
        onClose={() => toggleSearch()}
      >
        <Box sx={{ ...modalStyle, p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6" component="h2">
            Search Events
          </Typography>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth={true}
            onChange={(e) => handleSearch(e.target.value)} // Assuming handleSearch updates the results
          />
          <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            {results.map((event, index) => (
              <Box key={index} sx={{ p: 2, borderBottom: '1px solid #ccc' }}>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography variant="body1">{event.title}</Typography>
                    <Typography variant="body2" color="textSecondary">{event.day}: {event.time} - {event.endTime}</Typography>
                  </Box>
                  <Box>
                    <IconButton onClick={() => setSelectedResult(event)}>
                      <ArrowForwardIcon />
                    </IconButton>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>
      <Box>
        <Stack direction="row" spacing={2}>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            EF28 Schedule (different view)
          </Typography>
          <IconButton variant={optionsOn ? "contained" : "outlined"} onClick={() => toggleOptions()}>
            <SettingsIcon />
          </IconButton>
        </Stack>
        {/* Day Selection Tabs */}
        <Box>
          <StyledTabs
            value={day}
            onChange={(e, newValue) => handleDayChange(newValue)}
            sx={{ marginBottom: 2, padding: 0 }}
            variant="scrollable"
          >
            {data && data?.schedule?.day.map((day, index) => {
              const tabDate = new Date(day.date);
              const currentDate = new Date(currentTime.getTime());
              const isBefore4am = currentDate.getHours() <= 4;
              currentDate.setHours(4, 0, 0, 0);

              let isToday = false;
              if (isBefore4am) {
                if (tabDate.getDate() === (currentDate.getDate() - 1)) {
                  isToday = true;
                }
              } else {
                if (tabDate.getDate() === currentDate.getDate()) {
                  isToday = true;
                }
              }

              return (
                <StyledTab
                  key={index}
                  label={
                    <Badge key={index} variant={isToday ? "dot" : null} color="secondary">
                      {getWeekdayFromDate(day.date)}
                    </Badge>
                  }
                  sx={{ padding: 0 }}
                  padding={0}
                />
              );
            })}
          </StyledTabs>
        </Box>
        {/* Option Buttons */}
        {optionsOn && <>
          <Box m={2}>
            {/* <SettingsIcon /> */}
            <ButtonGroup size="big">
              {/* <Button variant={filtersOn ? "contained" : "outlined"} onClick={() => toggleFilters()}>
                <Badge badgeContent={8 - filteredGroups.length} color="secondary">
                  Filters
                </Badge>
              </Button>
              <Button variant={zoomOn ? "contained" : "outlined"} onClick={() => toggleZoom()}>Settings</Button> */}
              <Button variant={searchOn ? "contained" : "outlined"} onClick={() => toggleSearch()}>Search</Button>
              <Button variant={"outlined"} onClick={() => resetFilters()}>Reset</Button>
              <Button
                variant="outlined"
                onClick={() => toggleWhy()}
              >
                Why?
              </Button>
            </ButtonGroup>
          </Box>
          {/* Filters */}
          {filtersOn &&
            <Stack direction={{ xs: 'column', sm: 'row' }} my={2} spacing={2}>
              <GroupButtonGroup
                groups={groups}
                filteredGroups={filteredGroups}
                setFilteredGroups={setFilteredGroups}
              />
            </Stack>
          }
          {/* Zoom Slider */}
          {zoomOn &&
            <>
              <Stack direction="row" sx={{ marginBottom: 2 }} spacing={2}>
                <Typography variant='overline'>Room Width</Typography>
                <Slider
                  value={typeof roomWidth === 'number' ? roomWidth : 0}
                  onChange={handleRoomWidthSliderChange}
                  min={1}
                  max={40}
                />
                <Typography variant='overline'>Zoom</Typography>
                <Slider
                  value={typeof zoomValue === 'number' ? zoomValue : 0}
                  onChange={handleZoomSliderChange}
                  min={15}
                  max={100}
                />
              </Stack>
            </>
          }
        </>
        }
        <Box>
          {error &&
            <Box sx={{ width: '100%', height: "80vh", padding: 2 }}>
              <Typography variant="h6" color="error">
                Error: {error.message}
              </Typography>
            </Box>
          }
          {events && data && data?.schedule?.day.map((dayy, index) => (
            <React.Fragment key={index}>
              {day === index &&
                <Schedule
                  currentTime={currentTime}
                  day={getWeekdayFromDate(dayy.date)}
                  events={events.get(getWeekdayFromDate(dayy.date))}
                  filteredGroups={filteredGroups}
                  zoom={zoomValue}
                  roomWidth={roomWidth}
                />
              }
            </React.Fragment>
          ))}
        </Box>
      </Box>
      <Copyright />
    </Box >

  );
};

export default App;