import { useState, useRef, useEffect, useContext } from 'react';
import { Box, Button, Paper, Tab, Tabs} from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import MQTT_Window from './MQTT_Window';
import CommunicationSettings from './ConnectionDetails';
import  "./SettingsMenu.css";
// import Calibration from './Calibration'
// import Serial_Window from './Serial_Window';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import React from 'react';



/**
 * TabPanel component renders the content for each tab in the SettingsMenu.
 * @component
 * @param {Object} props - The properties for the component.
 * @param {React.ReactNode} props.children - The content to display within the tab panel.
 * @param {number} props.value - The current value of the selected tab.
 * @param {number} props.index - The index of this tab panel.
 * @param {Object} [props.other] - Other props passed to the component.
 * @returns {JSX.Element} The TabPanel component.
 */
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

/**
 * Generates the accessibility props for each tab.
 * @param {number} index - The index of the tab.
 * @returns {Object} The accessibility props for the tab.
 */
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

/**
 * SettingsMenu component renders the settings menu with tabs for different settings.
 * @component
 * @returns {JSX.Element} The SettingsMenu component.
 */
export default function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [firstBoxContent, setFirstBoxContent] = useState([]);
  const messageContainerRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const mcaMode = useSelector((state) => (state.connection_settings.MCA_MODE) || false);

  /**
   * Handles closing the dialog.
   */
  const handleDialogClose = () => {
    setOpen(false);
  };

  /**
   * Handles confirming the dialog input.
   */
  const handleConfirm = () => {
    if (name) {
      setFirstBoxContent([...firstBoxContent, name]);
    }
    setName('');
    handleDialogClose();
  };

  /**
   * Handles changing the selected tab.
   * @param {Object} event - The event object.
   * @param {number} newValue - The new tab value.
   */
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      // messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, []);

  return (
    <div style={{ width: "100%", height: '94vh', backgroundColor: 'var(--body_background3)', color: 'var(--body_color)', overflowY: 'auto' }}>
      <Box>
        <Tabs value={selectedTab} indicatorColor="primary" textColor='var(--body_color)' centered onChange={handleTabChange}>
          <Tab label="Connection Details" {...a11yProps(0)} style={{ color: 'var(--body_color)', fontSize: '1.4vh' }} />
          {/* <Tab label="Calibration Details" {...a11yProps(1)} style={{ color: 'var(--body_color)', fontSize: '1.4vh' }} /> */}
          <Tab label="Ard Comms Module" {...a11yProps(1)} style={{ color: 'var(--body_color)', fontSize: '1.4vh' }} />
          {mcaMode && <Tab disabled={!mcaMode} label="Serial Module" {...a11yProps(3)} />}
        </Tabs>
      </Box>
      <TabPanel value={selectedTab} index={0}>
        <CommunicationSettings />
      </TabPanel>
      {/* <TabPanel value={selectedTab} index={1}>
        <Calibration />
      </TabPanel> */}
      <TabPanel value={selectedTab} index={1}>
        <MQTT_Window />
      </TabPanel>
      {/* {mcaMode &&
        <TabPanel value={selectedTab} index={3}>
          <Serial_Window />
        </TabPanel>
      } */}

      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Enter Subscription Name</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}