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
import { Avatar, Button, ButtonGroup, Divider, FormControlLabel, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, Collapse } from '@mui/material';
import { Logout, PersonAdd, Settings, Delete as DeleteIcon } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import WysiwygSharpIcon from '@mui/icons-material/WysiwygSharp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import GridComponent from '../PluginComponents/GridComponent'
import AddPluginPage from '../PluginComponents/AddPluginPage'
import PluginContainer from '../PluginComponents/PluginContainer'
// import TerminalSharpIcon from '@mui/icons-material/TerminalSharp';
import LaptopMacSharpIcon from '@mui/icons-material/LaptopMacSharp';
import ChevronLeftSharpIcon from '@mui/icons-material/ChevronLeftSharp';
import ChevronRightSharpIcon from '@mui/icons-material/ChevronRightSharp';
import { v4 as uuidv4 } from 'uuid';


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
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // To handle the dialog visibility
  const [selectedPlugin, setSelectedPlugin] = useState(null); // To store the selected plugin
  const [activePlugins, setActivePlugins] = useState([]); // To store the list of active plugins
  const [openPlugin, setOpenPlugin] = useState(null);


  const availablePlugins = [
    {
      name: 'xspex',
      version: '0.1.1',
      author: 'PluginDev Inc.',
      description: 'A tool for managing specialized exports in a complex system.',
      installation: 'npm install xspex',
      dependencies: ['axios', 'lodash'],
      lastUpdated: '2024-12-15',
      compatibleWith: ['Node.js 14.x', 'Linux', 'Windows']
    },
    {
      name: 'xtract',
      version: '0.1.5',
      author: 'DataGuru',
      description: 'Extracts and processes data from large files quickly.',
      installation: 'npm install xtract',
      dependencies: ['fs-extra', 'csv-parser'],
      lastUpdated: '2024-10-05',
      compatibleWith: ['Node.js 12.x+', 'macOS', 'Linux']
    },
    {
      name: 'xsynth',
      version: '0.2.0',
      author: 'TechLabs',
      description: 'A generic plugin to add custom logging functionality.',
      installation: 'npm install xsynth',
      dependencies: ['winston'],
      lastUpdated: '2025-01-10',
      compatibleWith: ['Node.js 16.x', 'Windows', 'macOS']
    }
  ];


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleStartPlugin = () => {
    setDialogOpen(true); // Open the dialog when the "Start Plugin" button is clicked
  };

  const handleSelectPlugin = (plugin) => {
    console.log(`Selected plugin: ${plugin.name} - Version: ${plugin.version}`);

    // Create a new plugin instance with a unique ID
    const pluginWithId = { ...plugin, id: uuidv4() };

    setSelectedPlugin(pluginWithId); // Store the selected plugin
    setDialogOpen(false); // Close the dialog

    // Add the selected plugin to the active plugins list
    setActivePlugins((prevPlugins) => [
      ...prevPlugins,
      pluginWithId
    ]);

    alert(`Starting plugin: ${pluginWithId.name}, Version: ${pluginWithId.version}`);
  };


  const handleDeactivatePlugin = (pluginToRemove) => {
    console.log("Removing plugin:", pluginToRemove);

    // Filter out the plugin with the unique ID
    setActivePlugins((prevPlugins) =>
      prevPlugins.filter(
        (plugin) => plugin.id !== pluginToRemove.id // Compare the unique ID
      )
    );
  };
  const toggleCollapse = (pluginId) => {
    // Toggle the collapse state for the specific plugin using its unique ID
    setOpenPlugin(prevOpenPlugin => (prevOpenPlugin === pluginId ? null : pluginId));
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
            width: isSidebarOpen ? '250px' : '60px',
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
            <Box
              sx={{
                fontSize: 36, // Larger icon size
                transition: 'opacity 0.3s ease, transform 0.3s ease', // Smooth switching
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isSidebarOpen ? (
                <ChevronLeftSharpIcon
                  sx={{
                    fontSize: 30,
                    opacity: isSidebarOpen ? 1 : 0, // Smooth fade-out when hiding
                    transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-10px)', // Sliding effect
                  }}
                />
              ) : (
                <ChevronRightSharpIcon
                  sx={{
                    fontSize: 30,
                    opacity: isSidebarOpen ? 0 : 1, // Smooth fade-in when showing
                    transform: isSidebarOpen ? 'translateX(10px)' : 'translateX(0)', // Sliding effect
                  }}
                />
              )}
            </Box>
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


              {activePlugins.map((plugin, index) => (
                <IconButton
                  key={plugin.id}
                  sx={{
                    backgroundColor: 'black',
                    color: '#fff',
                    marginTop: '20px', // Adjust spacing for icons
                    borderRadius: '50%',
                    '&:hover': { backgroundColor: 'black' },
                  }}
                  onClick={() => {
                    toggleCollapse(plugin.id);
                    setActiveComponent('plugincontainer');
                    setSelectedPlugin(plugin);
                  }}
                >
                  <LaptopMacSharpIcon sx={{ fontSize: 30 }} />
                </IconButton>
              ))}


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
                backgroundColor: 'black',
                marginTop: '20px',
                position: 'relative', // For absolute positioning inside the Box
              }}
            >
              {/* User Section */}
              <Box
                sx={{
                  display: 'flex',
                  gap: '10px',
                  // flexDirection: 'column',
                  // alignItems: 'center',
                  // justifyContent: 'center',
                  padding: '5px 10px',
                  borderBottom: '1px solid #374151', // Separator line
                  // marginBottom: '10px',
                }}
              >
                <Avatar
                  src="https://via.placeholder.com/150" // Replace with user's avatar URL
                  alt="User Avatar"
                  sx={{
                    width: 60,
                    height: 60,
                    marginBottom: '10px',
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#FFFFFF',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    John Doe
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#9CA3AF',
                      fontSize: '14px',
                    }}
                  >
                    Admin
                  </Typography>
                </div>
              </Box>

              {/* Navigation Section */}
              <Box sx={{ padding: '10px', borderRadius: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    // width: '100%',
                    marginBottom: '5px',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '12px 10px', // Adjusted padding for better spacing
                    fontSize: '16px',
                    fontFamily: '"Roboto", sans-serif',
                    fontWeight: '600',
                    color: activeComponent === 'dashboard' ? '#4CAF50' : '#FFFFFF', // Highlight color for active
                    backgroundColor: activeComponent === 'dashboard' ? '#1F2937' : 'transparent', // Darker background for active
                    borderLeft: activeComponent === 'dashboard' ? '4px solid #4CAF50' : 'none', // Green border for active
                    boxShadow: activeComponent === 'dashboard'
                      ? '0 8px 12px rgba(0, 0, 0, 0.25)' // Stronger shadow for active
                      : '0 4px 6px rgba(0, 0, 0, 0.1)', // Default shadow
                    transition: 'transform 0.4s ease, background-color 0.4s ease, color 0.4s ease, box-shadow 0.4s ease, border-left 0.4s ease', // Smooth transition
                    '&:hover': {
                      backgroundColor: '#374151', // Slightly lighter grey on hover
                      color: '#E5E7EB', // Lighter grey for hover text
                      boxShadow: '0 8px 12px rgba(0, 0, 0, 0.25)', // Stronger shadow
                    },
                    '&:active': {
                      transform: 'scale(0.98)', // Subtle press effect
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Reduced shadow
                      borderLeft: '4px solid #2196F3', // Blue border when active
                    },
                  }}
                  onClick={() => setActiveComponent('dashboard')}
                >
                  <DashboardIcon sx={{ fontSize: 30, marginRight: '10px' }} />
                  Dashboard
                </Box>

                {/* <Box
                  sx={{
                    display: 'flex',
                    // width: '100%',
                    marginBottom: '5px',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '12px 16px', // Adjusted padding for better spacing
                    fontSize: '16px',
                    fontFamily: '"Roboto", sans-serif',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Soft shadow
                    transition: 'transform 0.4s ease, background-color 0.4s ease, color 0.4s ease, box-shadow 0.4s ease, border-right 0.4s ease', // Smooth transition for border-right
                    '&:hover': {
                      backgroundColor: '#374151', // Slightly lighter grey on hover
                      color: '#E5E7EB', // Lighter grey for hover text
                      boxShadow: '0 8px 12px rgba(0, 0, 0, 0.25)', // Stronger shadow
                      borderLeft: '4px solid #4CAF50', // Green border on hover
                    },
                    '&:active': {
                      transform: 'scale(0.98)', // Subtle press effect
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Reduced shadow
                      borderLeft: '4px solid #2196F3', // Blue border when active
                    },
                  }}
                  onClick={() => setActiveComponent('plugincontainer')}
                >
                  <TerminalSharpIcon sx={{ fontSize: 30, marginRight: '10px' }} />
                  Plugin 1
                </Box> */}

                {activePlugins.map((plugin, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      padding: '12px 10px',
                      fontSize: '16px',
                      fontFamily: '"Roboto", sans-serif',
                      fontWeight: '600',
                      color: '#FFFFFF',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.4s ease, background-color 0.4s ease, color 0.4s ease, box-shadow 0.4s ease, border-right 0.4s ease',
                      '&:hover': {
                        backgroundColor: '#374151',
                        color: '#E5E7EB',
                        boxShadow: '0 8px 12px rgba(0, 0, 0, 0.25)',
                        borderLeft: '4px solid #4CAF50',
                      },
                      '&:active': {
                        transform: 'scale(0.98)',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        borderLeft: '4px solid #2196F3',
                      },
                    }}
                    onClick={() => {
                      toggleCollapse(plugin.id);
                      setActiveComponent('plugincontainer');
                      setSelectedPlugin(plugin);
                    }}// Toggle the dropdown for this specific plugin
                  >
                    <LaptopMacSharpIcon sx={{ fontSize: 30, marginRight: '10px' }} />
                    <Box style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                      <Typography sx={{ fontWeight: '600', color: 'inherit' }}>
                        {plugin.name}
                      </Typography>
                      <Collapse in={openPlugin === plugin.id}> {/* Collapse is controlled by plugin name */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography sx={{ color: 'inherit', fontSize: '14px' }}>
                            V: {plugin.version}
                          </Typography>
                          <Button
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent the click from toggling the dropdown
                              setActiveComponent('dashboard')
                              handleDeactivatePlugin(plugin);
                            }}
                            sx={{ fontSize: '14px', padding: '0px' }}
                          >
                            Remove <DeleteIcon sx={{ fontSize: 20 }} />
                          </Button>
                        </Box>
                      </Collapse>
                    </Box>
                  </Box>
                ))}


                {/* Fixed Button */}
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{
                    width: 'calc(100% - 20px)', // Ensures padding or margin doesn't cut off the button
                    fontSize: '16px',
                    fontWeight: 'bold',
                    fontFamily: '"Roboto", sans-serif',
                    textTransform: 'none',
                    borderRadius: '8px',
                    background: 'linear-gradient(90deg, #4CAF50 0%, #81C784 100%)',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    position: 'absolute', // Position relative to the Box
                    bottom: '60px', // Fixed at 10px from the bottom
                    '&:hover': {
                      background: 'linear-gradient(90deg, #388E3C 0%, #66BB6A 100%)',
                      boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
                    },
                    '&:active': {
                      transform: 'scale(0.97)',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                  onClick={handleStartPlugin} // Open dialog
                >
                  Start Plugin
                </Button>

                <Button
                  variant="contained"
                  sx={{
                    width: 'calc(100% - 20px)', // Ensures padding or margin doesn't cut off the button
                    fontSize: '16px',
                    fontWeight: 'bold',
                    fontFamily: '"Roboto", sans-serif',
                    textTransform: 'none',
                    borderRadius: '8px',
                    background: 'linear-gradient(90deg, #4CAF50 0%, #81C784 100%)',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    position: 'absolute', // Position relative to the Box
                    bottom: '10px', // Fixed at 10px from the bottom
                    '&:hover': {
                      background: 'linear-gradient(90deg, #388E3C 0%, #66BB6A 100%)',
                      boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
                    },
                    '&:active': {
                      transform: 'scale(0.97)',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                  onClick={() => setActiveComponent('addPlugin')}
                >
                  Add Plugin
                </Button>
              </Box>
            </Box>


          )}

        </Box>

        {/* Main Content Area */}
        <Box sx={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {activeComponent === 'dashboard' && <GridComponent />}
          {activeComponent === 'addPlugin' && <AddPluginPage />}
          {activeComponent === 'plugincontainer' && selectedPlugin && (
            <PluginContainer plugin={selectedPlugin} /> // Show PluginContainer with selectedPlugin data
          )
          }
          
        </Box>

      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(145deg,rgb(194, 194, 194),rgb(238, 236, 236), #b5b5b5)',
            border: "1px solid #d1d1d1",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            padding: "16px",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "18px",
            textAlign: "center",
            color: "#4e4e4e",
            textShadow: "1px 1px 2px #fff, 0 0 1em #ccc",
          }}
        >
          Select a Plugin to Start
        </DialogTitle>
        <DialogContent
          sx={{
            color: "#333",
          }}
        >
          <List>
            {availablePlugins.map((plugin, index) => (
              <ListItem
                button
                key={index}
                onClick={() => handleSelectPlugin(plugin)}
                sx={{
                  "&:hover": {
                    backgroundColor: "#e6e6e6",
                    // boxShadow: "inset 0px 0px 4px rgba(0,0,0,0.3)",
                  },
                }}
              >
                <ListItemText
                  primary={`${plugin.name} - Version ${plugin.version}`}
                  primaryTypographyProps={{
                    sx: { color: "#444", fontWeight: "500" },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "space-between",
            padding: "8px 16px",
          }}
        >
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{
              color: "#fff",
              background: "linear-gradient(135deg, #6c7a89, #abb7b7)",
              "&:hover": {
                background: "linear-gradient(135deg, #abb7b7, #6c7a89)",
              },
              boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

    </React.Fragment>
  );
}
