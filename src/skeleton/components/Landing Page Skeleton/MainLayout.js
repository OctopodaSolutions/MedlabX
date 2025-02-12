import ReactDOM from 'react-dom';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import './MainLayout.css';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useDispatch } from 'react-redux';
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
import PluginRenderer from '../PluginComponents/PluginContainer'
// import TerminalSharpIcon from '@mui/icons-material/TerminalSharp';
import LaptopMacSharpIcon from '@mui/icons-material/LaptopMacSharp';
import ChevronLeftSharpIcon from '@mui/icons-material/ChevronLeftSharp';
import ChevronRightSharpIcon from '@mui/icons-material/ChevronRightSharp';
import { v4 as uuidv4 } from 'uuid';
import UploadFile from '../PluginComponents/UploadFile';


/**
 * The AccountMenu component provides a menu for account settings, including navigation links and user options.
 * @component
 * @example
 * return <AccountMenu />;
 */
export function Dashboard() {

  const dispatch = useDispatch()

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const group = useSelector((state)=>state.plugin.group);
  const plugins = useSelector((state)=>state.plugin.plugins);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  return (
    <div>
      <Box
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

                {plugins.map((plugin,index)=><Box
                  key={index}
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
                    color: activeComponent === plugin.instanceId ? '#4CAF50' : '#FFFFFF', // Highlight color for active
                    backgroundColor: activeComponent === plugin.instanceId ? '#1F2937' : 'transparent', // Darker background for active
                    borderLeft: activeComponent === plugin.instanceId ? '4px solid #4CAF50' : 'none', // Green border for active
                    boxShadow: activeComponent === plugin.instanceId
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
                  onClick={() => setActiveComponent(plugin.instanceId)}
                >
                  {plugin.instanceId}
                </Box>)}


                {/* Fixed Button */}

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
        <Box sx={{ flex: 1, height:'94vh', overflowY: 'auto' }}>
          {activeComponent === 'dashboard' && <GridComponent />}
          {activeComponent === 'addPlugin' && <UploadFile />}
          {plugins.map((plugin,index) => (
            <div key={plugin.instanceId} id= {`plugin-container-${index}`}
                 style={{display:activeComponent===plugin.instanceId?'block':'none'}}>
                  Loading
            </div>
          ))}
          <PluginRenderer activeComponent={activeComponent} plugins={plugins}/>
          
        </Box>

      </Box>

    </div>
  );
}
