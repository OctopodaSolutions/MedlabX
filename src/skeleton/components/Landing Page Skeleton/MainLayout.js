import ReactDOM from 'react-dom';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import './MainLayout.css';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Tooltip, Chip } from '@mui/material';
import WysiwygSharpIcon from '@mui/icons-material/WysiwygSharp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GridComponent from '../PluginComponents/GridComponent'
import PluginRenderer from '../PluginComponents/PluginContainer'
import ChevronLeftSharpIcon from '@mui/icons-material/ChevronLeftSharp';
import ChevronRightSharpIcon from '@mui/icons-material/ChevronRightSharp';
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
  const group = useSelector((state) => state.plugin.group);
  const plugins = useSelector((state) => state.plugin.plugins);
  console.log('................plugins.........', plugins);

  const activePlugin = plugins.find(plugin => plugin.instanceId === activeComponent);


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
          <div
            onClick={toggleSidebar}
            style={{
              position: 'absolute',
              padding: '5px',
              top: '10px',
              right: '-30px',
              backgroundColor: 'black',
              color: '#fff',
              borderRadius: '0 40% 40% 0',
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
          </div>

          {!isSidebarOpen && (
            <>
              <div
                style={{
                  width: '55%',
                  color: '#fff',
                  margin: '60% 0% 0% 20%',
                  display: 'inline-block',
                  borderBottom: activeComponent === 'dashboard' ? '3px solid yellow' : 'none', // Underline when active
                  paddingBottom: '5px', // Space between icon and underline
                }}
                onClick={() => setActiveComponent('dashboard')}
              >
                <Tooltip title="Dashboard" placement="right">
                  <DashboardIcon sx={{ fontSize: 30 }} />
                </Tooltip>
              </div>

              {plugins.length > 0 && [...plugins] // Create a shallow copy of the plugins array
                .sort((a, b) => a.instanceId.localeCompare(b.instanceId)) // Sorting by instanceId
                .map((plugin, index) => (
                  <div
                    key={index}
                    style={{
                      width: '45%',
                      backgroundColor: 'black',
                      color: '#fff',
                      margin: '20% 0% 0% 20%',
                      display: 'inline-block',
                      borderBottom: activeComponent === plugin.instanceId ? '3px solid yellow' : 'none', // Underline when active
                      paddingBottom: '5px', // Space between icon and underline
                    }}
                    onClick={() => setActiveComponent(plugin.instanceId)}
                  >
                    <Tooltip title={plugin.instanceId} placement="right">
                      <WysiwygSharpIcon />
                    </Tooltip>
                  </div>
                ))}
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

                {plugins.length > 0 && [...plugins] // Create a shallow copy of the plugins array
                  .sort((a, b) => a.instanceId.localeCompare(b.instanceId)) // Sorting by instanceId
                  .map((plugin, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        marginBottom: '5px',
                        alignItems: 'center',
                        cursor: 'pointer',
                        padding: '12px 10px',
                        fontSize: '16px',
                        fontFamily: '"Roboto", sans-serif',
                        fontWeight: '600',
                        color: activeComponent === plugin.instanceId ? '#4CAF50' : '#FFFFFF',
                        backgroundColor: activeComponent === plugin.instanceId ? '#1F2937' : 'transparent',
                        borderLeft: activeComponent === plugin.instanceId ? '4px solid #4CAF50' : 'none',
                        boxShadow: activeComponent === plugin.instanceId
                          ? '0 8px 12px rgba(0, 0, 0, 0.25)'
                          : '0 4px 6px rgba(0, 0, 0, 0.1)',
                        transition: 'transform 0.4s ease, background-color 0.4s ease, color 0.4s ease, box-shadow 0.4s ease, border-left 0.4s ease',
                        '&:hover': {
                          backgroundColor: '#374151',
                          color: '#E5E7EB',
                          boxShadow: '0 8px 12px rgba(0, 0, 0, 0.25)',
                        },
                        '&:active': {
                          transform: 'scale(0.98)',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                          borderLeft: '4px solid #2196F3',
                        },
                      }}
                      onClick={() => setActiveComponent(plugin.instanceId)}
                    >
                      {plugin.instanceId}
                    </Box>
                  ))}


                {/* Fixed Button */}

                {/* <Button
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
                </Button> */}
              </Box>
            </Box>


          )}

        </Box>

        {/* Main Content Area */}
        <Box sx={{ flex: 1, height: '94vh', overflowY: 'auto' }}>
          {activeComponent === 'dashboard' && <GridComponent />}
          {activeComponent === 'addPlugin' && <UploadFile />}
          {/* {activeComponent === 'addPlugin' && <AddPluginPage />} */}
          {plugins.map((plugin, index) => (

            <div key={plugin.instanceId} id={`plugin-container-${index}`}
              style={{ display: activeComponent === plugin.instanceId ? 'block' : 'none' }}>
              Loading
            </div>
          ))}
          <PluginRenderer activeComponent={activeComponent} plugins={plugins} />

        </Box>

        {activePlugin && (activePlugin.name || activePlugin.instanceId) !== 'Dashboard' && (
          <Chip
            label={activePlugin.name || activePlugin.instanceId}
            sx={{
              position: 'fixed',
              bottom: '15px',
              right: '20px',
              zIndex: 2000,
              px: 2.5,
              py: 1.2,
              fontSize: '0.8rem',
              background: 'linear-gradient(135deg, #f57c00, #fbc02d)',
              color: '#fff',
              fontWeight: 600,
              borderRadius: '10px',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
              textTransform: 'capitalize',
              letterSpacing: '0.6px',
              transition: 'all 0.3s ease-in-out',
              backdropFilter: 'blur(3px)',
              '& .MuiChip-icon': {
                color: '#fff',
                marginLeft: '-4px',
              },
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 10px 24px rgba(0, 0, 0, 0.25)',
              },
            }}
          />
        )}



      </Box>

    </div>
  );
}
