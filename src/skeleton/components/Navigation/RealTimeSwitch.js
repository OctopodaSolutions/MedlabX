import { useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import { useDispatch } from 'react-redux';
import { activateRealTime, deactivateRealTime } from '../../store/realTimeSlice';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

/**
 * RealTimeSwitch component renders a switch that toggles the real-time connection state.
 * 
 * @returns {JSX.Element} The RealTimeSwitch component.
 */
export default function RealTimeSwitch() {
  const connection = useSelector((state) => state.realTime);
  const dispatch = useDispatch();

  /**
   * Handles the switch click event to toggle the real-time connection state.
   */
  const handleClick = () => {
    console.log("CONNECTION", !connection);
    if (!connection) {
      dispatch(activateRealTime());
    } else {
      dispatch(deactivateRealTime());
    }
  };

  return (
    <div>
      <Stack direction="row" spacing={2}>
        {/* <Switch checked={connection} onChange={handleClick} /> */}
        <Switch
          checked={connection}
          onChange={handleClick}
          inputProps={{ 'aria-label': 'controlled' }}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: '#1a8cff',
              '& + .MuiSwitch-track': {
                backgroundColor: '#FFFFFF',
              },
            },
            '& .MuiSwitch-track': {
              backgroundColor: '#FFFFFF',
            },
            '& .MuiSwitch-switchBase': {
              color: 'white',
            },
          }}
        />
      </Stack>
    </div>
  );
}