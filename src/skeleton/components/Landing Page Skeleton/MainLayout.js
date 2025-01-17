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
// import { setTab } from '../../../redux_stores/actions';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Avatar, Button, ButtonGroup, Divider, FormControlLabel, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { Logout, PersonAdd, Settings } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import WysiwygSharpIcon from '@mui/icons-material/WysiwygSharp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import GridComponent from '../GridComponent'
import AddPluginPage from '../AddPluginPage'
import TerminalSharpIcon from '@mui/icons-material/TerminalSharp';
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


  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const plugins = ['Plugin 1', 'Plugin 2', 'Plugin 3']; // Example array


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <React.Fragment>
      <Box
        className="navigationbar_layout"
        sx={{ display: 'flex', height: '94vh', backgroundColor: '#f4f4f4' }}
      >
        {/* Sidebar */}
        <Box
          sx={{
            width: isSidebarOpen ? '240px' : '60px',
            background: 'black',
            color: '#fff',
            // padding: isSidebarOpen ? '20px' : '10px',
            transition: 'width 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {/* Toggle Button */}
          <IconButton
            onClick={toggleSidebar}
            sx={{
              position: 'absolute',
              top: '10px',
              right: '-20px',
              backgroundColor: 'black',
              color: '#fff',
              borderRadius: '0 40% 40% 0',
              transition: 'transform 0.3s ease, background-color 0.3s ease, color 0.3s ease',
              '&:hover': {
                transform: 'scale(1.2)',
                backgroundColor: 'black',
                color: '#fff',
              },
              zIndex: 1000,
            }}
          >
            {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>

          {!isSidebarOpen && (
            <>
              <IconButton
                sx={{
                  backgroundColor: 'black',
                  color: '#fff',
                  marginTop: '50px',
                  borderRadius: '50%',
                  '&:hover': { backgroundColor: 'black' },
                }}
                onClick={() => setActiveComponent('dashboard')}
              >
                <DashboardIcon sx={{ fontSize: 30 }} />
              </IconButton>

              {plugins.length > 0 && (
                plugins.map((plugin, index) => (
                  <IconButton
                    key={index}
                    sx={{
                      backgroundColor: 'black',
                      color: '#fff',
                      marginTop: '20px', // Adjust spacing
                      borderRadius: '50%',
                      '&:hover': { backgroundColor: 'black' },
                    }}
                  >
                    <TerminalSharpIcon sx={{ fontSize: 30 }} /> {/* Replace with actual icon */}
                  </IconButton>
                ))
              )}

              {/* <IconButton
                sx={{
                  backgroundColor: 'black',
                  color: '#fff',
                  borderRadius: '50%',
                  '&:hover': { backgroundColor: 'black' },
                  marginTop: 'auto',
                  width: '100%',
                }}
                onClick={() => setActiveComponent('addPlugin')}
              >
                <WysiwygSharpIcon sx={{ fontSize: 30 }} />
              </IconButton> */}
            </>
          )}

          {/* Sidebar Content */}
          {isSidebarOpen && (
            <Box
              sx={{
                height: '100vh', // Full height sidebar
                display: 'flex',
                flexDirection: 'column',
                padding: '20px 20px 20px 0px',
                backgroundColor: 'black',
                marginTop: '10px',
              }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{  width: '100%' }}
                onClick={() => setActiveComponent('addPlugin')}
              >
                Add Plugin
              </Button>
              {/* Top Section */}
              <Box sx={{ padding: '20px', borderRadius: 2 }}>
                <Typography
                  variant="h5"
                  sx={{
                    marginBottom: '20px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontFamily: '"Roboto", sans-serif',
                    color: 'white',
                    '&:hover': { color: '#1976d2' }, // Adds hover color effect
                  }}
                  onClick={() => setActiveComponent('dashboard')}
                >
                  Dashboard
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    marginBottom: '20px',
                    fontWeight: '600',
                    fontFamily: '"Roboto", sans-serif',
                    color: 'white',
                  }}
                >
                  List of Plugins
                </Typography>

                <Box
                  sx={{
                    cursor: 'pointer',
                    padding: '10px 20px',
                    fontSize: '18px',
                    fontFamily: '"Roboto", sans-serif',
                    fontWeight: '500',
                    color: 'white',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: '#3a475e',
                      color: '#fff',
                      transform: 'scale(1.05)', // Subtle scale on hover
                    },
                    transition: 'transform 0.3s ease, background-color 0.3s ease, color 0.3s ease',
                  }}
                >
                  Plugin 1
                </Box>

                <Box
                  sx={{
                    cursor: 'pointer',
                    padding: '10px 20px',
                    fontSize: '18px',
                    fontFamily: '"Roboto", sans-serif',
                    fontWeight: '500',
                    color: 'white',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: '#3a475e',
                      color: '#fff',
                      transform: 'scale(1.05)',
                    },
                    transition: 'transform 0.3s ease, background-color 0.3s ease, color 0.3s ease',
                  }}
                >
                  Plugin 2
                </Box>

                <Box
                  sx={{
                    cursor: 'pointer',
                    padding: '10px 20px',
                    fontSize: '18px',
                    fontFamily: '"Roboto", sans-serif',
                    fontWeight: '500',
                    color: 'white',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: '#3a475e',
                      color: '#fff',
                      transform: 'scale(1.05)',
                    },
                    transition: 'transform 0.3s ease, background-color 0.3s ease, color 0.3s ease',
                  }}
                >
                  Plugin 3
                </Box>
              </Box>


              {/* Fixed Button at Bottom */}

            </Box>

          )}

        </Box>

        {/* Main Content Area */}
        <Box sx={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {activeComponent === 'dashboard' && <GridComponent />}
          {activeComponent === 'addPlugin' && <AddPluginPage />}
        </Box>
      </Box>
    </React.Fragment>
  );
}
