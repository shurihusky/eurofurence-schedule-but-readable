import React from 'react';
import {
  getBuilding,
  modalStyle,
} from './utils.js';
import Box from '@mui/material/Box';
import './schedule.css';
import { Button, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const EventModal = ({ event, open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose} >
      <Box sx={modalStyle}>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Typography variant="h4" component="h2">
            {event.title}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Typography variant='overline'>
          {event.subtitle}
        </Typography>
        <Box sx={{ mt: 2, padding: 2, border: "1px solid grey" }}>
          <Typography variant="body2">Speaker: {event.speaker}</Typography>
          <Typography variant="body2">Language: {event.language}</Typography>
          <Typography variant="body2">Track: {event.track}</Typography>
          <Typography variant="body2">Room: {event.room} ({getBuilding(event.room)})</Typography>
          <Typography variant="body2">
            Time: {event.day} {event.time} - {event.endTime}
          </Typography>
        </Box>
        <Typography variant='body2' my={2}>
          {event.description}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant='contained' color='primary' href={event.link} target="_blank" rel="noreferrer" mt={2}>
            More Info
          </Button>
          <Button variant='contained' color='background' onClick={onClose} mt={2}>
            Close
          </Button>
        </Stack>
      </Box>
    </Modal>
  )
};


export default EventModal;