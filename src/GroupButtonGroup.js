import React from 'react';
import { ButtonGroup, Button } from '@mui/material';

const GroupButtonGroup = ({ groups, filteredGroups, setFilteredGroups }) => {
  const handleGroupClick = (group) => {
    setFilteredGroups((prevGroups) => {
      if (prevGroups.includes(group.name)) {
        return prevGroups.filter(g => g !== group.name);
      } else {
        return [...prevGroups, group.name];
      }
    });
  };

  return (
    <ButtonGroup variant="contained" aria-label="outlined primary button group">
      {groups.map((group, index) => (
        <Button
          key={index}
          onClick={() => handleGroupClick(group)}
          style={{
            backgroundColor: filteredGroups.includes(group.name) ? group.color : 'inherit',
            color: filteredGroups.includes(group.name) ? 'white' : 'inherit'
          }}
        >   
          {group.name}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default GroupButtonGroup;