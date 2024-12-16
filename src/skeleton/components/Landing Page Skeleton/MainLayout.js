import React, { useState } from 'react';
import Box from '@mui/material/Box';
import './MainLayout.css';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// import McaHome from '../../../custom/components/Main Layout/McaPage';
import { useDispatch } from 'react-redux';
import { setTab } from '../../../redux_stores/actions';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Avatar, Button, ButtonGroup, Divider, FormControlLabel, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material';
import { Logout, PersonAdd, Settings } from '@mui/icons-material';
// import History from '../../../custom/components/Main Layout/History';

/**
 * A styled Material UI Switch component with custom styles and SVG icons.
 * @component
 */
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

/**
 * The AccountMenu component provides a menu for account settings, including navigation links and user options.
 * @component
 * @example
 * return <AccountMenu />;
 */
export function AccountMenu() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  /**
   * Opens the account menu.
   * @param {React.MouseEvent<HTMLElement>} event - The click event to set the anchor element.
   */
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Closes the account menu.
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Navigates to the dashboard page.
   */
  const navigateToDashboard = () => {
    navigate('/');
  };

  /**
   * Navigates to the login page.
   */
  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <React.Fragment>
      <Box className='navigationbar_layout' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <ButtonGroup>
          <Button onClick={navigateToDashboard}>Dashboard</Button>
          <Button onClick={navigateToDashboard}>Program</Button>
          <Button onClick={navigateToDashboard}>Controls</Button>
          <Button onClick={navigateToDashboard}>View</Button>
        </ButtonGroup>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>X</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          {/* Placeholder for future menu item */}
        </MenuItem>
        <MenuItem>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={<MaterialUISwitch sx={{ m: 1 }} defaultChecked />}
            label="MUI switch"
          />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}

/**
 * The TabPanel component is used to display content for each tab.
 * @component
 * @param {Object} props - The properties for the component.
 * @param {React.ReactNode} props.children - The content to be displayed in the panel.
 * @param {number} props.value - The value of the active tab.
 * @param {number} props.index - The index of the current panel.
 * @param {Object} [other] - Any additional properties to pass to the component.
 * @example
 * <TabPanel value={value} index={0}>
 *   <div>Content for Tab 0</div>
 * </TabPanel>
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
 * Provides accessibility props for tabs.
 * @param {number} index - The index of the tab.
 * @returns {Object} - The accessibility props for the tab.
 * @example
 * a11yProps(0);
 * // Returns { id: 'simple-tab-0', 'aria-controls': 'simple-tabpanel-0' }
 */
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

/**
 * The NavTabs component provides a tab interface for navigation between different sections.
 * @component
 * @param {Object} props - The properties for the component.
 * @param {string} props.platform - The platform name to display.
 * @example
 * <NavTabs platform="Platform Name" />
 */
export function NavTabs(props) {
  const tabValue = useSelector((state) => state.current_tab.tab_value);

  const [prgFromChild, getMessageFromChild] = React.useState([]);
  const [currentLoadedReagents, getCurrentLoadedReagents] = React.useState([]);
  const [prgLoadStatus, setPrgLoadStatus] = useState(0);
  const dispatch = useDispatch();

  /**
   * Handles changes to the active tab.
   * @param {React.ChangeEvent<{}>} event - The change event.
   * @param {number} newValue - The new value of the active tab.
   */
  const handleChange = (event, newValue) => {
    dispatch(setTab(newValue));
    event.preventDefault();
  };

  React.useEffect(() => {
    console.log("Platform", props.platform);
  }, []);

  return (
    <div style={{ width: "100%", height: '94vh', backgroundColor: 'var(--body_background3)', color: 'var(--body_color)', overflowY: 'auto' }}>
      <Box sx={{ borderBottom: 1, borderColor: ' var(--body_borderColor)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Tabs value={tabValue} onChange={handleChange}>
          <Tab label="Dashboard" {...a11yProps(0)} style={{ color: 'var(--body_color)', fontSize: '1.4vh' }} />
          <Tab label="XCSM" {...a11yProps(1)} style={{ color: 'var(--body_color)', fontSize: '1.4vh' }} />
          <Tab label="History" {...a11yProps(2)} style={{ color: 'var(--body_color)', fontSize: '1.4vh' }} />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        {/* <XAGM /> */}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {/* <McaHome /> */}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {/* <History /> */}
      </TabPanel>
      <div>{props.platform}</div>
    </div>
  );
}