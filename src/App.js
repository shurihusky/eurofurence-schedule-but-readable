import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import { parseEventXMLData, reboxDays } from './transform.js';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Schedule from './Schedule.js';
import GroupButtonGroup from './GroupButtonGroup';
import {
  getSimplerEventGroupList,
  groups,
  getWeekdayFromDate,
} from './utils.js';

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
    backgroundColor: '#635ee7',
  },
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(20),
    marginRight: theme.spacing(1),
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-selected': {
      color: '#fff',
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'rgba(100, 95, 228, 0.32)',
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
  const [tab, setTab] = useState(0);
  const [filteredGroups, setFilteredGroups] = useState(getSimplerEventGroupList());
  const [data, setData] = useState(null); // Raw unprocessed data
  const [events, setEvents] = useState(null); // Processed data

  useEffect(() => {
    fetch('http://localhost:5001/fetch-events')
      .then(response => response.json())
      .then(data => {
        console.log("data", data)
        setData(data);
        let parsedData = parseEventXMLData(data)
        console.log("parsedData", parsedData)
        let reboxedEvents = reboxDays(parsedData);
        console.log("reboxedEvents", reboxedEvents)
        setEvents(reboxedEvents);
      }).catch(error => {
        console.error('Error fetching event data:', error);
      });

    // console.log("enriched", enrichBuildingResources(getAvailableRooms(events)))
  }, [filteredGroups]);

  const handleTabChange = (newValue) => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('tab', newValue);
    window.history.replaceState(null, '', '?' + urlParams.toString());
    setTab(newValue); // Assuming you have a state setter for the tab
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam !== null) {
      setTab(parseInt(tabParam, 10));
    }
  }, []);

  return (
    <Container maxWidth="xl">
      <Box sx={{ width: '100%' }}>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            EF28 Event Schedule (different view)
          </Typography>
          <Box>
            <StyledTabs
              value={tab}
              onChange={(e, newValue) => handleTabChange(newValue)}
              aria-label="styled tabs example"
            >
              {data && data?.schedule?.day.map((day, index) => (
                <StyledTab key={index} label={getWeekdayFromDate(day.date)} />
              ))}
            </StyledTabs>
            <GroupButtonGroup
              groups={groups}
              filteredGroups={filteredGroups}
              setFilteredGroups={setFilteredGroups}
            />
            <Box>
              {events && data && data?.schedule?.day.map((day, index) => (
                <React.Fragment key={index}>
                  {tab === index && <Schedule
                    day={getWeekdayFromDate(day.date)}
                    events={events.get(getWeekdayFromDate(day.date))}
                    filteredGroups={filteredGroups}
                  />
                  }
                </React.Fragment>
              ))}
            </Box>
          </Box>
        </Box>
        <Copyright />
      </Box>
    </Container>

  );
};

export default App;