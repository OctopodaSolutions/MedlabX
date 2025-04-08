import { useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Badge from '@mui/material/Badge';
import { getConnectedArduinos } from '../../functions/Arduino Functions/getLinesFromArduino';
import { useDispatch } from 'react-redux';
import { Button, Menu, MenuItem } from '@mui/material';
import { addMqtt, resetMQTT } from '../../store/mqttConnectionSlice';

/**
 * ConnectionStack component renders a stack of icons with badges
 * indicating the number of lines, number of connected sessions, 
 * and the connection status.
 * 
 * @returns {JSX.Element} The ConnectionStack component.
 */
export default function ConnectionStack() {
  const connection = useSelector((state) => state.connection_settings.MQTT_CONNECTED);
  const numLines = useSelector((state) => state.mqttConnections);
  const numConnected = useSelector((state) => state.connection_settings.NUM_SESSIONS);
  const dispatch = useDispatch();

  useEffect(() => {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const fetchArduinos = async () => {
      if (connection) {
        try {
          await delay(3000); // Wait for 3 seconds
          const res = await getConnectedArduinos();
          dispatch(addMqtt(res.data));
        } catch (err) {
          // ErrorMessage(`Unable to connect to Hardware`);
        }
      } else {
        dispatch(resetMQTT());
      }
    };

    fetchArduinos();
  }, [connection]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // useEffect(()=>{console.log('-------------',numLines)},[numLines])

  return (
    <div>
      <Stack direction="row" spacing={2}>
        <Badge aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick} sx={{ cursor: 'pointer' }} badgeContent={numLines.length || '0'} color="primary">
          <RouterIcon sx={{ fontSize: 30, color: 'white' }} />
        </Badge>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {numLines.length === 0 ? (
            <MenuItem disabled>No connections</MenuItem>
          ) : (
            numLines.map((topic, index) => (
              <MenuItem key={index} sx={{ color: topic[1] === 'active' ? 'green' : 'black' }} onClick={handleClose}>
                {topic[0]}
              </MenuItem>
            ))
          )}
        </Menu>

        <Badge badgeContent={numConnected || 0} color="primary">
          <PeopleIcon sx={{ fontSize: 30, color: 'white' }} />
        </Badge>
        <Badge color="primary">
          <SystemIcon sx={{ color: connection ? 'green' : 'red', fontSize: 30 }} />
        </Badge>
      </Stack>
    </div>
  );
}

/**
 * RouterIcon component renders a custom SVG icon representing a router.
 * 
 * @param {object} props - The properties passed to the component.
 * @returns {JSX.Element} The RouterIcon component.
 */
function RouterIcon(props) {
  return (
    // <SvgIcon {...props}>
    //   <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    // </SvgIcon>

    <SvgIcon {...props}>
      <path d="M12,6C7.03,6 3,10.03 3,15H5c0-3.87 3.13-7 7-7s7,3.13 7,7h2C21,10.03 16.97,6 12,6zM12,3C5.92,3 1,7.92 1,14h2c0-5.05 4.05-9 9-9s9,3.95 9,9h2C23,7.92 18.08,3 12,3zM12,10c-2.21,0-4,1.79-4,4h2c0-1.1 0.9-2 2-2s2,0.9 2,2-0.9,2-2,2c-1.1,0-2-0.9-2-2H8c0,2.21 1.79,4 4,4s4-1.79 4-4S14.21,10 12,10z" />
    </SvgIcon>
  );
}

/**
 * PeopleIcon component renders a custom SVG icon representing people.
 * 
 * @param {object} props - The properties passed to the component.
 * @returns {JSX.Element} The PeopleIcon component.
 */
function PeopleIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V18h14v-1.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V18h6v-1.5c0-2.33-4.67-3.5-7-3.5z" />
    </SvgIcon>
  );
}

/**
 * SystemIcon component renders a custom SVG icon representing a system.
 * 
 * @param {object} props - The properties passed to the component.
 * @returns {JSX.Element} The SystemIcon component.
 */
function SystemIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M12 2c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm1-8h-2v4h2V10zm0-4h-2v2h2V6z" />
    </SvgIcon>
  );
}
