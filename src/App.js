import React, { useEffect } from 'react';
import Container from '@mui/material/Container';
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
      {'Information without guarantee, can contain mistakes from parsing the event website | Made with ❤️ by ShuriHusky | '}
      <Link color="inherit" href="https://github.com/shurihusky/eurofurence-schedule-but-readable/">
        Source Code
      </Link>
    </Typography>
  );
}

const App = () => {
  const [tab, setTab] = React.useState(0);
  const [filteredGroups, setFilteredGroups] = React.useState(getSimplerEventGroupList());

  // const handleChange = (event, newValue) => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   urlParams.set('tab', newValue);
  //   window.location.search = urlParams.toString();
  // };

  // useEffect(() => {
  //   console.log("filteredGroups", filteredGroups);
  // }, [filteredGroups]);

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
              <StyledTab label="Tue" />
              <StyledTab label="Wed" />
              <StyledTab label="Thu" />
              <StyledTab label="Fri" />
              <StyledTab label="Sat" />
              <StyledTab label="Sun" />
            </StyledTabs>
            <GroupButtonGroup
              groups={groups}
              filteredGroups={filteredGroups}
              setFilteredGroups={setFilteredGroups}
            />
            <Box>
              {tab === 0 && <Schedule day="Tue" filteredGroups={filteredGroups} />}
              {tab === 1 && <Schedule day="Wed" filteredGroups={filteredGroups} />}
              {tab === 2 && <Schedule day="Thu" filteredGroups={filteredGroups} />}
              {tab === 3 && <Schedule day="Fri" filteredGroups={filteredGroups} />}
              {tab === 4 && <Schedule day="Sat" filteredGroups={filteredGroups} />}
              {tab === 5 && <Schedule day="Sun" filteredGroups={filteredGroups} />}
            </Box>
          </Box>
        </Box>
        <Copyright />
      </Box>
    </Container>

  );
};

export default App;