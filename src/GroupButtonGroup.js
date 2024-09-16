import React from 'react';
import { ButtonGroup, Button } from '@mui/material';

const GroupButtonGroup = ({ groups, filteredGroups, setFilteredGroups }) => {
  const handleGroupClick = (group, event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      if (filteredGroups.length === 1 && filteredGroups[0] === group.name) {
        setFilteredGroups(groups.map(g => g.name));
        return;
      }
      setFilteredGroups([group.name]);
    } else {
      setFilteredGroups((prevGroups) => {
        if (prevGroups.includes(group.name)) {
          return prevGroups.filter(g => g !== group.name);
        } else {
          return [...prevGroups, group.name];
        }
      });
    }
  };

  return (
    <ButtonGroup size="small" variant="contained" fullWidth={true}>
      {groups.map((group, index) => (
        <Button
          key={index}
          onClick={(event) => handleGroupClick(group, event)}
          style={{
            backgroundColor: filteredGroups.includes(group.name) ? group.color : 'inherit',
            color: filteredGroups.includes(group.name) ? group.contrastColor : 'inherit',
            padding: 3,
            border: '1px solid #D1C5C0',
            fontSize: '0.8rem',
            animation: filteredGroups.includes(group.name) ? index === 0 ? 'pulse 1s infinite' : null : null,
          }}
        >
          {group.name}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default GroupButtonGroup;